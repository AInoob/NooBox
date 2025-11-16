(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  const MODULES =
    'brq,objectdetection,objectrecognition,imagebasedrelatedsearches,relatedsearches,image,caption,similarimages,similarproducts';

  window.__nooboxEngineBootstrap('bing', function(ctx) {
    const getImageUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const value = params.get('q') || '';
        if (value.startsWith('imgurl:')) {
          return decodeURIComponent(value.replace('imgurl:', ''));
        }
      } catch (error) {
        console.debug('Failed to parse Bing image url', error);
      }
      return '';
    };

    const getTokens = () => {
      const html = document.documentElement.innerHTML || '';
      const igMatch = html.match(/IG:"([^"]+)"/);
      const skeyMatch = html.match(/skey=([^&]+)&amp;/);
      return {
        ig: igMatch ? igMatch[1] : null,
        skey: skeyMatch ? skeyMatch[1] : null
      };
    };

    const fetchDetails = async (imgUrl) => {
      const tokens = getTokens();
      if (!tokens.ig || !tokens.skey) {
        throw new Error('Missing Bing session tokens');
      }
      const params = new URLSearchParams();
      params.set('modules', MODULES);
      params.set('imgurl', imgUrl);
      params.set('rshighlight', 'true');
      params.set('textDecorations', 'true');
      params.set('internalFeatures', 'share');
      params.set('skey', tokens.skey);
      params.set('safeSearch', 'Strict');
      params.set('IG', tokens.ig);
      params.set('IID', 'idpins');
      params.set('SFX', '1');

      const response = await fetch(
        `https://www.bing.com/images/api/custom/details?${params.toString()}`,
        {
          credentials: 'include'
        }
      );
      if (!response.ok) {
        throw new Error(`Bing details failed: ${response.status}`);
      }
      return response.json();
    };

    const mapSectionResults = (section) => {
      const items = [];
      if (!section || !section.value) {
        return items;
      }
      section.value.slice(0, 15).forEach((entry) => {
        items.push({
          title: entry.name || entry.text || 'Result',
          thumbUrl:
            (entry.thumbnail && entry.thumbnail.url) || entry.contentUrl || '',
          imageUrl:
            entry.contentUrl ||
            (entry.thumbnail && entry.thumbnail.url) ||
            '',
          sourceUrl: ctx.absolutize(
            entry.hostPageUrl || entry.webSearchUrl || ''
          )
        });
      });
      return items;
    };

    const send = async () => {
      try {
        const imageUrl = getImageUrl();
        if (!imageUrl) {
          throw new Error('Missing Bing image URL');
        }
        const details = await fetchDetails(imageUrl);
        const candidates = [];
        candidates.push(
          ...mapSectionResults(details?.imageBasedRelatedSearches),
          ...mapSectionResults(details?.relatedSearches),
          ...mapSectionResults(details?.visuallySimilarImages)
        );
        ctx.postResult({
          keyword: '',
          results: candidates
        });
      } catch (error) {
        ctx.postError(error && error.message ? error.message : String(error));
      }
    };

    ctx.onReady(() => {
      send();
    });
  });
})();
