import dva, { connect } from 'dva';

import fetch from 'dva/fetch';
import React from 'react';

import index from './index.less';
import 'antd-mobile/dist/antd-mobile.less';

import models from './models';
import routes from './routes';

const app = dva();

app.model(models);

app.router(routes);

app.start('#root');
