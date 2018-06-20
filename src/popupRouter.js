import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Noobox from './routes/popup/Noobox.jsx';
import Overview from './routes/popup/Noobox.jsx';
import Options from './routes/popup/Noobox.jsx';
import UserHistory from './routes/popup/Noobox.jsx';
import About from './routes/popup/Noobox.jsx';
import 'antd/dist/antd.css';
import  {OVERVIEW_URL,HISTORY_URL,OPTIONS_URL,ABOUT_URL} from "./common/navURL";

function RouterConfig({ history }) {

  return (
    <Router history={history}>
        <Noobox>
          <Switch>
            <Route path= {OVERVIEW_URL} component    ={Overview}/>
            <Route path= {HISTORY_URL}  component    ={UserHistory}/>
            <Route path= {OPTIONS_URL}  component    ={Options}/>
            <Route path= {ABOUT_URL}    component    ={About}/>
          </Switch>
        </Noobox>
    </Router>
  );
}
export default RouterConfig;
