(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('yandex', function(ctx) {
    const ENGINE_BASE = 'https://yandex.com/images/search';

    const dedupe = (items) => {
      const seen = new Set();
      const result = [];
      items.forEach((item) => {
        const key = `${item.sourceUrl || ''}|${item.imageUrl || ''}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        result.push(item);
      });
      return result;
    };

    const parseState = () => {
      try {
        const node = document.querySelector('[data-state*="initialState"][id^="ImagesApp-"]');
        if (!node) {
          return null;
        }
        const raw = node.getAttribute('data-state');
        if (!raw) {
          return null;
        }
        return JSON.parse(raw);
      } catch (error) {
        console.debug('Failed to parse Yandex state', error);
        return null;
      }
    };

    const cleanText = (text) => (text || '').replace(/\s+/g, ' ').trim();

    const getKeyword = (state) => {
      const keywordFromState = getKeywordFromState(state);
      if (keywordFromState) {
        return keywordFromState;
      }
      const title = document.querySelector('.cbir-intent__title');
      if (title && title.textContent) {
        return title.textContent.trim();
      }
      const input = document.querySelector('input[name="text"], input[type="search"]');
      if (input && input.value) {
        return input.value.trim();
      }
      return '';
    };

    const getKeywordFromState = (state) => {
      try {
        const tags = state?.initialState?.cbirTags?.tags;
        if (Array.isArray(tags)) {
          const match = tags.find((tag) => cleanText(tag?.text));
          if (match) {
            return cleanText(match.text);
          }
        }
        const text =
          state?.initialState?.internalState?.searchInputText ||
          state?.initialState?.internalState?.query;
        return cleanText(text);
      } catch {
        return '';
      }
    };

    const getSimilar = () => {
      const items = [];
      const nodes = document.querySelectorAll(
        '.serp-list_type_search [role="listitem"], .serp-list .serp-item, .serp-card'
      );
      nodes.forEach((node) => {
        const img = node.querySelector('img');
        if (!img) {
          return;
        }
        const link = node.querySelector('a[href]');
        const href = link ? link.getAttribute('href') : '';
        let imageUrl = '';
        if (href) {
          const match = href.match(/[?&]img_url=([^&]+)/);
          if (match) {
            imageUrl = decodeURIComponent(match[1]);
          }
        }
        items.push({
          title: (img.getAttribute('alt') || '').trim(),
          thumbUrl: img.getAttribute('src') || img.getAttribute('data-src') || '',
          imageUrl,
          sourceUrl: href ? ctx.absolutize(href) : ''
        });
      });
      return items;
    };

    const getSites = () => {
      const items = [];
      const cards = document.querySelectorAll(
        '.cbir-section_name_cbir-sites .cbir-card-mini, .cbir-section_name_right-column .cbir-card-mini, .cbir-section .MiniCard'
      );
      cards.forEach((card) => {
        const link = card.querySelector('.cbir-card-mini__title a, a.cbir-card-mini__link, .cbir-card__title a, .MiniCard-TitleLink');
        if (!link) {
          return;
        }
        const img = card.querySelector('img');
        items.push({
          title: (link.textContent || '').trim(),
          sourceUrl: ctx.absolutize(link.getAttribute('href') || ''),
          thumbUrl: img ? img.getAttribute('src') || img.getAttribute('data-src') || '' : ''
        });
      });
      return items;
    };

    const collectStateSimilar = (state) => {
      const items = [];
      const thumbs = state?.initialState?.cbirSimilar?.thumbs || [];
      thumbs.forEach((thumb) => {
        const image = ctx.absolutize(thumb?.imageUrl || '');
        const source = ctx.absolutize(thumb?.linkUrl || '');
        if (!image && !source) {
          return;
        }
        items.push({
          title: cleanText(thumb?.title) || 'Similar image',
          thumbUrl: image,
          imageUrl: image,
          sourceUrl: source || image,
          width: null,
          height: null
        });
      });
      return items;
    };

    const collectStateSites = (state) => {
      const buckets = [
        state?.initialState?.cbirSites?.sites,
        state?.initialState?.cbirSitesList?.sites
      ];
      const items = [];
      buckets.forEach((bucket) => {
        if (Array.isArray(bucket)) {
          bucket.forEach((entry) => {
            const thumb = entry?.thumb?.url || entry?.thumbUrl;
            const source = ctx.absolutize(entry?.url || entry?.link || '');
            const image = ctx.absolutize(entry?.originalImage?.url || entry?.imageUrl || '');
            if (!source) {
              return;
            }
            const width = Number(entry?.originalImage?.width) || null;
            const height = Number(entry?.originalImage?.height) || null;
            items.push({
              title: cleanText(entry?.title) || cleanText(entry?.text) || 'Result',
              thumbUrl: thumb || image,
              imageUrl: image || thumb,
              sourceUrl: source,
              description: cleanText(entry?.snippet),
              width,
              height
            });
          });
        }
      });
      return items;
    };

    const emitResults = (attempt) => {
      try {
        const state = parseState();
        const keyword = getKeyword(state);
        const results = dedupe(
          collectStateSites(state || {})
            .concat(collectStateSimilar(state || {}))
            .concat(getSites())
            .concat(getSimilar())
        );
        if (!results.length && attempt < 5) {
          setTimeout(() => emitResults(attempt + 1), 800);
          return;
        }
        ctx.postResult({
          keyword,
          keywordLink: keyword
            ? `${ENGINE_BASE}?text=${encodeURIComponent(keyword)}`
            : '',
          results
        });
      } catch (error) {
        ctx.postError(error && error.message ? error.message : String(error));
      }
    };

    ctx.onReady(() => {
      emitResults(0);
    });
  });
})();
