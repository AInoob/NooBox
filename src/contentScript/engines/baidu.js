(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('baidu', function(ctx) {
    const getSign = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get('sign');
      } catch (error) {
        console.debug('Baidu sign missing', error);
      }
      return null;
    };

    const fetchSameImages = async (sign) => {
      const url = `https://graph.baidu.com/ajax/pcsame?sign=${encodeURIComponent(
        sign
      )}&limit=10`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Baidu pcSame failed: ${response.status}`);
      }
      const data = await response.json();
      return (data && data.data && data.data.list) || [];
    };

    const send = async () => {
      try {
        const sign = getSign();
        if (!sign) {
          throw new Error('Missing Baidu sign');
        }
        const list = await fetchSameImages(sign);
        const results = list.map((item) => ({
          title: item.title || 'Result',
          thumbUrl: item.image_src || '',
          imageUrl: item.image_src || '',
          sourceUrl: ctx.absolutize(item.url || ''),
          description: item.abstract || ''
        }));
        ctx.postResult({
          keyword: '',
          results
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
