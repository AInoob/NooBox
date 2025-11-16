import { get } from '../utils/db';
import { isDebugEnabled, logDebug } from '../utils/debugReporter';
import { getI18nMessage } from '../utils/getI18nMessage';
import { getGlobalScope } from '../utils/runtime';
import { sendMessageToBackground } from '../utils/sendMessageToBackground';

interface ICommand {
  id: string;
  type: string;
  payload?: any;
}

const DEBUG_ENDPOINT = 'http://localhost:3030';
const COMMAND_POLL_INTERVAL = 8000;
const HEARTBEAT_INTERVAL = 15000;

let clientId: string | null = null;

const getClientId = async () => {
  if (clientId) {
    return clientId;
  }
  try {
    clientId = (await get('userId')) || null;
  } catch {
    clientId = null;
  }
  if (!clientId) {
    clientId = `anon-${Math.random()
      .toString(36)
      .slice(2)}`;
  }
  return clientId;
};

const fetchCommand = async (): Promise<ICommand | null> => {
  try {
    const res = await fetch(`${DEBUG_ENDPOINT}/command`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data && data.id ? data : null;
  } catch {
    return null;
  }
};

const postResult = async (result: any) => {
  try {
    await fetch(`${DEBUG_ENDPOINT}/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    });
  } catch {
    // ignore
  }
};

const sendHeartbeat = async () => {
  try {
    const enabled = await isDebugEnabled();
    if (!enabled) {
      return;
    }
    const id = await getClientId();
    await fetch(`${DEBUG_ENDPOINT}/heartbeat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
  } catch {
    // ignore heartbeat failures
  }
};

const handleReload = async (command: ICommand) => {
  try {
    await logDebug({
      event: 'reload:requested',
      tag: 'debug'
    });
    await postResult({
      id: command.id,
      type: command.type,
      status: 'ok',
      message: 'Reloading extension'
    });
  } finally {
    // Attempt to reload extension
    try {
      chrome.runtime.reload();
    } catch (err) {
      await postResult({
        id: command.id,
        type: command.type,
        status: 'error',
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }
};

const handleImageSearch = async (command: ICommand) => {
  const base64OrUrl = command.payload?.base64OrUrl || command.payload?.url;
  if (!base64OrUrl) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: 'Missing base64OrUrl payload'
    });
    return;
  }
  try {
    const globalScope = getGlobalScope() as any;
    if (globalScope?.nooboxImage?.beginImageSearch) {
      await globalScope.nooboxImage.beginImageSearch(base64OrUrl);
    } else {
      await sendMessageToBackground({
        job: 'beginImageSearch',
        value: { base64OrUrl }
      });
    }
    await postResult({
      id: command.id,
      type: command.type,
      status: 'ok',
      message: 'Image search requested'
    });
  } catch (error) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

const handleEngineEval = async (command: ICommand) => {
  const engine = command.payload?.engine;
  const cursor = command.payload?.cursor;
  const code = command.payload?.code;
  if (!engine) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: 'Missing engine'
    });
    return;
  }
  if (typeof cursor !== 'number') {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: 'Missing cursor'
    });
    return;
  }
  if (!code) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: 'Missing code'
    });
    return;
  }
  try {
    const globalScope = getGlobalScope() as any;
    let response: any = null;
    if (globalScope?.nooboxImage?.debugEngineEval) {
      try {
        const result = await globalScope.nooboxImage.debugEngineEval(
          cursor,
          engine,
          code
        );
        response = { ok: true, result };
      } catch (error) {
        response = {
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    } else {
      response = await sendMessageToBackground({
        job: 'debugEngineEval',
        value: { engine, cursor, code }
      });
    }
    if (response?.ok === false) {
      console.error('[NooBox][engineEval] failed', command.id, response);
      await postResult({
        id: command.id,
        type: command.type,
        status: 'error',
        error: response?.error || 'Evaluation failed'
      });
      return;
    }
    await postResult({
      id: command.id,
      type: command.type,
      status: 'ok',
      parsed: {
        engine,
        cursor,
        result: response?.result ?? null,
        ts: Date.now(),
        code
      }
    });
  } catch (error) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

const handleNotify = async (command: ICommand) => {
  const title =
    command.payload?.title ||
    getI18nMessage('focus_google_notification_title') ||
    'NooBox Notification';
  const message =
    command.payload?.message ||
    getI18nMessage('focus_google_notification_message') ||
    'NooBox debug notification.';
  try {
    await new Promise<void>((resolve, reject) => {
      chrome.notifications.create(
        {
          type: 'basic',
          iconUrl: chrome.runtime.getURL('images/icon_128.png'),
          title,
          message,
          priority: 0
        },
        () => {
          const err = chrome.runtime.lastError;
          if (err) {
            reject(new Error(err.message));
            return;
          }
          resolve();
        }
      );
    });
    await postResult({
      id: command.id,
      type: command.type,
      status: 'ok',
      message: 'Notification displayed'
    });
  } catch (error) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const startDebugCommandPolling = () => {
  let timer: ReturnType<typeof setInterval> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const tick = async () => {
    const enabled = await isDebugEnabled();
    if (!enabled) {
      return;
    }

    const command = await fetchCommand();
    if (!command) {
      return;
    }

    await logDebug({
      event: 'debug:command:received',
      tag: command.type,
      extra: command.payload
    });

    switch (command.type) {
      case 'reload':
        await handleReload(command);
        break;
      case 'imageSearch':
        await handleImageSearch(command);
        break;
      case 'engineEval':
        await handleEngineEval(command);
        break;
      case 'notify':
        await handleNotify(command);
        break;
      default:
        await postResult({
          id: command.id,
          type: command.type,
          status: 'ignored',
          error: 'Unknown command'
        });
        break;
    }
  };

  if (!timer) {
    timer = setInterval(tick, COMMAND_POLL_INTERVAL);
    // best-effort attach for debugging visibility
    (getGlobalScope() as any).nooboxDebugCommandTick = tick;
  }

  if (!heartbeatTimer) {
    heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    (getGlobalScope() as any).nooboxDebugHeartbeat = sendHeartbeat;
  }
};
