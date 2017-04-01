import { combineReducers } from 'redux'
import todos from './todos'
import Nav from './Nav'

const todoApp = combineReducers({
  todos,
  Nav
})

export default todoApp
