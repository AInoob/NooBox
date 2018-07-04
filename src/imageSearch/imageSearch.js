import dva from 'dva';

// 1. Initialize
const imageSearch = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
imageSearch.router(require('./imageSearchRouter').default);

// 5. Start
imageSearch.start('#root');
