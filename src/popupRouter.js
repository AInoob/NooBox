import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import PopupTest from './routes/popup/PopupTest.jsx';
import  {OVERVIEW,HISTORY,OPTIONS,ABOUT} from "./common/navURL";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={PopupTest} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
