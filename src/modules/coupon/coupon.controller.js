
import { catchError } from '../../middleware/catchError.js'
import { deleteOne } from '../handlers/handlers.js';
import { ApiFeatures } from '../../utils/apiFeatures.js';
import { AppError } from '../../utils/appError.js';
import { couponModel } from '../../../database/models/coupon.model.js';

//! ============================== addReview ===========================//
const addCoupon = catchError( async (req, res, next)=>{

    let isCouponExist = await couponModel.findOne({code : req.body.code})
    if(isCouponExist) return next(new AppError('Coupon already Exists '))
    
    let coupon = new couponModel(req.body)
    await coupon.save()
    res.json({message:"success", coupon})
})
 
//! ============================== getAllCoupons ===========================//
const getAllCoupons = catchError(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(couponModel.find({}), req.query)
           .filter().sort().fields().pagination().search();
    let coupon = await  apiFeatures.mongooseQuery

    res.json({message:"success" , page:apiFeatures.pageNumber, coupon})
})

//! ============================== getSingleCoupon ===========================//
const  getSingleCoupon = catchError(async (req, res, next)=>{
    let coupon =await couponModel.findById(req.params.id)
    !coupon && res.status(404).json({message:"Coupon not found"})
     coupon && res.json({message:"success" , coupon})
})

//! ============================== updateCoupon ===========================//
const  updateCoupon = catchError(async (req, res, next)=>{
    
    let coupon = await couponModel.findOneAndUpdate({_id: req.params.id}, req.body, {new:true})
    !coupon && res.status(404).json({message:"Coupon not found"})
     coupon && res.json({message:"success" , coupon})
})
//! ============================== deleteCoupon ===========================//
const  deleteCoupon = deleteOne(couponModel)








export {
    addCoupon,
    getAllCoupons,
    getSingleCoupon,  
    updateCoupon,
    deleteCoupon
}