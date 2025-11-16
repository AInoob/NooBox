(function() {
  if (!window.__nooboxEngineBootstrap) {
    return;
  }

  window.__nooboxEngineBootstrap('tineye', function(ctx) {
    ctx.onReady(() => {
      ctx.postError('TinEye search is currently unavailable');
    });
  });
})();
