let ShoppingCart = {
  'data': {
    'namespace': 'cart',
  
    'state': {
      'buyWay': '', // 购买方式 度假村自取 快递 潜游时光公司自取
      'startLease': '', // 租赁的开始时间
      'returnLease': '', // 租赁的结束时间
      'isSelectAll': false,
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

        return {
          ...state,
          'shoppingCartList': myShoppingCartList
        }
      },

      deleteEquipment(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);
        myShoppingCartList.splice(data.id, 1);

        return {
          ...state,
          'shoppingCartList': myShoppingCartList
        }
      },

      selectEquipment(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);
        myShoppingCartList[data.id].isSelected = !myShoppingCartList[data.id].isSelected;

        return {
          ...state,
          'shoppingCartList': myShoppingCartList
        }
      },

      selectAllEquipment(state, data) {
        let isHaveDeny = false;

        state.shoppingCartList.map(val => {
          if (!val.isSelected) {
            isHaveDeny = true;
          }
        });

        if (isHaveDeny && isSelectAll === false) {
          return {
            ...state,
            'isSelectAll': true,
            'shoppingCartList': state.shoppingCartList.map(val => {
              val.isSelected = true;
              return val
            })
          }
        } else {
          return {
            ...state,
            'isSelectAll': false,
            'shoppingCartList': state.shoppingCartList.map(val => {
              val.isSelected = false;
              return val
            })
          }
        }

      },

      changeBuyWay(state, data) {
        return {
          ...state,
          'buyWay': data.buyWay
        }
      }
    },
  },

  init() {
    return this.data;
  }
}

export default ShoppingCart.init();
