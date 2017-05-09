import assign from 'lodash.assign'

let _state = {
  filter:'all',   // all ing  pay  complete
  state:false,    // 0 表示未加载 1表示有数据
  select:'false',   // 默认是 false 未选择
  data:[],
  Userinfo:[]
}




const Order = (state = _state, action) => {
  switch (action.type) {

    case 'Chan_Order':
      // 这个是全部改变
      state.data = action.data;
      state.state = 1;
      let newstate = assign({},state);
      return newstate

    case 'filter_Order':
      state.filter = action.data;
      let _state = assign({},state);
      return _state

    case 'select_Order':
      // 这个是全部改变
      state.select = action.data;
      let selectState = assign({},state);
      return selectState

    case 'Userinfo_Order':
      // 这个是全部改变
      state.Userinfo = action.data;
      let UserinfoState = assign({},state);
      return UserinfoState

    default:
      return state
  }
}

export default Order
