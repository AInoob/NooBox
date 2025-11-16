interface IDebuggerSession {
  tabId: number;
  target: chrome.debugger.Debuggee;
  attachedAt: number;
}

/**
 * Handles CDP attachments for Google result tabs so we can bypass CSP and
 * evaluate arbitrary expressions from the debug server.
 */
export class GoogleDebugger {
  private readonly protocolVersion = '1.3';
  private readonly sessions = new Map<number, IDebuggerSession>();
  private readonly pendingSessions = new Map<
    number,
    Promise<IDebuggerSession>
  >();

  constructor() {
    chrome.tabs.onRemoved.addListener((tabId) => {
      void this.detach(tabId);
    });
    chrome.debugger.onDetach.addListener((source) => {
      if (source.tabId != null) {
        this.sessions.delete(source.tabId);
      }
    });
    chrome.debugger.onEvent.addListener((source, method, params?: any) => {
      if (!source.tabId || !this.sessions.has(source.tabId)) {
        return;
      }
      if (method === 'Runtime.consoleAPICalled') {
        const args = (params?.args as any[]) || [];
        const payload = args.map((arg: any) => {
          if (Object.prototype.hasOwnProperty.call(arg, 'value')) {
            return arg.value;
          }
          return arg.description;
        });
        console.debug('[GoogleDebugger][console]', source.tabId, payload);
      } else if (method === 'Runtime.exceptionThrown') {
        const description =
          params?.exceptionDetails?.exception?.description ||
          params?.exceptionDetails?.text;
        if (description) {
          console.warn(
            '[GoogleDebugger][exception]',
            source.tabId,
            description
          );
        }
      }
    });
  }

  public async prepareTab(tabId: number, targetUrl: string) {
    const session = await this.ensureSession(tabId);
    await this.sendCommand(session.target, 'Page.enable');
    await this.sendCommand(session.target, 'Runtime.enable');
    await this.sendCommand(session.target, 'DOM.enable');
    await this.sendCommand(session.target, 'Network.enable');
    await this.sendCommand(session.target, 'Target.setAutoAttach', {
      autoAttach: true,
      flatten: true,
      waitForDebuggerOnStart: false
    });
    await this.sendCommand(session.target, 'Page.setBypassCSP', {
      enabled: true
    });
    await this.sendCommand(session.target, 'Page.navigate', {
      url: targetUrl
    });
  }

  public async evaluate(tabId: number, expression: string) {
    const session = await this.ensureSession(tabId);
    const response = await this.sendCommand<any>(
      session.target,
      'Runtime.evaluate',
      {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
        replMode: true
      }
    );
    if (response?.exceptionDetails) {
      const details = response.exceptionDetails;
      const message =
        details?.exception?.description || details?.text || 'Evaluation failed';
      throw new Error(message);
    }
    const result = response?.result;
    if (!result) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(result, 'value')) {
      return result.value;
    }
    return result.description ?? null;
  }

  public async bringToFront(tabId: number) {
    const session = await this.ensureSession(tabId);
    await this.sendCommand(session.target, 'Page.bringToFront');
  }

  public async scrollToBottom(tabId: number) {
    const session = await this.ensureSession(tabId);
    await this.sendCommand(session.target, 'Runtime.evaluate', {
      expression: `(() => {
        const startScroll = () => {
          const doc = document.scrollingElement || document.documentElement || document.body;
          if (!doc) {
            return;
          }
          const target = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 0), 0);
          window.scrollTo({ top: target, behavior: 'auto' });
        };
        startScroll();
        if (window.__nooboxScrollTimer) {
          clearInterval(window.__nooboxScrollTimer);
        }
        window.__nooboxScrollTimer = setInterval(() => {
          const doc = document.scrollingElement || document.documentElement || document.body;
          if (!doc) {
            return;
          }
          const target = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 0), 0);
          window.scrollTo({ top: target, behavior: 'auto' });
          const current = window.scrollY || doc.scrollTop || 0;
          if (Math.abs(target - current) < 5) {
            clearInterval(window.__nooboxScrollTimer);
            window.__nooboxScrollTimer = null;
          }
        }, 600);
        setTimeout(() => {
          if (window.__nooboxScrollTimer) {
            clearInterval(window.__nooboxScrollTimer);
            window.__nooboxScrollTimer = null;
          }
        }, 6000);
      })();`,
      awaitPromise: false
    });
  }

  public async detach(tabId: number) {
    const session = this.sessions.get(tabId);
    if (!session) {
      return;
    }
    await new Promise<void>((resolve) => {
      chrome.debugger.detach(session.target, () => {
        this.sessions.delete(tabId);
        resolve();
      });
    }).catch(() => undefined);
  }

  private ensureSession(tabId: number) {
    if (this.sessions.has(tabId)) {
      return Promise.resolve(this.sessions.get(tabId)!);
    }
    let pending = this.pendingSessions.get(tabId);
    if (pending) {
      return pending;
    }
    pending = this.attach(tabId);
    this.pendingSessions.set(tabId, pending);
    pending.finally(() => {
      this.pendingSessions.delete(tabId);
    });
    return pending;
  }

  private async attach(tabId: number): Promise<IDebuggerSession> {
    if (!chrome.debugger) {
      throw new Error('Debugger API is not available');
    }
    const target: chrome.debugger.Debuggee = { tabId };
    await new Promise<void>((resolve, reject) => {
      chrome.debugger.attach(target, this.protocolVersion, () => {
        const error = chrome.runtime.lastError;
        if (error && error.message) {
          reject(new Error(error.message));
          return;
        }
        resolve();
      });
    });
    const session: IDebuggerSession = {
      tabId,
      target,
      attachedAt: Date.now()
    };
    this.sessions.set(tabId, session);
    return session;
  }

  private sendCommand<T = any>(
    target: chrome.debugger.Debuggee,
    method: string,
    params?: Record<string, any>
  ): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, reject) => {
      chrome.debugger.sendCommand(target, method, params || {}, (result) => {
        const error = chrome.runtime.lastError;
        if (error && error.message) {
          reject(new Error(error.message));
          return;
        }
        resolve(result as T);
      });
    });
  }
}
