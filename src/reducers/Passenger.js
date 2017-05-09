import assign from 'lodash.assign'

let _state = {
  data:[],
  type:false,
  select:false
}




const Passenger = (state = _state, action) => {
  switch (action.type) {

    case 'Chan_Passenger':
      // 这个是全部改变
      state.data = action.data;
      let newstate = assign({},state);
      return newstate

    case 'select_Passenger':
      // 这个是改变select
      state.select = action.data.select;
      state.type = action.data.type;
      let selectState = assign({},state);
      return selectState

    default:
      return state
  }
}

export default Passenger
