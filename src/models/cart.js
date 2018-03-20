let ShoppingCart = {
  'data': {
    'namespace': 'cart',
  
    'state': {
      'buyWay': '快递', // 购买方式 度假村自取 快递 潜游时光公司自取
      'startLease': '', // 租赁的开始时间
      'returnLease': '', // 租赁的结束时间
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
      ]
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
  }
}

export default ShoppingCart.init();
