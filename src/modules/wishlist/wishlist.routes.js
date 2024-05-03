import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addTOWishlistVal, paramsIdVal } from './wishlist.validation.js'
import { addToWhislist, getLoggedUserWhislist, removeFromWhislist } from './wishlist.controller.js'
import { protectedRoutes , allowedTo } from '../auth/auth.controller.js'

const wishlistRouter = express.Router()

wishlistRouter.route('/')
      .patch(protectedRoutes, allowedTo('user'), validation(addTOWishlistVal), addToWhislist)
      .get(protectedRoutes, allowedTo('user'), getLoggedUserWhislist)

wishlistRouter.route('/:id')
      .delete(protectedRoutes, allowedTo('user','admin'), validation(paramsIdVal), removeFromWhislist)

export default wishlistRouter