import dva, { connect } from 'dva';

import fetch from 'dva/fetch';
import React from 'react';

import index from './index.less';
import 'antd-mobile/dist/antd-mobile.less';

// import VConsole from 'vconsole';
// new VConsole();

import userModels from './models/user';
import cartModels from './models/cart';
import routes from './routes';

const app = dva();

app.model(userModels.data);
app.model(cartModels.data);

app.router(routes);

app.start('#root');
