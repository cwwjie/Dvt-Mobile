import assign from 'lodash.assign'

let _state = false


const user = (state = _state, action) => {
  switch (action.type) {

    case 'USER_ADD':
      let newstate = action.data
      return newstate


    case 'Async_Redux':
      state = action
      return state

    default:
      return state
  }
}

export default user
