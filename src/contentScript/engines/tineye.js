(function () {
  if (window.__nooboxTinEyeContentScriptInjected) {
    return;
  }
  window.__nooboxTinEyeContentScriptInjected = true;

  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('tineye', function (ctx) {
    const RESULT_SELECTOR = 'a[data-test="match-link"]';
    const FALLBACK_SELECTOR = 'h3 a[href^="http"], h4 a[href^="http"]';
    const UPDATE_DEBOUNCE_MS = 600;
    const MAX_INITIAL_WAIT_MS = 2500;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const cleanText = (value) =>
      (value || '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const toInt = (value) => {
      const numeric = parseInt(String(value || '').replace(/[^\d]/g, ''), 10);
      return Number.isFinite(numeric) ? numeric : undefined;
    };

    const getKeywordFromMeta = (meta) => {
      if (meta?.queryImageUrl) {
        try {
          const parsed = new URL(meta.queryImageUrl, window.location.href);
          const segments = parsed.pathname.split('/').filter(Boolean);
          const last = segments.pop();
          if (last) {
            return decodeURIComponent(last);
          }
          return parsed.hostname || parsed.href;
        } catch {
          return meta.queryImageUrl;
        }
      }
      return 'TinEye';
    };

    const getMeta = () => {
      const countEl = document.querySelector('[data-test="result-count"]');
      const h1 = countEl?.closest('h1');
      const queryAnchor = h1?.querySelector('a[href]');
      const pageEl = document.querySelector('span[data-test="current"]');
      const nextBtn = document.querySelector('button[data-test="next"]');
      return {
        totalResults: toInt(countEl?.textContent),
        stockResults: toInt(
          document.querySelector('[data-test="results-in-stock"]')?.textContent
        ),
        queryImageUrl:
          queryAnchor?.getAttribute('title') || queryAnchor?.getAttribute('href') || '',
        page: toInt(pageEl?.textContent) || 1,
        moreAvailable: !!nextBtn
      };
    };

    const getImageSrc = (img) => {
      if (!img) {
        return '';
      }
      const preferred = [img.currentSrc, img.src];
      for (const candidate of preferred) {
        if (candidate && !candidate.startsWith('data:')) {
          return candidate;
        }
      }
      const attrs = ['data-src', 'data-lazy-src', 'data-original', 'srcset'];
      for (const attr of attrs) {
        const value = img.getAttribute(attr);
        if (!value) {
          continue;
        }
        if (attr === 'srcset') {
          const first = value.split(/\s+/)[0];
          if (first && !first.startsWith('data:')) {
            return first;
          }
        } else if (!value.startsWith('data:')) {
          return value;
        }
      }
      return '';
    };

    const getResultAnchors = () => {
      const anchors = Array.from(document.querySelectorAll(RESULT_SELECTOR));
      if (anchors.length) {
        return anchors;
      }
      return Array.from(document.querySelectorAll(FALLBACK_SELECTOR));
    };

    const parseDimensions = (text) => {
      if (!text) {
        return null;
      }
      const match = text.match(/(\d{2,5})\s*[×x]\s*(\d{2,5})/);
      if (!match) {
        return null;
      }
      return {
        width: Number(match[1]),
        height: Number(match[2])
      };
    };

    const buildDescription = (info) => {
      const parts = [];
      if (info.crawlDate) {
        parts.push(info.crawlDate);
      }
      if (info.isStock) {
        parts.push('Stock match');
      }
      if (info.compareAvailable) {
        parts.push('Compare available');
      }
      return cleanText(parts.join(' • '));
    };

    const parseResultAnchor = (anchor) => {
      if (!anchor) {
        return null;
      }
      const href =
        anchor.getAttribute('title') ||
        anchor.getAttribute('href') ||
        anchor.dataset?.url ||
        '';
      if (!href) {
        return null;
      }
      let domain = cleanText(anchor.textContent || '');
      const sourceUrl = ctx.absolutize(href);
      if (!domain && sourceUrl) {
        try {
          const parsed = new URL(sourceUrl);
          domain = parsed.hostname;
        } catch {
          domain = sourceUrl;
        }
      }

      let root = anchor.closest('div');
      let hops = 0;
      while (
        root &&
        hops < 5 &&
        !root.querySelector('[data-test="result-image"]')
      ) {
        root = root.parentElement;
        hops++;
      }
      const img = root?.querySelector('img[data-test="result-image"]');
      const crawlDate = cleanText(
        root?.querySelector('[data-test="crawl-date"]')?.textContent || ''
      );
      const compareAvailable = !!root?.querySelector('[data-test="show-compare"]');
      const textBlob = cleanText(root?.textContent || '');
      const dimInfo = parseDimensions(textBlob);
      const isStock = /\bstock\b/i.test(textBlob);

      return {
        title: domain || 'Result',
        sourceUrl,
        thumbUrl: getImageSrc(img),
        imageUrl: getImageSrc(img),
        description: buildDescription({ crawlDate, isStock, compareAvailable }),
        imageInfo: dimInfo || undefined,
        type: isStock ? 'stock' : 'website'
      };
    };

    const collectResults = () => {
      const anchors = getResultAnchors();
      const seen = new Set();
      const items = [];
      anchors.forEach((anchor) => {
        const entry = parseResultAnchor(anchor);
        if (!entry || !entry.sourceUrl) {
          return;
        }
        if (seen.has(entry.sourceUrl)) {
          return;
        }
        seen.add(entry.sourceUrl);
        items.push(entry);
      });
      return items;
    };

    const state = {
      lastHash: '',
      sequence: 0,
      observer: null,
      scheduled: false
    };

    const hashPayload = (meta, results) => {
      try {
        return JSON.stringify({
          meta,
          results: results.map((item) => ({
            title: item.title,
            sourceUrl: item.sourceUrl,
            thumbUrl: item.thumbUrl,
            description: item.description
          }))
        });
      } catch {
        return String(Date.now());
      }
    };

    const postSnapshot = (override) => {
      const baseMeta = getMeta();
      const meta = Object.assign({}, baseMeta, {
        sequence: ++state.sequence
      });
      const results = collectResults();
      const keyword = getKeywordFromMeta(meta);
      const hash = hashPayload(meta, results);
      if (override && hash === state.lastHash) {
        return;
      }
      state.lastHash = hash;
      ctx.postResult({
        keyword,
        keywordLink: meta.queryImageUrl || window.location.href,
        results,
        url: window.location.href,
        override: !!override,
        meta
      });
    };

    const scheduleSnapshot = (override) => {
      if (state.scheduled) {
        return;
      }
      state.scheduled = true;
      setTimeout(() => {
        state.scheduled = false;
        postSnapshot(override);
      }, UPDATE_DEBOUNCE_MS);
    };

    const waitForResults = async () => {
      const start = Date.now();
      while (Date.now() - start < MAX_INITIAL_WAIT_MS) {
        if (getResultAnchors().length) {
          return;
        }
        await sleep(100);
      }
    };

    const observeDom = () => {
      if (state.observer) {
        return;
      }
      const observer = new MutationObserver((mutations) => {
        if (
          mutations.some(
            (m) => m.addedNodes.length || m.removedNodes.length || m.type === 'attributes'
          )
        ) {
          scheduleSnapshot(true);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'data-src', 'data-lazy-src']
      });
      state.observer = observer;
    };

    ctx.onReady(async () => {
      try {
        await waitForResults();
        postSnapshot(false);
        observeDom();
      } catch (error) {
        ctx.postError(error instanceof Error ? error.message : String(error));
      }
    });
  });
})();
