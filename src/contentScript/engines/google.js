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
      const prefer = [img.currentSrc, img.src];
      for (const candidate of prefer) {
        if (candidate && !candidate.startsWith('data:')) {
          return candidate;
        }
      }
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const first = srcset.split(/\s+/)[0];
        if (first && !first.startsWith('data:')) {
          return first;
        }
      }
      const attrs = ['src', 'data-src', 'data-lz', 'data-deferred-src'];
      for (const attr of attrs) {
        const value = img.getAttribute(attr);
        if (value && !value.startsWith('data:')) {
          return value;
        }
      }
      if (img.dataset) {
        const datasetSource =
          img.dataset.src || img.dataset.lz || img.dataset.deferredSrc || '';
        if (datasetSource && !datasetSource.startsWith('data:')) {
          return datasetSource;
        }
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
      const startSiteObservers = () => {
        const container = document.querySelector('#search, #rso, body');
        if (!container) {
          return false;
        }
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
        const handleMutations = (mutations) => {
          if (
            mutations.some(
              (m) =>
                m.type === 'attributes' ||
                m.addedNodes.length ||
                m.removedNodes.length
            )
          ) {
            schedule();
          }
        };
        const observer = new MutationObserver(handleMutations);
        observer.observe(container, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src', 'srcset']
        });
        Array.from(container.querySelectorAll('img')).forEach((img) => {
          if (!img.complete || !img.naturalWidth) {
            img.addEventListener('load', schedule, { passive: true, once: true });
          }
        });
        setTimeout(() => observer.disconnect(), MAX_THUMB_WAIT);
        EXTRA_REFRESHES.forEach((delay) => setTimeout(schedule, delay));
        return true;
      };

      const startVisualObservers = () => {
        const section = findSectionByHeading('Visual matches');
        if (!section) {
          return false;
        }
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
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.type === 'attributes' || m.addedNodes.length)) {
            schedule();
          }
        });
        observer.observe(section, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src', 'srcset']
        });
        Array.from(section.querySelectorAll('img')).forEach((img) => {
          if (!img.complete || !img.naturalWidth) {
            img.addEventListener('load', schedule, { passive: true, once: true });
          }
        });
        EXTRA_REFRESHES.forEach((delay) => setTimeout(schedule, delay));
        setTimeout(() => observer.disconnect(), MAX_THUMB_WAIT);
        return true;
      };

      const ensureObservers = () => {
        const visualAttached = startVisualObservers();
        const siteAttached = startSiteObservers();
        return visualAttached || siteAttached;
      };

      if (ensureObservers()) {
        return;
      }

      const fallback = new MutationObserver(() => {
        if (ensureObservers()) {
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
