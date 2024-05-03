import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addUserVal, paramsIdVal, updateUserVal } from './user.validation.js'
import { addUser, deleteUser, getAllUsers, getSingleUser, updateUser } from './user.controller.js'
import { checkMail } from '../../middleware/emailExist.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'



const userRouter = express.Router()
 userRouter.route('/')
      .post(protectedRoutes, allowedTo('admin','user'),validation(addUserVal), checkMail, addUser)
      .get(getAllUsers)

 userRouter.route('/:id')
      .get(validation(paramsIdVal), getSingleUser)
      .put(validation(updateUserVal), updateUser)
      .delete(validation(paramsIdVal), deleteUser)

export default userRouter