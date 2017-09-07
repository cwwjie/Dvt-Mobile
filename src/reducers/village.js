import assign from 'lodash.assign'

let _state = {
  villageSelected:{
    resortDesc:''
  },
  summary:false,
  roomType:[],
  selected:false
}






const village = (state = _state, action) => {
  switch (action.type) {

    case 'Selected_village':
      let newstate = assign({},state)
      newstate.villageSelected = action.data;
      newstate.selected = true;
      return newstate

    case 'ADD_roomType':
      let roomState = assign({},state)
      roomState.roomType = action.data;
      return roomState

    case 'ADD_summary':
      let summaryState = assign({},state)
      summaryState.summary = action.data;
      return summaryState

    default:
      return state
  }
}

export default village