(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('ascii2d', function(ctx) {
    const collectResults = () => {
      const list = document.getElementsByClassName('item-box');
      const results = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const entry = {
          title: 'Possible Match',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          description: ''
        };
        const imageBox = item.getElementsByClassName('image-box')[0];
        if (imageBox) {
          const img = imageBox.querySelector('img');
          if (img) {
            const link = img.getAttribute('src') || '';
            entry.thumbUrl = link ? ctx.absolutize(link) : '';
            entry.imageUrl = entry.thumbUrl;
          }
        }
        const infoBox = item.getElementsByClassName('info-box')[0];
        if (infoBox) {
          const anchors = infoBox.getElementsByTagName('a');
          if (anchors[0]) {
            entry.title = anchors[0].textContent || entry.title;
            entry.sourceUrl = ctx.absolutize(anchors[0].getAttribute('href') || '');
          }
          if (anchors[1]) {
            entry.description = `Author: ${anchors[1].textContent || ''}`;
          }
        }
        results.push(entry);
      }
      return results;
    };

    ctx.onReady(() => {
      try {
        ctx.postResult({
          keyword: '',
          results: collectResults()
        });
      } catch (error) {
        ctx.postError(error && error.message ? error.message : String(error));
      }
    });
  });
})();
