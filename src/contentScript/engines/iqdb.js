(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('iqdb', function(ctx) {
    const collectResults = () => {
      const containers = document.getElementsByClassName('pages');
      const items = [];
      for (let i = 0; i < containers.length; i++) {
        const rows = containers[i].getElementsByTagName('div');
        for (let j = 0; j < rows.length; j++) {
          const row = rows[j];
          const header = row.getElementsByTagName('th')[0];
          if (!header || header.textContent === 'Possible match') {
            const entry = {
              title: 'Possible Match',
              thumbUrl: '',
              imageUrl: '',
              sourceUrl: '',
              description: ''
            };
            const data = row.getElementsByTagName('td');
            const imageLink = data[0]?.querySelector('a');
            if (imageLink) {
              entry.sourceUrl = ctx.absolutize(imageLink.getAttribute('href') || '');
              const thumb = imageLink.querySelector('img');
              if (thumb) {
                const src = thumb.getAttribute('src') || '';
                entry.thumbUrl = ctx.absolutize(src);
                entry.imageUrl = entry.thumbUrl;
              }
            }
            const description = data[3];
            if (description) {
              entry.description = description.textContent || '';
            }
            items.push(entry);
          }
        }
      }
      return items;
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
