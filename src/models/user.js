import config from './../config';
import cookies from './../utils/cookies';
import request from './../utils/request';

import cart from './cart';

let ajaxs = {
  // 根据 cookies 获取用户信息
  getUserInfo() {
    // {
    //   bindEmailTime: null,
    //   birthday: "1986-05-09",
    //   digest: "11111111-1111-1111-1111-111111111111",
    //   email: null,
    //   forgetPsState: null,
    //   forgetPsTime: null,
    //   gender: 1,
    //   genderCount: null,
    //   isDelete: "N",
    //   isUseBind: null,
    //   lastIp: "192.168.0.102",
    //   lastLogin: 1522277260000,
    //   mobile: "15976713287",
    //   nickname: "15976713287",
    //   passwd: null,
    //   qq: "454766952",
    //   regTime: 1484091192000,
    //   salt: null,
    //   status: 1,
    //   telephone: "07624662026",
    //   token: "11111111-1111-1111-1111-111111111111",
    //   userId: 69,
    //   userName: "曾杰",
    //   validateCode: null,
    //   visitCount: null,
    //   webchat: "weixin",
    // }
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/getUserInfo.do`, {
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json; charset=utf-8',
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        },
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          resolve(val.data);
        } else {
          reject(`向服务器发起请求用户信息失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求用户信息失败, 原因: ${error}`));
    });
  }
}

let User = {
  data: {
    'namespace': 'user',
  
    'state': {
      'isLogin': false,
      'nickname': null,
      'userId': null,
    },
  
    'reducers': {
      tologin(state, data) {
        return {
          ...state,
          'isLogin': true,
          'nickname': data.getUserInfo.nickname,
          'userId': data.getUserInfo.userId,
        }
      }
    }
  },

  init(app) {
    this.initUser(app)
    .then(() => {
      // 执行获取用户信息后, 执行下面购物车的初始化操作.
      cart.initCart(app);
    });
  },

  initUser(app) {
    return new Promise((resolve, reject) => {
      ajaxs.getUserInfo()
      .then(val => {
        app._store.dispatch({
          'type': 'user/tologin',
          'getUserInfo': val
        });
        resolve();
      }, error => console.log(error));
    });
  }
}

export default User;
