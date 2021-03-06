import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import { connect } from 'dva';
import dynamic from 'dva/dynamic';

import cartModel from './../models/cart';
import userModel from './../models/user';

function RouterConfig({ history, app }) {
  // 初始化 用户
  userModel.init(app);

  // 初始化 地址 购物车
  cartModel.init(app);

  const Home = dynamic({ app, component: () => import('./Home/index') });
  const Homedetail = dynamic({ app, component: () => import('./Home/Detail/index') });
  const DetailTravel = dynamic({ app, component: () => import('./Home/Detail-Travel/index') });
  const HomeSubmit = dynamic({ app, component: () => import('./Home/Submit/index') });
  
  const Village = dynamic({ app, component: () => import('./Village/index') });
  const VillageDetail = dynamic({ app, component: () => import('./Village/Detail/index') });
  const VillageSubmit = dynamic({ app, component: () => import('./Village/Submit/index') });

  const Equipment = dynamic({ app, component: () => import('./Equipment/index') });
  const EquipmentDetail = dynamic({ app, component: () => import('./Equipment/Detail/index') });
  
  const CustomerService = dynamic({ app, component: () => import('./Service/index') });
  
  const User = dynamic({ app, component: () => import('./User/index') });
  const UserLogin = dynamic({ app, component: () => import('./User/Login/index') });
  const UserForget = dynamic({ app, component: () => import('./User/Login/forget') });
  const UserSignup = dynamic({ app, component: () => import('./User/Login/signup') });
  const Personal = dynamic({ app, component: () => import('./User/Personal/index') });
  const AccountInfor = dynamic({ app, component: () => import('./User/Personal/AccountInfor') });
  const Password = dynamic({ app, component: () => import('./User/Account/Password') });
  const Mailbox = dynamic({ app, component: () => import('./User/Account/Mailbox') });
  const Mobile = dynamic({ app, component: () => import('./User/Account/Mobile') });
  const Order = dynamic({ app, component: () => import('./User/Order/index') });
  const OrderDetail = dynamic({ app, component: () => import('./User/Order/Detail') });
  const Taobao = dynamic({ app, component: () => import('./User/Order/Taobao') });
  const TravellerInfor = dynamic({ app, component: () => import('./User/Traveller-Infor/index') });
  const EditTraveller = dynamic({ app, component: () => import('./User/Traveller-Infor/edit') });
  const ShoppingCart = dynamic({ app, component: () => import('./User/Shopping-Cart/index') });
  const ShoppingConfirm = dynamic({ app, component: () => import('./User/Shopping-Cart/Confirm/index') });
  const Address = dynamic({ app, component: () => import('./User/Address/index') });
  const EditAddress = dynamic({ app, component: () => import('./User/Address/edit') });

  return (
    <Router history={history}>
      <Route>
        <Switch>

          {/* 首页 */}
          <Route exact path="/" component={Home} />
          <Route path="/home/detail" component={Homedetail} />
          <Route path="/home/detail-travel" component={DetailTravel} />
          <Route path="/home/submit" component={HomeSubmit} />

          {/* 度假村直定 */}
          <Route path="/village/index" component={Village} />
          <Route path="/village/detail" component={VillageDetail} />
          <Route path="/village/submit" component={VillageSubmit} />

          {/* 装备租赁 */}
          <Route path="/equipment/index" component={Equipment} />
          <Route path="/equipment/detail" component={EquipmentDetail} />

          {/* 客服 */}
          <Route path="/service" component={CustomerService} />

          {/* 用户中心 */}
          <Route path="/user/index" component={User} />

          <Route path="/user/login" component={UserLogin} />
          <Route path="/user/forget" component={UserForget} />
          <Route path="/user/signup" component={UserSignup} />

          <Route path="/user/personal/index" component={Personal} />
          <Route path="/user/personal/account" component={AccountInfor} />

          <Route path="/user/account/password" component={Password} />
          <Route path="/user/account/mailbox" component={Mailbox} />
          <Route path="/user/account/mobile" component={Mobile} />

          <Route path="/user/order/index" component={Order} />
          <Route path="/user/order/taobao" component={Taobao} />
          <Route path="/user/order/detail" component={OrderDetail} />

          <Route path="/user/address/index" component={Address} />
          <Route path="/user/address/edit" component={EditAddress} />

          <Route path="/user/traveller/index" component={TravellerInfor} />
          <Route path="/user/traveller/edit" component={EditTraveller} />

          <Route path="/user/cart/index" component={ShoppingCart} />
          <Route path="/user/cart/confirm" component={ShoppingConfirm} />
        </Switch>
      </Route>
    </Router>
  );
}  

export default RouterConfig;

