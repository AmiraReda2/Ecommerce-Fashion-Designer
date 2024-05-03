import jwt, { decode } from  'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from '../../utils/appError.js';



//! ======== signup ========
const signup = catchError( async (req , res) =>{
    let user = new userModel(req.body);
     await user.save()
     let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY )
    res.json({message:"success", token})
})
//!======== signin ========
const signin = catchError(async (req , res, next )=> {
    let user = await userModel.findOne({ email: req.body.email}) 
    if ( user && bcrypt.compareSync(req.body.password , user.password)){
        let token = jwt.sign({ userId:user._id, role: user.role }, process.env.JWT_KEY )
        return res.json({message : "success" , token})
    }
    next(new AppError("Email or password is incorrect" , 401))
})

//!======== change user password ========
const changePassword = catchError(async (req , res, next )=> {
    let user = await userModel.findById(req.user._id) 

    if ( user && bcrypt.compareSync(req.body.password , user.password)){
        let token = jwt.sign({ userId:user._id, role: user.role }, process.env.JWT_KEY )
        await userModel.findByIdAndUpdate(req.user._id ,{ password: req.body.newPassword, passwordChangeAt:Date.now()})
        return res.json({message : "success" , token})
    }
    next(new AppError("Email or password is incorrect" , 401))
})

// !======= protectedRoutes =======
const protectedRoutes = catchError(async(req , res, next )=> {
 // 1- token exist otr not 
     let { token } = req.headers
     if(!token) return next(new AppError('Token not provided', 401));

 // 2- verify token 
     let decoded = jwt.verify(token ,process.env.JWT_KEY)

 // 3- userId-> exist otr not 
     let user = await userModel.findById(decoded.userId)
      if(!user) return next (new AppError('User Not Found', 401))

      if(user?.passwordChangeAt){
        let time = parseInt(user?.passwordChangeAt.getTime() / 1000)
        // console.log( time + " | " + decoded.iat)
        if(time > decoded.iat) return next( new AppError('Please wait for a while to reset your password ',  400))
      }
      req.user = user;
      next()
    
})

//!====== authrization =====
const allowedTo = (...roles)=>{
    return catchError(async(req ,res ,next )=>{
        
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`You are not authorized to perform this action on a resource`, 403))
        }
        next();
    })
}


export {
    signup,
    signin,
    protectedRoutes,
    changePassword,
    allowedTo
}