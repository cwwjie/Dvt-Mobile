import cartAjaxs from './../routes/User/Shopping-Cart/ajaxs';
import addressAjaxs from './../routes/User/Address/ajaxs';

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
        // {
        //   isSelected: false, // 是否被选中
        //   inventory: null, // 库存量 false 或者 0 表示无, null 表示暂未查询
        //   count: 1, // 购买的数量

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
        //   rentDate: "2018-04-04"
        //   updated: null
        //   userId: 69
        // }
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
      initEquipment(state, data) {
        return {
          ...state,
          'shoppingCartList': data.cart.map(val => {
            val.isSelected = false;
            val.inventory = null;
            val.count = 1;
            return val
          })
        };
      },

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

  init(app) {
    this.initAddress(app);
  },

  // 在 src/models/user.js 执行获取用户信息后, 执行下面购物车的初始化操作.
  initCart(app) {
    cartAjaxs.getCart()
    .then(val => {
      if (val || val.length > 0) {
        app._store.dispatch({
          'type': 'cart/initEquipment',
          'cart': val
        });
      }
    });
  },

  initAddress(app) {
    let regionlocalStorage = localStorage.getItem('address-region');
    let myRegion = regionlocalStorage ? JSON.parse(regionlocalStorage) : false;

    if (myRegion) {

      app._store.dispatch({
        'type': 'cart/initRegion',
        'region': myRegion
      });
    } else {

      Promise.all([
        addressAjaxs.getRegionByType(1),
        addressAjaxs.getRegionByType(2),
        addressAjaxs.getRegionByType(3)
      ]).then(values => {
        let region = {
          'result': true,
          'message': '成功',
          'provinceList': values[0].regionList,
          'cityList': values[1].regionList,
          'districtList': values[2].regionList,
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
  }
}

export default ShoppingCart;
