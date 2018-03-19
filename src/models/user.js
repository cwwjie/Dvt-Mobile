import config from './../config';
import cookies from './../utils/cookies';
import request from './../utils/request';

export default {
  'namespace': 'user',

  'state': {
    'isLogin': false,
    'nickname': null
  },

  'reducers': {
    tologin(state, data) {
      return {
        ...state,
        'isLogin': true,
        'nickname': data.getUserInfo.nickname
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
