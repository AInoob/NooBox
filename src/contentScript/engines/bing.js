(function () {
  if (window.__nooboxBingContentScriptInjected) {
    console.debug('[NooBox][Bing] skipping duplicate injection');
    return;
  }
  window.__nooboxBingContentScriptInjected = true;

  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('bing', function (ctx) {
    try {
      console.log('[NooBox][Bing] content script injected', {
        href: window.location.href,
        cursor: ctx.cursor
      });
    } catch {
      // ignore logging errors
    }
    const cleanText = (value) =>
      (value || '')
        .replace(/\s+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .trim();
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const parseDimensions = (text) => {
      if (!text) {
        return null;
      }
      const match = text.match(/(\d{2,5})\s*[×x]\s*(\d{2,5})/i);
      if (!match) {
        return null;
      }
      return {
        width: Number(match[1]),
        height: Number(match[2]),
        raw: text
      };
    };

    const getOverlayInfo = (anchor) => {
      const container =
        anchor.closest('li') ||
        anchor.closest('.imgpt') ||
        anchor.closest('.pigc') ||
        anchor.parentElement;
      if (!container) {
        return {};
      }
      const overlay =
        container.querySelector('.overlayContainer') ||
        container.querySelector('.imgInfoOverlay');
      const domain = cleanText(
        overlay?.querySelector('.domain, .doma, .b_cap')?.textContent || ''
      );
      const dimLabel =
        overlay?.querySelector('span[aria-label*=" x "]')?.getAttribute('aria-label') ||
        overlay?.querySelector('.imgMeta')?.textContent ||
        '';
      const dims = parseDimensions(dimLabel);
      return { domain, dimLabel, dims };
    };

    const makeDescription = (info) => {
      const parts = [];
      if (info.dimLabel) {
        parts.push(info.dimLabel);
      }
      if (info.domain) {
        parts.push(info.domain);
      }
      return cleanText(parts.join(' • '));
    };

    const absolutize = (url) => {
      if (!url) {
        return '';
      }
      try {
        return ctx.absolutize(url);
      } catch {
        return url;
      }
    };

    const extractKeyword = () => {
      const related = document.querySelector('.irsc .irsb .irsuc .irstc .irst');
      if (related?.textContent) {
        return cleanText(related.textContent);
      }
      const input = document.querySelector('input[name="q"]');
      if (input && input.value) {
        return cleanText(input.value);
      }
      return '';
    };

    const parseRichLink = (anchor) => {
      if (!anchor) {
        return null;
      }
      const container =
        anchor.closest('.pigc') ||
        anchor.closest('.imgpt') ||
        anchor.parentElement;
      const overlay = getOverlayInfo(anchor);
      const imageEl =
        anchor.querySelector('img') ||
        container?.querySelector('img');
      const thumbUrl =
        imageEl?.currentSrc ||
        imageEl?.src ||
        imageEl?.getAttribute('data-src') ||
        '';
      const pageAnchor =
        container?.querySelector('.pirc a[href]') || anchor;
      const descriptionNode =
        container?.querySelector('.pirc .pritext') ||
        container?.querySelector('.caption') ||
        null;
      const descriptionText = cleanText(descriptionNode?.textContent || '');
      const descriptionDims = parseDimensions(descriptionText);
      const title =
        descriptionText ||
        cleanText(anchor.getAttribute('aria-label')) ||
        cleanText(anchor.textContent) ||
        overlay.domain ||
        'Result';
      const description = makeDescription(overlay) || descriptionText;
      const siteLabel = cleanText(
        container?.querySelector('.pirc .dfn, .pirc .dfnText, .dfnc .dfn')?.textContent || ''
      );
      return {
        title,
        thumbUrl,
        imageUrl: thumbUrl,
        sourceUrl: absolutize(pageAnchor?.getAttribute('href') || ''),
        description,
        width: descriptionDims?.width || overlay.dims?.width || null,
        height: descriptionDims?.height || overlay.dims?.height || null,
        site: siteLabel || overlay.domain || ''
      };
    };

    const collectImageTiles = () => {
      const anchors = Array.from(
        document.querySelectorAll('.mainContainer .richImgLnk, a.richImgLnk')
      ).filter((anchor) => !anchor.closest('.insights, .rr'));
      const seen = new Set();
      const items = [];
      anchors.forEach((anchor) => {
        const entry = parseRichLink(anchor);
        if (!entry) {
          return;
        }
        const key = `${entry.sourceUrl}|${entry.imageUrl}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        items.push(entry);
      });
      return items;
    };

    const waitForElement = async (selector, timeoutMs = 6000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const element = document.querySelector(selector);
        if (element) {
          return element;
        }
        await sleep(100);
      }
      return document.querySelector(selector);
    };

    const PAGES_BUTTON_SELECTOR = '#detailInfo #actionbar [aria-label="Pages"]';
    const PAGES_RESULT_SELECTOR =
      '.insights.rr .tab-content.pim.content-nohead .pginlv ul li .pigc .richImgLnk';

    const state = {
      snapshotTimer: null,
      snapshotNeedsOverride: false,
      pagesHydrated: false,
      pagesPending: document.visibilityState !== 'visible',
      hydratingPages: false
    };

    let pagesClickIssued = false;
    const ensurePagesTab = async () => {
      if (!pagesClickIssued) {
        const pagesButton = await waitForElement(PAGES_BUTTON_SELECTOR, 6000);
        if (!pagesButton) {
          return false;
        }
        pagesClickIssued = true;
        if (pagesButton.getAttribute('aria-selected') !== 'true') {
          try {
            console.log('[NooBox][Bing] clicking Pages tab');
          } catch {}
          pagesButton.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true })
          );
        } else {
          try {
            console.log('[NooBox][Bing] Pages tab already selected');
          } catch {}
        }
      }
      return true;
    };

    const collectPageTilesFromDom = () => {
      const anchors = Array.from(document.querySelectorAll(PAGES_RESULT_SELECTOR));
      const seen = new Set();
      const items = [];
      anchors.forEach((anchor) => {
        const entry = parseRichLink(anchor);
        if (!entry) {
          return;
        }
        const key = `${entry.sourceUrl}|${entry.imageUrl}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        items.push(entry);
      });
      try {
        console.log('[NooBox][Bing] collected pages', items.length);
      } catch {}
      return items;
    };

    const postSnapshot = (override) => {
      const keyword = extractKeyword();
      const images = collectImageTiles();
      const pages = collectPageTilesFromDom();
      const combined = [...pages, ...images];
      try {
        console.log('[NooBox][Bing] posting snapshot', {
          override,
          pages: pages.length,
          images: images.length
        });
      } catch {}
      ctx.postProgress({
        stage: 'bing:snapshot',
        message: `override=${override ? 'yes' : 'no'} pages=${pages.length} images=${images.length}`
      });
      ctx.postResult({
        keyword,
        results: combined,
        override
      });
    };

    const scheduleSnapshot = (override) => {
      if (override) {
        state.snapshotNeedsOverride = true;
      }
      if (state.snapshotTimer) {
        return;
      }
      state.snapshotTimer = setTimeout(() => {
        state.snapshotTimer = null;
        const useOverride = state.snapshotNeedsOverride;
        state.snapshotNeedsOverride = false;
        postSnapshot(useOverride);
      }, 400);
    };

    const hydratePages = async () => {
      if (state.pagesHydrated || state.hydratingPages) {
        return;
      }
      if (document.visibilityState !== 'visible') {
        state.pagesPending = true;
        return;
      }
      state.hydratingPages = true;
      state.pagesPending = false;
      try {
        if (!(await ensurePagesTab())) {
          return;
        }
        const firstTile = await waitForElement(PAGES_RESULT_SELECTOR, 8000);
        if (!firstTile) {
          state.pagesPending = true;
          return;
        }
        state.pagesHydrated = true;
        scheduleSnapshot(true);
      } finally {
        state.hydratingPages = false;
      }
    };

    const setupMutationObserver = () => {
      const target =
        document.querySelector('#detailInfo, #b_content') || document.body;
      if (!target) {
        return;
      }
      const observer = new MutationObserver((mutations) => {
        if (
          mutations.some(
            (mutation) =>
              mutation.type === 'childList' &&
              (mutation.addedNodes.length || mutation.removedNodes.length)
          )
        ) {
          scheduleSnapshot(true);
          if (!state.pagesHydrated && document.visibilityState === 'visible') {
            hydratePages();
          }
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && state.pagesPending) {
        state.pagesPending = false;
        hydratePages();
      }
    };

    const run = async () => {
      try {
        const firstTile = await waitForElement('a.richImgLnk');
        if (!firstTile) {
          throw new Error('Bing results did not render');
        }
        postSnapshot(false);
        setupMutationObserver();
        if (document.visibilityState === 'visible') {
          hydratePages();
        } else {
          state.pagesPending = true;
        }
      } catch (error) {
        ctx.postError(error instanceof Error ? error.message : String(error));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    ctx.onReady(() => {
      run();
    });
  });
})();
