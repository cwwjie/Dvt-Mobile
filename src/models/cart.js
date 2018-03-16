let ShoppingCart = {
  'data': {
    'namespace': 'cart',
  
    'state': {
      'buyWay': '', // 购买方式 度假村自取 快递 潜游时光公司自取
      'shoppingCartList': [ // 购物车列表
        // {
        //   'isSelected': false, // 是否被选中
        // }
      ]
    },

    'reducers': {
      addEquipment(state, data) {
        let myShoppingCartList = state.shoppingCartList.concat([]);

        myShoppingCartList.push(data.equipmentItem);
        return {
          ...state,
          'shoppingCartList': myShoppingCartList
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
