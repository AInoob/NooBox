import dva from 'dva';
import bowser from "SRC/utils/useBrowser.js";
bowser();
// 1. Initialize
const imageSearch = dva();

// 2. Plugins
// app.use({});

// 3. Model
imageSearch.model(require('./models/imageSearch').default);

// 4. Router
imageSearch.router(require('./imageSearchRouter').default);

// 5. Start
imageSearch.start('#root');
