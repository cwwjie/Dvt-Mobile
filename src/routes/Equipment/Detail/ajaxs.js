import config from './../../../config';
import cookies from './../../../utils/cookies';

const ajaxs = {
  // 根据商品id查询商品详情
  getRentItembyId(id) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/rentItem/${id}.do`, {
        method: 'GET',
        contentType: 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          resolve(val.data);
        } else {
          reject(`向服务器发起请求度设备详情信息失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求度设备详情信息失败, 原因: ${error}`));
    });
  },
  
  // 根据商品id查询尺码分类
  getRentSizebyId(id) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/sku/size/${id}.do`, {
        method: 'GET',
        contentType: 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          // [
          //   "XS", "S", "M", "L", "XL", "XXL", "XXXL"
          // ]
          resolve(val.data);
        } else {
          reject(`向服务器发起请求度设备尺码分类信息失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求度设备尺码分类信息失败, 原因: ${error}`));
    });
  },
  
  // 根据商品id查询颜色分类
  getRentColorbyId(id) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/sku/color/${id}.do`, {
        method: 'GET',
        contentType: 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          // [
          //   "blue", "red"
          // ]
          resolve(val.data);
        } else {
          reject(`向服务器发起请求度设备颜色分类信息失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求度设备颜色分类信息失败, 原因: ${error}`));
    });
  },

  // 根据商品 id 租赁日期 颜色 尺码 四个条件查询 库存数量
  findItemSku(data) {  
    // {
    //   "itemId": 4,
    //   "rentDate": "20180410",
    //   "endDate": "20180415",
    //   "skuNum": 1,         // 非必填
    //   "itemSize": "L",     // 单选 非必填
    //   "itemColor": "red",  // 单选 非必填
    // }
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/sku/findItemSku.do`, {
        'method': 'POST',
        'headers':{
          "Content-Type": "application/json; charset=utf-8",
        },
        'body': JSON.stringify(data)  
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          if (val.data) {
            resolve(val.data);
          } else {
            resolve(0);
          }
        } else {
          reject(`向服务器发起请求设备库存数量失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求设备库存数量失败, 原因: ${error}`));
    });
  },

  // 添加商品至购物车
  addRentItemToCart(data) {
    // {
    //   "userId": 111,
    //   "itemId": 4,
    //   "itemNum": 1,
    //   "rentDate": "20180410",
    //   "endDate": "20180415",
    //   "matchedProduct": "3,5,1"
    // } 
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/cart.do`, {
        'method': 'POST',
        'headers':{
          "Content-Type": "application/json; charset=utf-8",
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        },
        'body': JSON.stringify(data)  
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          resolve(val.data);
        } else {
          reject(`向服务器添加商品至购物车失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器添加商品至购物车失败, 原因: ${error}`));
    });
  }
}

export default ajaxs;
