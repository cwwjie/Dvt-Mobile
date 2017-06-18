import { combineReducers } from 'redux'
import Nav from './Nav'
import product from './product'
import user from './user'
import Order from './Order'
import Passenger from './Passenger'
import village from './village'

const todoApp = combineReducers({
  Nav,
  product,
  user,
  Order,
  Passenger,
  village
})

export default todoApp
