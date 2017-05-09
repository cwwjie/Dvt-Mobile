import { combineReducers } from 'redux'
import Nav from './Nav'
import product from './product'
import user from './user'
import Order from './Order'
import Passenger from './Passenger'

const todoApp = combineReducers({
  Nav,
  product,
  user,
  Order,
  Passenger
})

export default todoApp
