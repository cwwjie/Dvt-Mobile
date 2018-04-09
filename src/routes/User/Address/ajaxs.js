import config from './../../../config';
import cookies from './../../../utils/cookies';
import request from './../../../utils/request';

let ajaxs = {
  getAddressInfo() {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/address/findByUserId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers':{
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then(json => {
        if (json.result === '0') {
          resolve(json.data);
        } else {
          reject(json.message);
        }
      }).catch(error => reject(error))
    });
  }, 

  getRegionByType(type) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/system/region/regiontype/${type}/list.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers':{
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then(json => {
        if (json.result === '0') {
          resolve(json.data);
        } else {
          reject(json.message);
        }
      }).catch(error => reject(error))
    });

  }
}

export default ajaxs;
