const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
      ]
    case 'Async_Redux':
      state = action
      return state
    default:
      return state
  }
}

export default todos
