import config from './../../../config';
import cookies from './../../../utils/cookies';
import request from './../../../utils/request';

const ajaxs = {
  // 根据用户id查找所有该用户的购物车
  getCart() {
    // {
    //   cartId: 4
    //   created: 1522835045000
    //   endDate: "2018-04-09"
    //   itemDeposit: 6000
    //   itemId: 1
    //   itemName: "相机修改"
    //   itemNum: 1
    //   itemPic: "\rent\pic\D6C671874C844DA2A73905D8B05892D3.jpg"
    //   itemRental: 10
    //   matchedProduct: ""
    //   skuNum: null                 // 显示库存不足就好 与 itemNum 有关
    //   rentDate: "2018-04-04"
    //   updated: null
    //   userId: 69
    // }
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/cart/mine.do`, {
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
          reject(`向服务器发起请求查找所有该用户的购物车失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求查找所有该用户的购物车失败, 原因: ${error}`));
    });
  },
  
  // 根据id删除购物车
  deleteCartbyId(id) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/cart/${id}.do`, {
        'method': 'DELETE',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          resolve(val.data);
        } else {
          reject(`向服务器发起请求删除该用户的购物车商品失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求删除该用户的购物车商品失败, 原因: ${error}`));
    });
  },
  
  // 根据当前购物车id来更新购物车
  updateCartbyId() {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/cart/mine.do`, {
        'method': 'PUT',
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
          reject(`向服务器发起请求查找所有该用户的购物车失败, 原因: ${val.message}`);
        }
      }).catch(error => reject(`向服务器发起请求查找所有该用户的购物车失败, 原因: ${error}`));
    });
  },
}

export default ajaxs;
