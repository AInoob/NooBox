(function () {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('google', function (ctx) {
    const GOOGLE_SEARCH = 'https://www.google.com/search';
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();

    const MAX_THUMB_WAIT = 30000;
    const UPDATE_DEBOUNCE_MS = 500;
    const EXTRA_REFRESHES = [1200, 3500, 7000];

    const state = {
      aiOverview: null,
      sectionErrors: []
    };
    const sectionErrorKeys = new Set();
    const logProgress = (stage, message) => {
      try {
        ctx.postProgress({ stage, message });
      } catch {}
    };
    const reportSectionError = (section, error) => {
      const message = error instanceof Error ? error.message : String(error);
      const key = `${section}:${message}`;
      if (!sectionErrorKeys.has(key)) {
        sectionErrorKeys.add(key);
        state.sectionErrors.push({ section, message });
      }
      logProgress(`google:${section}_error`, message);
    };
    const THUMB_SCROLL_DELAY = 120;
    const THUMB_POLL_INTERVAL_MS = 1000;
    const THUMB_POLL_TIMEOUT_MS = 30000;
    const thumbPollers = new WeakMap();

    const isLensHost = () => window.location.hostname.includes('lens.google.com');
    const isSearchPage = () =>
      window.location.hostname.includes('google.') && window.location.pathname === '/search';

    const getCursorFromLocation = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const cursor = params.get('noobox_cursor');
        if (cursor) {
          const parsed = parseInt(cursor, 10);
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }
      } catch {}
      return null;
    };

    const getImageUrlFromLocation = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('noobox_image_url');
        if (encoded) {
          return decodeURIComponent(encoded);
        }
        return params.get('image_url') || '';
      } catch {
        return '';
      }
    };

    const waitForImageUrl = async () => {
      const start = Date.now();
      const timeout = 15000;
      while (Date.now() - start < timeout) {
        const stored = ctx.getImageUrl?.();
        const fallback = getImageUrlFromLocation();
        if (stored || fallback) {
          return stored || fallback;
        }
        await sleep(200);
      }
      throw new Error('Missing image URL for Google search');
    };

    const navigateToLens = (imageUrl) => {
      const cursorParam = ctx.cursor ?? getCursorFromLocation();
      const params = new URLSearchParams();
      params.set('url', imageUrl);
      if (cursorParam != null) {
        params.set('noobox_cursor', String(cursorParam));
      }
      params.set('noobox_engine', 'google');
      params.set('noobox_image_url', imageUrl);
      params.set('hl', 'en');
      const target = `https://lens.google.com/uploadbyurl?${params.toString()}`;
      window.location.replace(target);
    };

    const extractKeyword = () => '';

    const parseDims = (text) => {
      if (!text) {
        return null;
      }
      const match = text.match(/(\d{2,5})\s*[×x]\s*(\d{2,5})/);
      return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
    };

    const getImgSrc = (img) => {
      if (!img) {
        return '';
      }
      const attrs = ['src', 'data-src', 'data-lz', 'data-deferred-src'];
      for (const attr of attrs) {
        const value = img.getAttribute(attr);
        if (value) {
          return value;
        }
      }
      if (img.dataset) {
        return img.dataset.src || img.dataset.lz || img.dataset.deferredSrc || '';
      }
      return '';
    };

    const isPreferredThumb = (url) => {
      if (!url || url.startsWith('data:')) {
        return false;
      }
      return /encrypted-tbn|gstatic|googleusercontent/.test(url);
    };

    const resolveSiteThumb = (container) => {
      if (!container) {
        return '';
      }
      const selectors = [
        '.LnCrMe img',
        '.szUakf img',
        'img.VeBrne',
        '.uhHOwf img',
        'img[src*="encrypted-tbn"]'
      ];
      for (const selector of selectors) {
        const img = container.querySelector(selector);
        const src = getImgSrc(img);
        if (isPreferredThumb(src)) {
          return src;
        }
      }
      const fallback = Array.from(container.querySelectorAll('img'));
      for (const img of fallback) {
        const src = getImgSrc(img);
        if (isPreferredThumb(src)) {
          return src;
        }
      }
      return '';
    };

    const extractSiteResults = () => {
      try {
        const results = [];
        const seen = new Set();
        const anchors = Array.from(document.querySelectorAll('a h3')).map((h3) =>
          h3.closest('a[href]')
        );
        anchors.forEach((anchor) => {
          if (!anchor) {
            return;
          }
          const href = anchor.getAttribute('href');
          if (!href) {
            return;
          }
          const url = ctx.absolutize(href);
          if (!url || seen.has(url)) {
            return;
          }
          seen.add(url);
          const title = anchor.textContent?.trim() || '';
          let description = '';
          let thumbUrl = '';
          const container = anchor.closest('.g, .SoaBEf, .kvH3mc, .hlcw0c, .Ww4FFb');
          if (container) {
            const snippet = container.querySelector('.VwiC3b, .BNeawe, .fYyStc, .PZPZlf, .s3v9rd');
            if (snippet && snippet.textContent) {
              description = snippet.textContent.trim();
            }
            thumbUrl = resolveSiteThumb(container);
          }
          results.push({
            title,
            sourceUrl: url,
            description,
            imageUrl: '',
            thumbUrl,
            width: null,
            height: null
          });
        });
        return results;
      } catch (error) {
        reportSectionError('site', error);
        return [];
      }
    };

    const findSectionByHeading = (text) => {
      const lower = text.toLowerCase();
      const headings = Array.from(document.querySelectorAll('h2, h3, [role="heading"]'));
      const match = headings.find((node) => cleanText(node.textContent).toLowerCase().includes(lower));
      return match ? match.closest('div') || match.parentElement : null;
    };

    const tryScrollElementIntoView = (element, delay = 0) => {
      if (!element) {
        return;
      }
      setTimeout(() => {
        if (!document.contains(element)) {
          return;
        }
        try {
          element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
        } catch {
          const rect = element.getBoundingClientRect();
          const targetTop = Math.max(rect.top + window.scrollY - window.innerHeight / 2, 0);
          window.scrollTo({ top: targetTop, behavior: 'auto' });
        }
      }, delay);
    };

    const driveSiteThumbnailsIntoView = () => {
      const cards = Array.from(
        document.querySelectorAll('.g, .SoaBEf, .kvH3mc, .hlcw0c, .Ww4FFb')
      );
      cards.forEach((card, index) => {
        const thumb = card.querySelector(
          '.LnCrMe img, .szUakf img, img.VeBrne, img.XNo5Ab, img[src*="encrypted-tbn"]'
        );
        if (!thumb) {
          return;
        }
        if (thumb.complete && thumb.naturalWidth) {
          return;
        }
        const delay = Math.min(index * THUMB_SCROLL_DELAY, 4000);
        tryScrollElementIntoView(card, delay);
      });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    };

    const hydrateThumbFromInlineMap = (img) => {
      const googleObj = window.google || window['google'];
      const ldi = googleObj && googleObj.ldi;
      if (!ldi) {
        return false;
      }
      const key = img.id || img.getAttribute('data-iid');
      if (!key) {
        return false;
      }
      const mappedSrc = ldi[key];
      if (!mappedSrc) {
        return false;
      }
      if (!img.src || img.src.startsWith('data:') || img.dataset.nooboxThumbStatus !== 'loaded') {
        img.src = mappedSrc;
        logProgress('google:thumb_inline_map', `hydrated ${key}`);
      }
      return true;
    };

    const hydrateThumbFromDataSrc = (img) => {
      const dataSrc = img.getAttribute('data-src');
      if (!dataSrc) {
        return false;
      }
      if (!img.src || img.src.startsWith('data:')) {
        img.src = dataSrc;
        logProgress('google:thumb_data_src', `applied data-src for ${img.getAttribute('data-iid') || img.id || 'unknown'}`);
        return true;
      }
      return false;
    };

    const bringThumbnailsIntoView = (section) => {
      if (!section) {
        return;
      }
      const images = Array.from(section.querySelectorAll('img'));
      let scheduledCount = 0;
      let loadedCount = 0;
      images.forEach((img, index) => {
        if (!img) {
          return;
        }
        if (!img.complete || !img.naturalWidth) {
          hydrateThumbFromInlineMap(img) || hydrateThumbFromDataSrc(img);
        }
        if (img.dataset.nooboxThumbStatus === 'loaded') {
          loadedCount++;
          return;
        }
        if (img.complete && img.naturalWidth) {
          img.dataset.nooboxThumbStatus = 'loaded';
          loadedCount++;
          return;
        }
        if (img.dataset.nooboxThumbStatus === 'scheduled') {
          return;
        }
        img.dataset.nooboxThumbStatus = 'scheduled';
        const delay = Math.min(index * THUMB_SCROLL_DELAY, 3000);
        scheduledCount++;
        tryScrollElementIntoView(img, delay);
        img.addEventListener(
          'load',
          () => {
            img.dataset.nooboxThumbStatus = 'loaded';
            logProgress('google:thumb_loaded', `loaded ${img.currentSrc || img.src || 'unknown'}`);
          },
          { once: true }
        );
      });
      if (scheduledCount || loadedCount) {
        logProgress(
          'google:thumb_scroll',
          `scheduled=${scheduledCount} loaded=${loadedCount} total=${images.length}`
        );
      }
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    };

    const startThumbnailPolling = (section) => {
      if (!section || thumbPollers.has(section)) {
        return;
      }
      const state = {
        start: Date.now(),
        timer: null,
        stopped: false
      };

      const stop = (reason) => {
        if (state.stopped) {
          return;
        }
        state.stopped = true;
        if (state.timer) {
          clearInterval(state.timer);
          state.timer = null;
        }
        thumbPollers.delete(section);
        logProgress('google:thumb_poll_stop', reason || 'stopped');
      };

      const tick = () => {
        if (state.stopped) {
          return;
        }
        const elapsed = Date.now() - state.start;
        bringThumbnailsIntoView(section);
        driveSiteThumbnailsIntoView();
        postSnapshot(true);
        const pending = Array.from(section.querySelectorAll('img')).some(
          (img) => !img.complete || !img.naturalWidth
        );
        logProgress(
          'google:thumb_poll_tick',
          `elapsed=${elapsed} pending=${pending ? 'yes' : 'no'}`
        );
        if (!pending) {
          stop('all_thumbs_loaded');
          return;
        }
        if (elapsed >= THUMB_POLL_TIMEOUT_MS) {
          stop('timeout');
        }
      };

      tick();
      state.timer = setInterval(tick, THUMB_POLL_INTERVAL_MS);
      thumbPollers.set(section, state);
    };

    const parseDimsNearby = (root) => {
      if (!root) {
        return { width: null, height: null };
      }
      const rx = /(\d{2,5})\s*[×x]\s*(\d{2,5})/;
      const textBits = [];
      root.querySelectorAll('span, div, img').forEach((node) => {
        const chunk = (node.getAttribute?.('aria-label') || node.textContent || '').trim();
        if (chunk) {
          textBits.push(chunk);
        }
      });
      for (const chunk of textBits) {
        const match = rx.exec(chunk);
        if (match) {
          return { width: Number(match[1]), height: Number(match[2]) };
        }
      }
      return { width: null, height: null };
    };

    const extractVisualMatches = () => {
      try {
        const items = [];
        const seen = new Set();
        const section = findSectionByHeading('Visual matches');
        if (!section) {
          logProgress('google:visual_missing', 'No visual matches section detected');
          return items;
        }
        const imgs = Array.from(section.querySelectorAll('img'));
        imgs.forEach((img) => {
          const thumbUrl = img.currentSrc || img.src || '';
          if (!thumbUrl) {
            return;
          }
          const anchor = img.closest('a[href]');
          const sourceUrl = anchor ? ctx.absolutize(anchor.getAttribute('href') || '') : '';
          const key = `${thumbUrl}||${sourceUrl}`;
          if (seen.has(key)) {
            return;
          }
          seen.add(key);
          let title = '';
          if (anchor && anchor.textContent) {
            title = anchor.textContent.trim();
          }
          if (!title && img.alt) {
            title = img.alt.trim();
          }
          const dimsRoot = anchor || img.closest('div') || section;
          const dims = parseDimsNearby(dimsRoot);
          items.push({
            title,
            sourceUrl,
            description: '',
            imageUrl: '',
            thumbUrl,
            width: dims.width || img.naturalWidth || null,
            height: dims.height || img.naturalHeight || null
          });
        });
        return items;
      } catch (error) {
        reportSectionError('visual', error);
        return [];
      }
    };

    const collectAiOverview = async () => {
      try {
        const heading = Array.from(document.querySelectorAll('h1, h2, span')).find((node) =>
          cleanText(node.textContent) === 'AI Overview'
        );
        if (!heading) {
          return null;
        }
        const container =
          heading.closest('[data-mcpr], [data-hveid], [data-mcp], section, article') ||
          heading.parentElement;
        if (!container) {
          return null;
        }
        const showMore = Array.from(container.querySelectorAll('[role="button"][aria-label]')).find((btn) =>
          /Show more AI Overview/i.test(btn.getAttribute('aria-label') || '')
        );
        if (showMore && showMore.getAttribute('aria-expanded') === 'false') {
          showMore.click();
          await sleep(350);
        }
        const overviewText = cleanText(container.innerText);
        const links = Array.from(container.querySelectorAll('a[href]'))
          .filter((a) => a.offsetParent && a.href)
          .slice(0, 10)
          .map((a) => ({ title: cleanText(a.textContent), url: a.href }));
        return { text: overviewText, links };
      } catch (error) {
        reportSectionError('ai_overview', error);
        return null;
      }
    };

    const postSnapshot = (override) => {
      const keyword = extractKeyword();
      const sites = extractSiteResults();
      const visual = extractVisualMatches();
      logProgress(
        'google:snapshot',
        `override=${override ? 'yes' : 'no'} siteCount=${sites.length} visualCount=${visual.length}`
      );
      ctx.postResult({
        keyword,
        keywordLink: keyword ? `${GOOGLE_SEARCH}?q=${encodeURIComponent(keyword)}` : '',
        results: [...sites, ...visual],
        aiOverview: state.aiOverview,
        errors: state.sectionErrors.slice(),
        url: window.location.href,
        override: !!override
      });
    };

    const setupDeferredUpdates = () => {
      const ensureSectionThenObserve = () => {
        const section = findSectionByHeading('Visual matches');
        if (!section) {
          return false;
        }
        const shouldRestoreScroll = document.visibilityState !== 'visible';
        const originalScrollY = shouldRestoreScroll ? window.scrollY : null;
        let scheduled = false;
        const schedule = () => {
          if (scheduled) {
            return;
          }
          scheduled = true;
          setTimeout(() => {
            scheduled = false;
            postSnapshot(true);
          }, UPDATE_DEBOUNCE_MS);
        };
        bringThumbnailsIntoView(section);
        driveSiteThumbnailsIntoView();
        startThumbnailPolling(section);
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.type === 'attributes' || m.addedNodes.length)) {
            schedule();
          }
          bringThumbnailsIntoView(section);
          driveSiteThumbnailsIntoView();
          startThumbnailPolling(section);
        });
        observer.observe(section, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src', 'srcset']
        });
        Array.from(section.querySelectorAll('img')).forEach((img) => {
          if (!img.complete || !img.naturalWidth) {
            img.addEventListener('load', schedule, { passive: true });
          }
        });
        EXTRA_REFRESHES.forEach((delay) => {
          setTimeout(() => {
            bringThumbnailsIntoView(section);
            driveSiteThumbnailsIntoView();
            postSnapshot(true);
          }, delay);
        });
        setTimeout(() => {
          observer.disconnect();
          if (shouldRestoreScroll && typeof originalScrollY === 'number') {
            window.scrollTo({ top: originalScrollY, behavior: 'auto' });
          }
        }, MAX_THUMB_WAIT);
        return true;
      };

      if (ensureSectionThenObserve()) {
        return;
      }

      const fallback = new MutationObserver(() => {
        if (ensureSectionThenObserve()) {
          fallback.disconnect();
        }
      });
      fallback.observe(document.documentElement || document.body, {
        subtree: true,
        childList: true
      });
      setTimeout(() => fallback.disconnect(), 8000);
    };

    const refreshExtras = () => {
      collectAiOverview()
        .then((ai) => {
          if (ai) {
            state.aiOverview = ai;
            postSnapshot(true);
          }
        })
        .catch(() => undefined);
    };

    const run = async () => {
      try {
        if (isSearchPage()) {
          postSnapshot(false);
          setupDeferredUpdates();
          refreshExtras();
          return;
        }

        if (isLensHost()) {
          ctx.postProgress({ stage: 'lens:navigation', message: window.location.href });
          return;
        }

        const imageUrl = await waitForImageUrl();
        navigateToLens(imageUrl);
      } catch (error) {
        ctx.postError(error instanceof Error ? error.message : String(error));
      }
    };

    ctx.onReady(run);
  });
})();
