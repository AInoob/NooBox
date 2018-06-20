import dva from 'dva';
// import './popup.css';
// 1. Initialize
const popup = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
popup.router(require('./popupRouter').default);

// 5. Start
popup.start('#root');
