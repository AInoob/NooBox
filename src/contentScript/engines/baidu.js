(function () {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('baidu', function (ctx) {
    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const toNumber = (value) => {
      if (!value) {
        return null;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const decodeQuery = (value) => {
      if (!value) {
        return '';
      }
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    };

    const extractKeyword = () => {
      const base = document.querySelector('#commonBase');
      const attr =
        base?.getAttribute('data-query') ||
        base?.getAttribute('data-word') ||
        (base && base.dataset ? base.dataset.query || base.dataset.word : '');
      if (attr) {
        return decodeQuery(attr);
      }
      const script = Array.from(document.scripts).find((sc) =>
        sc.textContent && sc.textContent.includes('"defaultBox"')
      );
      const regexes = [
        /"defaultBox"\s*:\s*{[^}]*"word"\s*:\s*"([^"]+)"/,
        /"rawQuery"\s*:\s*"([^"]+)"/
      ];
      for (const regex of regexes) {
        const match = script?.textContent?.match(regex);
        if (match && match[1]) {
          return decodeQuery(match[1]);
        }
      }
      return '';
    };

    const getBgUrl = (element) => {
      if (!element) {
        return '';
      }
      const fromStyle = element.getAttribute('style') || '';
      let match = fromStyle.match(/url\((['"]?)([^'")]+)\1\)/i);
      if (match && match[2]) {
        return match[2];
      }
      const computed = window.getComputedStyle(element);
      if (computed && computed.backgroundImage) {
        match = computed.backgroundImage.match(/url\((['"]?)([^'")]+)\1\)/i);
        if (match && match[2]) {
          return match[2];
        }
      }
      return '';
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
        const ds =
          img.dataset.src || img.dataset.lz || img.dataset.deferredSrc || '';
        if (ds && !ds.startsWith('data:')) {
          return ds;
        }
      }
      return '';
    };

    const getParam = (url, key) => {
      if (!url) {
        return '';
      }
      try {
        const parsed = new URL(url, window.location.origin);
        const value = parsed.searchParams.get(key);
        if (value) {
          return value;
        }
      } catch {
        // ignore
      }
      const regex = new RegExp(`[?&]${key}=([^&#]+)`);
      const match = url.match(regex);
      return match && match[1] ? match[1] : '';
    };

    const getImageUrlFromObj = (objUrl) => {
      if (!objUrl) {
        return '';
      }
      const keys = ['image', 'imgUrl', 'imgurl', 'objurl'];
      for (const key of keys) {
        const value = getParam(objUrl, key);
        if (value) {
          return decodeQuery(value);
        }
      }
      return '';
    };

    const parseDimsFromUrl = (url) => {
      if (!url) {
        return null;
      }
      try {
        const parsed = new URL(url, window.location.origin);
        const width =
          toNumber(parsed.searchParams.get('w')) ||
          toNumber(parsed.searchParams.get('width'));
        const height =
          toNumber(parsed.searchParams.get('h')) ||
          toNumber(parsed.searchParams.get('height'));
        if (width && height) {
          return { width, height };
        }
      } catch {
        // ignore parse failures
      }
      const match = url.match(/(?:w|width)=(\d+).*(?:h|height)=(\d+)/i);
      if (match) {
        return {
          width: toNumber(match[1]) || null,
          height: toNumber(match[2]) || null
        };
      }
      return null;
    };

    const parsePubTime = (value) => {
      const ms = toNumber(value);
      if (!ms) {
        return null;
      }
      try {
        return new Date(ms).toISOString();
      } catch {
        return null;
      }
    };

    const isVideoTile = (tile, objUrl) => {
      if (!tile) {
        return false;
      }
      if (
        tile.querySelector('.video-tag, .video-badge, .video-icon, .video-label')
      ) {
        return true;
      }
      const text = tile.textContent || '';
      if (/来自视频|视频/.test(text)) {
        return true;
      }
      if (objUrl && /render_type=carousel_video|video/.test(objUrl)) {
        return true;
      }
      return false;
    };

    const describeItem = (info) => {
      const parts = [];
      if (info.sourceLabel) {
        parts.push(info.sourceLabel);
      }
      if (info.pubTime) {
        parts.push(info.pubTime.replace('T', ' ').replace('Z', ' UTC'));
      }
      if (info.isVideo) {
        parts.push('Video');
      }
      if (info.description) {
        parts.push(info.description);
      }
      return cleanText(parts.join(' • '));
    };

    const parseTiles = () => {
      const nodes = Array.from(
        document.querySelectorAll('.img-item-wrapper > .img-item')
      );
      const similarImages = [];
      const websites = [];
      const seenSimilar = new Set();
      const seenSites = new Set();

      nodes.forEach((tile) => {
        const objUrl = tile.getAttribute('data-obj-url') || '';
        const siteUrlRaw = tile.getAttribute('data-from-url') || '';
        const siteUrl = siteUrlRaw ? ctx.absolutize(siteUrlRaw) : '';
        const thumbRoot =
          tile.querySelector('.img-container, .img-card, .result-img') || tile;
        const thumbUrl =
          getBgUrl(thumbRoot) ||
          getImgSrc(
            tile.querySelector('.img-container img, .img-card img, img')
          ) ||
          '';
        const imageUrl = getImageUrlFromObj(objUrl) || thumbUrl;
        const dims = parseDimsFromUrl(thumbUrl);
        const title = cleanText(
          tile.querySelector('.img-title-wrapper, .img-title, .title')?.textContent ||
            ''
        );
        const sourceLabel = cleanText(
          tile.querySelector('.source__FS7wh .c-line-clamp1, .source .c-line-clamp1, .source, .from-site')
            ?.textContent || ''
        );
        const description = cleanText(
          tile.querySelector(
            '.c-line-clamp2, .img-desc, .img-desc-wrapper, .abstract'
          )?.textContent || ''
        );
        const info = {
          title,
          thumbUrl,
          imageUrl,
          siteUrl,
          sourceLabel,
          description,
          pubTime: parsePubTime(tile.getAttribute('data-pub-time')),
          isVideo: isVideoTile(tile, objUrl),
          width: dims?.width || null,
          height: dims?.height || null
        };

        if ((info.imageUrl || info.thumbUrl) && !seenSimilar.has(objUrl)) {
          seenSimilar.add(objUrl);
          similarImages.push(info);
        }
        if (info.siteUrl && !seenSites.has(info.siteUrl)) {
          seenSites.add(info.siteUrl);
          websites.push(info);
        }
      });

      return { similarImages, websites };
    };

    const mapItems = (items) =>
      items.map((item) => ({
        title: item.title || item.sourceLabel || 'Possible Match',
        thumbUrl: item.thumbUrl || item.imageUrl || '',
        imageUrl: item.imageUrl || item.thumbUrl || '',
        sourceUrl: item.siteUrl || item.imageUrl || '',
        description: describeItem(item),
        width: item.width || undefined,
        height: item.height || undefined
      }));

    const postSnapshot = (override) => {
      try {
        const keyword = extractKeyword();
        const { similarImages, websites } = parseTiles();
        const siteResults = mapItems(websites);
        const similarResults = mapItems(similarImages);
        const combined = [...siteResults, ...similarResults];
        ctx.postProgress({
          stage: 'baidu:snapshot',
          message: `override=${override ? 'yes' : 'no'} sites=${siteResults.length} similar=${similarResults.length}`
        });
        ctx.postResult({
          keyword,
          keywordLink: keyword
            ? `https://graph.baidu.com/s?wd=${encodeURIComponent(keyword)}`
            : '',
          results: combined,
          websites: siteResults,
          similarImages: similarResults,
          override
        });
      } catch (error) {
        ctx.postError(error instanceof Error ? error.message : String(error));
      }
    };

    const setupObserver = () => {
      const container =
        document.querySelector('.img-content-list, .water-flow-wrapper') ||
        document.body;
      if (!container) {
        return;
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
        }, 600);
      };
      const observer = new MutationObserver((records) => {
        if (
          records.some(
            (record) =>
              record.type === 'childList' &&
              (record.addedNodes.length || record.removedNodes.length)
          )
        ) {
          schedule();
        }
      });
      observer.observe(container, { childList: true, subtree: true });
    };

    const encourageScroll = () => {
      const steps = [300, 1200, 2500];
      steps.forEach((delay) => {
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, delay);
      });
    };

    ctx.onReady(() => {
      postSnapshot(false);
      setupObserver();
      encourageScroll();
    });
  });
})();
