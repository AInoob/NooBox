import { EngineType } from '../utils/constants';
import { isDebugEnabled, logDebug } from '../utils/debugReporter';
import { buildEngineUrl } from './engineUrls';
import { GoogleDebugger } from './googleDebugger';

interface IEngineTabInfo {
  tabId: number;
  windowId: number;
  url: string;
  initialUrl: string;
  engine: EngineType;
  cursor: number;
  createdAt: number;
  imageUrl: string;
  closed?: boolean;
}

interface IEngineTabContext {
  cursor: number;
  engine: EngineType;
}

export interface IEngineTabHooks {
  handleEngineLinkUpdate: (
    cursor: number,
    engine: EngineType,
    url: string
  ) => Promise<void>;
  handleEngineError: (
    cursor: number,
    engine: EngineType,
    error: string
  ) => Promise<void>;
  handleFocusPrompt?: (
    cursor: number,
    engine: EngineType,
    pending: boolean
  ) => Promise<void>;
}

interface ICreateEngineTabOptions {
  useDebugger?: boolean;
}

export class EngineTabManager {
  private readonly hooks: IEngineTabHooks;
  private readonly tabsByCursor = new Map<
    number,
    Map<EngineType, IEngineTabInfo>
  >();
  private readonly cursorByTab = new Map<number, IEngineTabContext>();
  private readonly imageUrlByCursor = new Map<number, string>();
  private readonly searchTabByCursor = new Map<number, number>();
  private readonly cursorBySearchTab = new Map<number, number>();
  private readonly googleDebugger = new GoogleDebugger();
  private readonly pendingFocus = new Set<number>();
  private readonly focusedGoogleTabs = new Set<number>();

