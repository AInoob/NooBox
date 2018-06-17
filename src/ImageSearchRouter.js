import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import BackgroundTest from './routes/background/BackgroundTest.jsx';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={BackgroundTest} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
