
import React from 'react';
import ReactDOM from 'react-dom';

// 引入React-Router模块
import { Router, Route, hashHistory, IndexRoute} from 'react-router';

// 自定义 less 改变ant默认theme或者增添全局的样式
// import './index.css';


/*
 * redux
 */

import { createStore, combineReducers , applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';


import reducer from './reducers';

/*
 * components
 */

import Nav from './components/Reuse/Nav';
import Home from './components/Home/Home';




//const store = createStore(reducer)
// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    reducer,
    routing: routerReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);






// 异步获取路由
const Cus = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('./components/Service/Cus').default)
  }, 'Cus')
}
const Ord = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('./components/Order/Ord').default)
  }, 'Ord')
}
const Cent = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('./components/My/Cent').default)
  }, 'Cent')
}




ReactDOM.render(
  <Provider store={store}>
    <Router history={ history }>
      <Route path="/" component={Nav}>
        <IndexRoute component={Home}/>
        <Route path="/Cus" getComponent={Cus}/>
        <Route path="/Ord" getComponent={Ord}/>
        <Route path="/Cent" getComponent={Cent}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)


































