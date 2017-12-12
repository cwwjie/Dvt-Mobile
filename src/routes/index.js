import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import { connect } from 'dva';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const Home = dynamic({
    app,
    component: () => import('./Home/index'),
  });

  return (
    <Router history={history}>
      <Route>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Route>
    </Router>
  );
}  

export default RouterConfig;

