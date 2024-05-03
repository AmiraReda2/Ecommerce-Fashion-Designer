import express from 'express'
import { protectedRoutes , allowedTo } from '../auth/auth.controller.js'

import * as order from './order.controller.js'


const orderRouter = express.Router()

orderRouter.route('/')
      .get(protectedRoutes, allowedTo('user'), order.getSpecificOrder)

orderRouter.get('/all', order.getAllOrders)

orderRouter.route('/:id')
      .post(protectedRoutes, allowedTo('user'), order.createOderCash)

orderRouter.post('/checkOut/:id' , protectedRoutes, allowedTo('user'), order.createCheckOutSession)      

export default orderRouter