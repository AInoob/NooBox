import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Noobox from './routes/popup/Noobox.jsx';
import  {OVERVIEW,HISTORY,OPTIONS,ABOUT} from "./common/navURL";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/:tab_name" exact component={Noobox} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
