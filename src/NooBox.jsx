//The router of NooBox, all component is under Core.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import styled from 'styled-components';

//Log page views
function logPageView(){
}

//popup.html will be update to different pathname based on the parameter
ReactDOM.render(
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route component={require('./Core.jsx')}>
      <Route path="popup.html" component={require('./Overview.jsx')} />
      <Route path="overview" component={require('./Overview.jsx')} />
      <Route path="options" component={require('./Options.jsx')} />
      <Route path="history" component={require('./History.jsx')} />
      <Route path="about" component={require('./About.jsx')} />
    </Route>
  </Router>
  ,
  document.getElementById('noobox')
);
