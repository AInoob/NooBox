import dva from 'dva';
// import './popup.css';
// 1. Initialize
const popup = dva();

// 2. Plugins
// app.use({});

// 3. Model
popup.model(require('./models/popupModels/noobox.js').default);
popup.model(require('./models/popupModels/options.js').default);
popup.model(require('./models/popupModels/overview.js').default);
popup.model(require('./models/popupModels/userHistory.js').default);
// 4. Router
popup.router(require('./popupRouter').default);

// 5. Start
popup.start('#root');
