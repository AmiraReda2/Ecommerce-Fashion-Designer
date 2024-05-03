import express from 'express'
import { validation } from '../../middleware/validation.js'
import { protectedRoutes , allowedTo } from '../auth/auth.controller.js'
import { addCartVal, paramsIdVal, updateCarttVal} from './cart.validation.js'
import { addToCart, applyCoupon, clearUserCart, getLoggedUserCart, removeItemFromCart, updateQuantity  } from './cart.controller.js'

const cartRouter = express.Router()

cartRouter.route('/')
      .post(protectedRoutes, allowedTo('user'), validation( addCartVal), addToCart)
      .get(protectedRoutes, allowedTo('user'),  getLoggedUserCart)
      .delete(protectedRoutes, allowedTo('user'),  clearUserCart)

cartRouter.post('/applyCoupon', protectedRoutes, allowedTo('user'), applyCoupon)


cartRouter.route('/:id')
      .delete(protectedRoutes, allowedTo('user','admin'), validation(paramsIdVal), removeItemFromCart)
      .put(protectedRoutes, allowedTo('user'), validation(updateCarttVal), updateQuantity)

export default cartRouter