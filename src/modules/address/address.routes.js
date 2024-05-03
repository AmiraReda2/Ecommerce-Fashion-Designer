import express from 'express'
import { validation } from '../../middleware/validation.js'
import { protectedRoutes , allowedTo } from '../auth/auth.controller.js'
import { addAddress, getAddresses, removeAddress } from './address.controller.js'
import { addAddressVal, paramsIdVal } from './address.validation.js'

const addressRouter = express.Router()

addressRouter.route('/')
      .patch(protectedRoutes, allowedTo('user'), validation(addAddressVal), addAddress)
      .get(protectedRoutes, allowedTo('user'), getAddresses)

addressRouter.route('/:id')
      .delete(protectedRoutes, allowedTo('user','admin'), validation(paramsIdVal),removeAddress)

export default addressRouter