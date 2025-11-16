(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('saucenao', function(ctx) {
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

    const send = () => {
      try {
        ctx.postResult({
          keyword: '',
          results: collectResults()
        });
      } catch (error) {
        ctx.postError(error && error.message ? error.message : String(error));
      }
    };

    ctx.onReady(() => {
      setTimeout(send, 800);
    });
  });
})();
