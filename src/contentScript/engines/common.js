(function() {
  if (window.__nooboxEngineBootstrap) {
    return;
  }

  function getCursorFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const cursor = params.get('noobox_cursor');
      if (cursor) {
        const parsed = parseInt(cursor, 10);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
      const hash = window.location.hash || '';
      const match = hash.match(/noobox_cursor=(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    } catch (error) {
      console.debug('Unable to parse cursor from URL', error);
    }
    return null;
  }

  function onReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  function absolutize(url) {
    if (!url) {
      return '';
    }
    try {
      return new URL(url, window.location.href).toString();
    } catch {
      return url;
    }
  }

  window.__nooboxEngineBootstrap = function(engine, runner) {
    let cursor = getCursorFromUrl();
    let started = false;
    const extras = {};

    const send = (type, payload) => {
      if (cursor == null || Number.isNaN(cursor)) {
        return;
      }
      try {
        chrome.runtime.sendMessage(
          Object.assign(
            {
              type,
              engine,
              cursor
            },
            payload || {}
          )
        );
      } catch (error) {
        console.debug('NooBox sendMessage failed', error);
      }
    };

    const context = {
      engine,
      get cursor() {
        return cursor;
      },
      onReady,
      getImageUrl: () => extras.imageUrl || null,
      postResult: (payload) =>
        send(
          'engine:result',
          Object.assign(
            {
              url: window.location.href,
              docTitle: document.title
            },
            payload || {}
          )
        ),
      postError: (message) =>
        send('engine:error', {
          error: message || 'Unknown error'
        }),
      postProgress: (payload) => send('engine:progress', payload || {}),
      absolutize
    };

    const start = () => {
      if (started || cursor == null || Number.isNaN(cursor)) {
        return;
      }
      started = true;
      try {
        runner(context);
      } catch (error) {
        send('engine:error', {
          error: error && error.message ? error.message : String(error)
        });
      }
    };

    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === 'engine:init' && message.engine === engine) {
        if (message.imageUrl) {
          extras.imageUrl = message.imageUrl;
        }
        const parsed = Number(message.cursor);
        if (!Number.isNaN(parsed)) {
          cursor = parsed;
          start();
        }
      }
    });

    start();
  };
})();