  constructor(hooks: IEngineTabHooks) {
    this.hooks = hooks;
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated);
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved);
  }

  public registerSearchTab(cursor: number, tabId: number) {
    const existing = this.searchTabByCursor.get(cursor);
    if (existing && existing !== tabId) {
      this.cursorBySearchTab.delete(existing);
    }
    this.searchTabByCursor.set(cursor, tabId);
    this.cursorBySearchTab.set(tabId, cursor);
  }

  public async openTabsForEngines(
    cursor: number,
    imageUrl: string,
    engines: EngineType[]
  ) {
    if (!engines.length) {
      return;
    }
    this.imageUrlByCursor.set(cursor, imageUrl);
    const debugEnabled = await this.isDebuggerEnabledSafely();
    for (const engine of engines) {
      try {
        const baseUrl = await buildEngineUrl(engine, imageUrl);
        const trackedUrl = this.appendTrackingParams(baseUrl, cursor, engine);
        await this.hooks.handleEngineLinkUpdate(cursor, engine, trackedUrl);
        const info = await this.createEngineTab(cursor, engine, trackedUrl, {
          useDebugger: debugEnabled && engine === 'google'
        });
        info.imageUrl = imageUrl;
        this.registerTab(info);
        if (engine === 'google') {
          await this.setPendingFocus(cursor, engine, true);
        }
        await logDebug({
          event: 'engine:tab_opened',
          engine,
          url: trackedUrl,
          extra: { cursor }
        }).catch(() => undefined);
      } catch (error) {
        await this.hooks
          .handleEngineError(
            cursor,
            engine,
            error instanceof Error ? error.message : String(error)
          )
          .catch(() => undefined);
      }
    }
  }

  public resolveContextByTab(tabId?: number | null): IEngineTabContext | null {
    if (!tabId) {
      return null;
    }
    return this.cursorByTab.get(tabId) || null;
  }

  public getEngineUrl(cursor: number, engine: EngineType) {
    return this.getEngineInfo(cursor, engine)?.url;
  }

  public updateKnownUrl(cursor: number, engine: EngineType, url?: string) {
    if (!url) {
      return;
    }
    const info = this.getEngineInfo(cursor, engine);
    if (info) {
      info.url = url;
    }
  }

  public async focusEngineTab(cursor: number, engine: EngineType) {
    const info = this.getEngineInfo(cursor, engine);
    if (info && !info.closed) {
      try {
        await this.focusTab(info.tabId, info.windowId);
        return;
      } catch {
        // fall through to reopen tab
      }
    }
    await this.reopenEngineTab(cursor, engine, info || null);
  }

  public async executeDebugScript(
    cursor: number,
    engine: EngineType,
    code: string
  ) {
    if (!code || !code.trim()) {
      throw new Error('Missing script code');
    }
    const info = this.getEngineInfo(cursor, engine);
    if (!info || info.closed) {
      throw new Error('Engine tab is not available');
    }
    if (engine === 'google' && (await this.isDebuggerEnabledSafely())) {
      return this.googleDebugger.evaluate(info.tabId, code);
    }
    return this.evaluateWithScripting(info.tabId, code);
  }

  public registerTab(info: IEngineTabInfo) {
    let perCursor = this.tabsByCursor.get(info.cursor);
    if (!perCursor) {
      perCursor = new Map();
      this.tabsByCursor.set(info.cursor, perCursor);
    }
    info.closed = false;
    perCursor.set(info.engine, info);
    this.cursorByTab.set(info.tabId, {
      cursor: info.cursor,
      engine: info.engine
    });
  }

  public closeEngineTabsForCursor(cursor: number) {
    const perCursor = this.tabsByCursor.get(cursor);
    if (!perCursor) {
      return;
    }
    perCursor.forEach((info) => {
      if (!info.closed) {
        chrome.tabs.remove(info.tabId, () => undefined);
        info.closed = true;
      }
      this.cursorByTab.delete(info.tabId);
      void this.googleDebugger.detach(info.tabId);
    });
    this.tabsByCursor.delete(cursor);
  }

  private getEngineInfo(cursor: number, engine: EngineType) {
    const perCursor = this.tabsByCursor.get(cursor);
    return perCursor ? perCursor.get(engine) || null : null;
  }

  private appendTrackingParams(
    rawUrl: string,
    cursor: number,
    engine: EngineType
  ) {
    try {
      const parsed = new URL(rawUrl);
      parsed.searchParams.set('noobox_cursor', String(cursor));
      parsed.searchParams.set('noobox_engine', engine);
      return parsed.toString();
    } catch {
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${separator}noobox_cursor=${cursor}&noobox_engine=${engine}`;
    }
  }

  private async reopenEngineTab(
    cursor: number,
    engine: EngineType,
    existing: IEngineTabInfo | null
  ) {
    const imageUrl = existing?.imageUrl || this.imageUrlByCursor.get(cursor);
    if (!imageUrl) {
      await this.hooks
        .handleEngineError(cursor, engine, 'Missing image URL for reopen')
        .catch(() => undefined);
      return;
    }
    try {
      const baseUrl = await buildEngineUrl(engine, imageUrl);
      const trackedUrl = this.appendTrackingParams(baseUrl, cursor, engine);
      await this.hooks.handleEngineLinkUpdate(cursor, engine, trackedUrl);
      const debugEnabled = await this.isDebuggerEnabledSafely();
      const info = await this.createEngineTab(cursor, engine, trackedUrl, {
        useDebugger: debugEnabled && engine === 'google'
      });
      info.imageUrl = imageUrl;
      this.registerTab(info);
    } catch (error) {
      await this.hooks
        .handleEngineError(
          cursor,
          engine,
          error instanceof Error ? error.message : String(error)
        )
        .catch(() => undefined);
    }
  }

  private async createEngineTab(
    cursor: number,
    engine: EngineType,
    url: string,
    options: ICreateEngineTabOptions = {}
  ) {
    const index = await this.getInsertionIndex();
    const createProperties: chrome.tabs.CreateProperties = {
      url: options.useDebugger ? 'about:blank' : url,
      active: false,
      index: typeof index === 'number' ? index + 1 : undefined
    };
    const tab = await this.createTab(createProperties);
    if (!tab.id || tab.windowId == null) {
      throw new Error('Failed to create tab');
    }
    if (options.useDebugger) {
      try {
        await this.googleDebugger.prepareTab(tab.id, url);
      } catch (error) {
        chrome.tabs.remove(tab.id, () => undefined);
        throw error instanceof Error
          ? error
          : new Error(error ? String(error) : 'Failed to prepare debugger');
      }
    }
    const info: IEngineTabInfo = {
      tabId: tab.id,
      windowId: tab.windowId,
      url,
      initialUrl: url,
      createdAt: Date.now(),
      engine,
      cursor,
      imageUrl: ''
    };
    return info;
  }

  private async injectEngineScripts(info: IEngineTabInfo) {
    const scriptPath = `contentScript/engines/${info.engine}.js`;
    await this.executeScriptFiles(info.tabId, [
      'contentScript/engines/common.js',
      scriptPath
    ]);
    chrome.tabs.sendMessage(
      info.tabId,
      {
        type: 'engine:init',
        cursor: info.cursor,
        engine: info.engine,
        imageUrl: info.imageUrl || null
      },
      () => {
        const lastError = chrome.runtime.lastError;
        if (lastError?.message) {
          console.debug('engine:init sendMessage error', lastError.message);
        }
      }
    );
    await logDebug({
      event: 'engine:tab_injected',
      engine: info.engine,
      url: info.url,
      extra: { cursor: info.cursor }
    }).catch(() => undefined);
  }

  private executeScriptFiles(tabId: number, files: string[]) {
    const scripting = (chrome as any).scripting;
    if (scripting?.executeScript) {
      return scripting.executeScript({
        target: { tabId },
        files
      });
    }
    return files.reduce((promise, file) => {
      return promise.then(
        () =>
          new Promise<void>((resolve, reject) => {
            chrome.tabs.executeScript(tabId, { file }, () => {
              const lastError = chrome.runtime.lastError;
              if (lastError?.message) {
                reject(new Error(lastError.message));
                return;
              }
              resolve();
            });
          })
      );
    }, Promise.resolve());
  }

  private async focusTab(tabId: number, windowId: number) {
    await new Promise<void>((resolve, reject) => {
      chrome.tabs.update(tabId, { active: true }, () => {
        const err = chrome.runtime.lastError;
        if (err?.message) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
    await new Promise<void>((resolve, reject) => {
      chrome.windows.update(windowId, { focused: true }, () => {
        const err = chrome.runtime.lastError;
        if (err?.message) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
  }

  private createTab(options: chrome.tabs.CreateProperties) {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
      chrome.tabs.create(options, (tab) => {
        const err = chrome.runtime.lastError;
        if (err?.message) {
          reject(new Error(err.message));
        } else {
          resolve(tab);
        }
      });
    });
  }

  private getInsertionIndex() {
    return new Promise<number | null>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0 && typeof tabs[0].index === 'number') {
          resolve(tabs[0].index);
        } else {
          resolve(null);
        }
      });
    });
  }

  private async evaluateWithScripting(tabId: number, snippet: string) {
    const scripting = (chrome as any).scripting;
    if (!scripting?.executeScript) {
      throw new Error('Scripting API is not available');
    }
    const runnerSource = `"use strict";
return (async () => {
  try {
${snippet}
  } catch (error) {
    return { __nooboxEvalError: error && error.message ? error.message : String(error) };
  }
})();
`;
    // tslint:disable-next-line:function-constructor
    const runner = new Function(runnerSource);
    const results = await scripting.executeScript({
      target: { tabId },
      func: runner,
      world: 'ISOLATED'
    });
    const payload = results && results.length ? results[0].result : null;
    if (payload && typeof payload === 'object' && payload.__nooboxEvalError) {
      throw new Error(payload.__nooboxEvalError);
    }
    return payload ?? null;
  }

  private async bounceFocusForGoogle(info: IEngineTabInfo) {
    if (
      this.pendingFocus.has(info.tabId) ||
      this.focusedGoogleTabs.has(info.tabId)
    ) {
      return;
    }
    if (!(await this.isDebuggerEnabledSafely())) {
      return;
    }
    this.pendingFocus.add(info.tabId);
    await this.setPendingFocus(info.cursor, info.engine, true);
    try {
      await this.googleDebugger.bringToFront(info.tabId);
      await this.wait(1200);
      await this.googleDebugger.scrollToBottom(info.tabId);
      await this.wait(800);
    } catch {
      this.pendingFocus.delete(info.tabId);
      await this.setPendingFocus(info.cursor, info.engine, false);
      return;
    }
    const searchTabId = this.searchTabByCursor.get(info.cursor);
    if (searchTabId != null) {
      chrome.tabs.update(searchTabId, { active: true }, () => undefined);
    }
    this.focusedGoogleTabs.add(info.tabId);
    this.pendingFocus.delete(info.tabId);
    await this.setPendingFocus(info.cursor, info.engine, false);
  }

  private wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  private async setPendingFocus(
    cursor: number,
    engine: EngineType,
    pending: boolean
  ) {
    try {
      await this.hooks.handleFocusPrompt?.(cursor, engine, pending);
    } catch {
      // ignore
    }
  }

  private async isDebuggerEnabledSafely() {
    try {
      return await isDebugEnabled();
    } catch {
      return false;
    }
  }

  private handleTabUpdated = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo
  ) => {
    const context = this.cursorByTab.get(tabId);
    if (!context) {
      return;
    }
    const info = this.getEngineInfo(context.cursor, context.engine);
    if (!info) {
      return;
    }
    if (changeInfo.url) {
      info.url = changeInfo.url;
      this.hooks
        .handleEngineLinkUpdate(context.cursor, context.engine, changeInfo.url)
        .catch(() => undefined);
      if (
        info.engine === 'google' &&
        this.shouldAutoFocusGoogle(changeInfo.url)
      ) {
        this.bounceFocusForGoogle(info).catch(() => undefined);
      }
    }
    if (changeInfo.status === 'complete' && !info.closed) {
      this.injectEngineScripts(info).catch((error) => {
        this.hooks
          .handleEngineError(
            context.cursor,
            context.engine,
            error instanceof Error ? error.message : String(error)
          )
          .catch(() => undefined);
      });
    }
  };

  private handleTabRemoved = (tabId: number) => {
    const searchCursor = this.cursorBySearchTab.get(tabId);
    if (searchCursor != null) {
      this.cursorBySearchTab.delete(tabId);
      this.searchTabByCursor.delete(searchCursor);
      this.imageUrlByCursor.delete(searchCursor);
      this.closeEngineTabsForCursor(searchCursor);
      return;
    }
    const ctx = this.cursorByTab.get(tabId);
    if (!ctx) {
      return;
    }
    this.cursorByTab.delete(tabId);
    const info = this.getEngineInfo(ctx.cursor, ctx.engine);
    if (info && info.tabId === tabId) {
      info.closed = true;
      void this.googleDebugger.detach(tabId);
      this.focusedGoogleTabs.delete(tabId);
      this.pendingFocus.delete(tabId);
      void this.setPendingFocus(info.cursor, info.engine, false);
    }
  };

  private shouldAutoFocusGoogle(url: string) {
    try {
      const parsed = new URL(url);
      return (
        parsed.hostname.includes('google.') && parsed.pathname === '/search'
      );
    } catch {
      return false;
    }
  }
}
