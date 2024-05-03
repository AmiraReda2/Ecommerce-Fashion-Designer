import express from 'express'
import { validation } from '../../middleware/validation.js'
import { checkMail } from '../../middleware/emailExist.js'
import { changePassword, protectedRoutes, signin, signup } from './auth.controller.js'
import { changePasswordVal, signinVal, signupVal } from './auth.validation.js'

const authRouter = express.Router()

authRouter.post('/signup', validation(signupVal), checkMail , signup)
authRouter.post('/signin', validation(signinVal),  signin)
authRouter.patch('/changePassword/:id',protectedRoutes, validation(changePasswordVal),  changePassword)
 

export default authRouter