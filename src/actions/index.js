let nextTodoId = 0


export const ReactReduxAction = function(text) {
	return{
		type: 'Async_Redux',
	  	text:text
	}
}



// 下面几个是废物
export const addTodo = function(text) {
	return{
	  type: 'ADD_TODO',
	  id: nextTodoId++,
	  text
	}
}


export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})


export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})
