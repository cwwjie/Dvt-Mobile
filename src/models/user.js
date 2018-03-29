import config from './../config';
import cookies from './../utils/cookies';
import request from './../utils/request';

export default {
  'namespace': 'user',

  'state': {
    'isLogin': false,
    'nickname': null,
    'userId': null,
  },

  'reducers': {
    tologin(state, data) {
      // let data = {
      //   bindEmailTime: null,
      //   birthday: "1986-05-09",
      //   digest: "fedf186b-f7f5-42d2-a7b5-a15e7631d2d2",
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
      //   token: "cd5c907d-b2a1-4ad0-a8f5-5cc6116db95d",
      //   userId: 69,
      //   userName: "曾杰",
      //   validateCode: null,
      //   visitCount: null,
      //   webchat: "weixin",
      // }
      return {
        ...state,
        'isLogin': true,
        'nickname': data.getUserInfo.nickname,
        'userId': data.getUserInfo.userId,
      }
    }
  },

  'effects': {
    *checkLogin({}, { call, put }) {
      let getUserInfo = yield fetch(`${config.URLversion}/user/getUserInfo.do`, {
        'method': 'GET',
        'contentType': "application/json; charset=utf-8",
        'headers': {
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        response => response.json(),
        error => error
      ).then((val) => {
        if (val.result === "0") {
          return request.success(val.data);
        }
        return request.error('请求数据有误')
      }).catch((error) => request.error('请求出错'));

      if (getUserInfo.result === 1) {
        yield put({ 'type': 'tologin', 'getUserInfo': getUserInfo.data });
      }
    }
  }

};
