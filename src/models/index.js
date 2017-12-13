import config from './../config';
import cookies from './../utils/cookies';

export default {
  namespace: 'user',

  state: {
    'isLogin': false
  },

  reducers: {
    tologin(state) { return {...state, isLogin: true} }
  },

  effects: {
    *checkLogin({}, { call, put }) {
      let islogin = yield fetch(`${config.URLversion}/user/getUserInfo.do`, {
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
          return true
        }
        return false
      }).catch((error) => false);

      if (islogin) {
        yield put({ type: 'tologin' });
      }
    }
  }

};
