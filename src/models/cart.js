import config from './../config';
import cookies from './../utils/cookies';
import request from './../utils/request';

let ShoppingCart = {
  'data': {
    'namespace': 'cart',
  
    'state': {
      'buyWay': '潜游时光公司自取', // 购买方式 度假村自取 快递 潜游时光公司自取
      'startLease': new Date(), // 租赁的开始时间
      'returnLease': new Date(Date.parse(new Date()) + 86400000 ), // 租赁的结束时间
      'isSelectAll': false,
      'address': false, // 收货地址
      // { 
      //   'addressId': 1,
      //   'city': 85,
      //   'consignee': "曾杰",
      //   'district': 908,
      //   'mobile': "15976713287",
      //   'province': 7,
      //   'street': "收货地址一",
      //   'telephone': null,
      //   'userId': null,
      //   'zipcode': "123456",
      // },
      'selfGet': { // 潜游时光公司自取
        'consignee': "",
        'mobile': "", 
      },
      'shoppingCartList': [ // 购物车列表
        {
          'id': 1, // 产品标示的ID
          'name': 'GoPro运动摄像机遥控器Smart Remote', // 商品名称
          'img': '', // 商品图片
          'isSelected': false, // 是否被选中
          'inventory': null, // 库存量 false 或者 0 表示无, null 表示暂未查询
          'count': 1, // 购买的数量
        }, {
          'id': 1, // 产品标示的ID
          'name': 'GoPro运动摄像机遥控器Smart Remote', // 商品名称
          'img': '', // 商品图片
          'isSelected': false, // 是否被选中
          'inventory': 2, // 库存量 false 或者 0 表示无, null 表示暂未查询
          'count': 1, // 购买的数量
        }, {
          'id': 2, // 产品标示的ID
          'name': 'GoPro运动摄像机遥控器Smart Remote', // 商品名称
          'img': '', // 商品图片
          'isSelected': true, // 是否被选中
          'inventory': 2, // 库存量 false 或者 0 表示无, null 表示暂未查询
          'count': 1, // 购买的数量
        }
      ],
      // 地区代码列表
      'region': {
        'result': false,
        'message': '正在加载...',
        'provinceList': [
          // {
          //   'regionId': 1,
          //   'parentId': 0,
          //   'regionName': "北京市",
          //   'regionType': 1,
          //   'createBy': null,
          //   'createTime': null,
          //   'updateBy': null,
          //   'updateTime': null,
          //   'isDelete': null,
          // }
        ],
        'cityList': [],
        'districtList': [],
      },
    },

    'reducers': {
      addEquipment(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);
        let isRepeated = false;

        state.shoppingCartList.map((val, key) => {

          // 如果是同一间产品, 则不新增产品
          if (val.id = data.equipmentItem.id) {
            isRepeated = true;

            // 如果库存量存在, 并且有剩余! 则增加
            if (val.inventory && val.inventory > val.count) {
              myShoppingCartList[key].count++
            }
          }
        })

        if (!isRepeated) {
          myShoppingCartList.push(data.equipmentItem);
        }

        return ShoppingCart.saveToState({
          ...state,
          'shoppingCartList': myShoppingCartList
        });
      },

      deleteEquipment(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);
        myShoppingCartList.splice(data.id, 1);


        return ShoppingCart.saveToState({
          ...state,
          'shoppingCartList': myShoppingCartList
        });
      },

      selectEquipment(state, data) {
        let isHaveDeny = false;
        let myShoppingCartList = state.shoppingCartList.concat([]);
        myShoppingCartList[data.id].isSelected = !myShoppingCartList[data.id].isSelected;

        myShoppingCartList.map(val => {
          if (!val.isSelected) {
            isHaveDeny = true;
          }
        });

        return ShoppingCart.saveToState({
          ...state,
          'isSelectAll': !isHaveDeny,
          'shoppingCartList': myShoppingCartList
        });
      },

      selectAllEquipment(state, data) {
        let isHaveDeny = false;

        state.shoppingCartList.map(val => {
          if (!val.isSelected) {
            isHaveDeny = true;
          }
        });

        if (isHaveDeny && state.isSelectAll === false) {

          return ShoppingCart.saveToState({
            ...state,
            'isSelectAll': true,
            'shoppingCartList': state.shoppingCartList.map(val => {
              val.isSelected = true;
              return val
            })
          });
        } else {

          return ShoppingCart.saveToState({
            ...state,
            'isSelectAll': false,
            'shoppingCartList': state.shoppingCartList.map(val => {
              val.isSelected = false;
              return val
            })
          });
        }
      },

      changeEquipmentCount(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);

        myShoppingCartList[data.id].count = data.count;

        return ShoppingCart.saveToState({
          ...state,
          'shoppingCartList': myShoppingCartList
        });
      },

      changeBuyWay(state, data) {
        ShoppingCart.saveToState();

        return ShoppingCart.saveToState({
          ...state,
          'buyWay': data.buyWay
        });
      },

      changeAddress(state, data) {
        return ShoppingCart.saveToState({
          ...state,
          'address': data.address
        });
      },

      changeSelfGet(state, data) {
        let MyselfGet = JSON.parse(JSON.stringify(state.selfGet));

        if (data.consignee) {
          MyselfGet.consignee = data.consignee;
        }

        if (data.mobile) {
          MyselfGet.mobile = data.mobile;
        }

        return {
          ...state,
          'selfGet': MyselfGet
        }
      },

      changeLease(state, data) {
        let startLease = state.startLease;
        let returnLease = state.returnLease;

        if (data.startLease) {
          startLease = data.startLease;
        }

        if (data.returnLease) {
          returnLease = data.returnLease;
        }

        return {
          ...state,
          'startLease': startLease,
          'returnLease': returnLease
        }
      },

      initRegion(state, data) {
        return {
          ...state,
          'region': data.region
        }
      },
    },
  },

  saveToState(state) {
    localStorage.setItem('ShoppingCart', JSON.stringify(state));

    return state
  },

  init() {
    let cartState = localStorage.getItem('ShoppingCart');

    if (cartState) {
      // this.data.state = JSON.parse(cartState);
    }

    return this.data;
  },

  initAddress(app) {
    let myRegion = this.getRegionBylocalStorage();

    if (myRegion) {

      app._store.dispatch({
        'type': 'cart/initRegion',
        'region': myRegion
      });
    } else {

      Promise.all([
        this.getRegionByType(1),
        this.getRegionByType(2),
        this.getRegionByType(3)
      ]).then(values => {
        let region = {
          'result': true,
          'message': '成功',
          'provinceList': values[0],
          'cityList': values[1],
          'districtList': values[2],
        }

        localStorage.setItem('address-region', JSON.stringify(region));
        app._store.dispatch({
          'type': 'cart/initRegion',
          'region': region
        });
      }, error => {
        app._store.dispatch({
          'type': 'cart/initRegion',
          'region': {
            'result': false,
            'message': error,
            'provinceList': [],
            'cityList': [],
            'districtList': [],
          }
        });
      });
    }
  },

  getRegionBylocalStorage() {
    let region = localStorage.getItem('address-region');
    return region ? JSON.parse(region) : false;
  },

  getRegionByType(type) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/system/region/regiontype/${type}/list.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          resolve(json.data.regionList);
        } else {
          reject('获取地区列表信息失败', `请求服务器成功, 但是返回的地区列表序列号${type} 有误! 原因: ${json.message}`);
        }
      }).catch((error) => {
        reject(`请求出错, 向服务器发起请求地区列表序列号${type} 失败, 原因: ${error}`);
      })
    })
  }
}

export default ShoppingCart;