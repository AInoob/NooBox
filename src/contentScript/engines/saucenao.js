(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('saucenao', function(ctx) {
    const CF_SELECTORS = [
      '#cf-challenge-form',
      '#challenge-form',
      '#cf-challenge-running',
      '#challenge-stage',
      '.cf-browser-verification',
      '.cf-im-under-attack',
      '.hcaptcha-box'
    ];
    const MAX_IDLE_AFTER_READY = 12000;
    let focusRequested = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const isCloudflareChallenge = () => {
      if (CF_SELECTORS.some((selector) => document.querySelector(selector))) {
        return true;
      }
      const text = (document.body?.innerText || '').toLowerCase();
      if (!text) {
        return false;
      }
      return (
        text.includes('checking your browser before accessing') ||
        text.includes('cloudflare')
      );
    };

    const requestManualVerification = () => {
      if (!isCloudflareChallenge()) {
        return false;
      }
      if (!focusRequested) {
        focusRequested = true;
        try {
          ctx.postProgress({
            stage: 'saucenao:cloudflare',
            message: 'Cloudflare verification required'
          });
        } catch (error) {
          console.debug('[NooBox][SauceNao] progress failed', error);
        }
      }
      return true;
    };

    const collectResults = () => {
      const container = document.getElementsByClassName('result');
      const items = [];
      for (let i = 1; i < container.length; i++) {
        const node = container[i];
        const entry = {
          title: '',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: ''
        };
        const imageBlock = node.getElementsByClassName('resultimage')[0];
        if (imageBlock) {
          const link = imageBlock.querySelector('a[href]');
          if (link) {
            entry.sourceUrl = ctx.absolutize(link.getAttribute('href') || '');
          }
          const img = imageBlock.querySelector('img');
          if (img) {
            entry.thumbUrl = img.getAttribute('data-src') || img.getAttribute('src') || '';
            entry.imageUrl = entry.thumbUrl;
          }
        }
        const content = node.getElementsByClassName('resultcontent')[0];
        if (content) {
          const strong = content.querySelector('strong');
          if (strong) {
            entry.title = strong.textContent || '';
          }
        }
        items.push(entry);
      }
      return items;
    };

    const waitForResults = async () => {
      let countdownAnchor = Date.now();
      while (true) {
        if (requestManualVerification()) {
          countdownAnchor = Date.now();
          await sleep(1200);
          continue;
        }
        const results = collectResults();
        if (results.length) {
          return results;
        }
        if (Date.now() - countdownAnchor > MAX_IDLE_AFTER_READY) {
          return results;
        }
        await sleep(400);
      }
    };

    const sendResults = async () => {
      try {
        const results = await waitForResults();
        ctx.postResult({
          keyword: '',
          results
        });
      } catch (error) {
        ctx.postError(error && error.message ? error.message : String(error));
      }
    };

    ctx.onReady(() => {
      sendResults();
    });
  });
})();
