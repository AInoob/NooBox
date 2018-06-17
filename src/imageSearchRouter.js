import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import ImageSearchTest from './routes/imageSearch/ImageSearchTest.jsx';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={ImageSearchTest} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
