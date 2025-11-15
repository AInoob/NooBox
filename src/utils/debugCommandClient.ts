import { YandexImageSearch } from '../background/imageSearch/yandexImageSearch';
import { ajax } from './ajax';
import { get } from './db';
import { isDebugEnabled, logDebug } from './debugReporter';
import { getGlobalScope } from './runtime';

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

const handleYandexSearch = async (command: ICommand) => {
  const url = command.payload?.url;
  if (!url) {
    return;
  }

  try {
    const { body, responseUrl } = await ajax({
      url: `https://yandex.com/images/search?url=${encodeURIComponent(
        url
      )}&rpt=imageview`,
      debugTag: 'yandex:debug-pull',
      debugBody: true
    });

    const yandex = new YandexImageSearch('yandex' as any);
    const parsedData = await yandex.extractForDebug(body, responseUrl);

    await postResult({
      id: command.id,
      type: command.type,
      status: 'ok',
      responseUrl,
      title: parsedData.title || '',
      parsed: {
        keywords: parsedData.keywords || [],
        results: parsedData.results || []
      },
      body
    });
  } catch (error) {
    await postResult({
      id: command.id,
      type: command.type,
      status: 'error',
      error: error?.message || String(error)
    });
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
      case 'yandexSearch':
        await handleYandexSearch(command);
        break;
      case 'reload':
        await handleReload(command);
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
