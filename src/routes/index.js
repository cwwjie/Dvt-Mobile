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

  const DetailTravel = dynamic({
    app,
    component: () => import('./Home/Detail-Travel/index'),
  });

  const HomeSubmit = dynamic({
    app,
    component: () => import('./Home/Submit/index'),
  });


  const CustomerService = dynamic({
    app,
    component: () => import('./Service/index'),
  });

  
  const User = dynamic({
    app,
    component: () => import('./User/index'),
  });

  const UserLogin = dynamic({
    app,
    component: () => import('./User/Login/index'),
  });

  const UserForget = dynamic({
    app,
    component: () => import('./User/Login/forget'),
  });

  const UserSignup = dynamic({
    app,
    component: () => import('./User/Login/signup'),
  });

  const Personal = dynamic({
    app,
    component: () => import('./User/Personal/index'),
  });

  return (
    <Router history={history}>
      <Route>
        <Switch>

          <Route exact path="/" component={Home} />
          <Route path="/home/detail" component={Homedetail} />
          <Route path="/home/detail-travel" component={DetailTravel} />
          <Route path="/home/submit" component={HomeSubmit} />

          <Route path="/service" component={CustomerService} />

          <Route path="/user/index" component={User} />
          <Route path="/user/login" component={UserLogin} />
          <Route path="/user/forget" component={UserForget} />
          <Route path="/user/signup" component={UserSignup} />
          <Route path="/user/personal/index" component={Personal} />

        </Switch>
      </Route>
    </Router>
  );
}  

export default RouterConfig;

