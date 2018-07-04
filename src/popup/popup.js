import dva from 'dva';
import bowser from "SRC/utils/useBrowser.js";
bowser();
// import './popup.css';
// 1. Initialize
const popup = dva();

// 2. Plugins
// app.use({});

// 3. Model
popup.model(require('./models/noobox.js').default);
popup.model(require('./models/options.js').default);
popup.model(require('./models/overview.js').default);
popup.model(require('./models/userHistory.js').default);
// 4. Router
popup.router(require('./popupRouter').default);

// 5. Start
popup.start('#root');
