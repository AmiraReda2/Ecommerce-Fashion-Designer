
import { catchError } from '../../middleware/catchError.js'
import { deleteOne } from '../handlers/handlers.js';
import { ApiFeatures } from '../../utils/apiFeatures.js';
import { userModel } from '../../../database/models/user.model.js';



//! ============================== addUser ===========================//
const addUser = catchError( async (req, res, next)=>{
     // encrypt the password using bcrypt with
    let user = new userModel(req.body)
    await user.save()
    res.json({message:"success" , user})
})
 
//! ============================== getAllUsers ===========================//
const getAllUsers = catchError(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(userModel.find(), req.query).filter().sort().fields().pagination().search();
    let users = await  apiFeatures.mongooseQuery
    
    res.json({message:"success" ,page:apiFeatures.pageNumber, users})
})

//! ============================== getSingleUser ===========================//
const  getSingleUser = catchError(async (req, res, next)=>{
    let user =await userModel.findById(req.params.id)
    !user && res.status(404).json({message:"user not found"})
     user && res.json({message:"success" , user})
})

//! ============================== updateUser ===========================//
const  updateUser = catchError(async (req, res, next)=>{

    let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
    !user && res.status(404).json({message:"user not found"})
     user && res.json({message:"success" , user})
})
//! ============================== deleteUser ===========================//
const  deleteUser = deleteOne(userModel)


export {
    addUser,
    getAllUsers,
    getSingleUser,  
    updateUser,
    deleteUser
}