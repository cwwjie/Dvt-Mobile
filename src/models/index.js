import config from './../config';

export default {
  namespace: 'user',

  state: {
    'isFirstVisit': true,
    'isLogin': false
  },

  reducers: {
    visit(state) { return {...state, isFirstVisit: false} },
    login(state) { return {...state, isLogin: true} }
  },

  effects: {
    *checkLogin({}, { call, put }) {
      let isLogin = false;
      
      yield fetch(`${config.basicUrl}/user/checkLogin`, {
        mode: 'cors',
        method: 'GET',
        credentials: 'include'
      }).then(
        function (response) {
          return response.json()
        }, function (error) {
          return error
        }
      ).then(function (val) {
      if (val.result === 1) {
          isLogin = true;
        } else {
          isLogin = false;
        }
      });

      if (isLogin === false) { return }

      yield put({
        type: 'login'
      })
    }
  }

};
