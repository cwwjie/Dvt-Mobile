import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import { connect } from 'dva';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const Home = dynamic({
    app,
    component: () => import('./Home/index'),
  });

  const Homedetail = dynamic({
    app,
    component: () => import('./Home/Detail/index'),
  });

  return (
    <Router history={history}>
      <Route>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/home/detail" component={Homedetail} />
        </Switch>
      </Route>
    </Router>
  );
}  

export default RouterConfig;

