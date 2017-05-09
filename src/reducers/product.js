import assign from 'lodash.assign'

let _state = {
  productId:null,     // 对比
  travel:[],          // 行程
  productInfor:null   // 产品信息
}






const todos = (state = _state, action) => {
  switch (action.type) {

    case 'product_travel':
      let newstate = assign({},state)
      newstate.travel = action.data;
      return newstate


    case 'product_Id':
      let newID = assign({},state)
      newID.productId = action.data;
      return newID


    case 'product_Infor':
      let newInfor = assign({},state)
      newInfor.productInfor = action.data;
      return newInfor

    default:
      return state
  }
}

export default todos
