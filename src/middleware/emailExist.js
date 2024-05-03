

import { userModel } from "../../database/models/user.model.js"
import { AppError } from "../utils/appError.js"



export const checkMail = async (req, res, next) => {

    let user = await userModel.findOne({email: req.body.email })
    if (user) return next(new AppError('User already in exists.', 409))
    next()
}
