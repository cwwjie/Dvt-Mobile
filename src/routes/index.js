import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const Home = dynamic({
    app,
    component: () => import('./Home/index'),
  });

  const Village = dynamic({
    app,
    component: () => import('./Village/index'),
  });
  
  const AfterService = dynamic({
    app,
    component: () => import('./AfterService/index'),
  });

  const User = dynamic({
    app,
    component: () => import('./User/index'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/village" component={Village} />
        <Route path="/afterService" component={AfterService} />
        <Route path="/user" component={User} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
