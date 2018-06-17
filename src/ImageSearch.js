import dva from 'dva';
import './background.css';

// 1. Initialize
const background = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
background.router(require('./backgroundRouter').default);

// 5. Start
background.start('#root');
