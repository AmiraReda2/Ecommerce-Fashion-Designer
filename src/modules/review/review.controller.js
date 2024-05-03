
import { catchError } from '../../middleware/catchError.js'
import { deleteOne } from '../handlers/handlers.js';
import { ApiFeatures } from '../../utils/apiFeatures.js';
import { reviewModel } from '../../../database/models/review.model.js';
import { AppError } from '../../utils/appError.js';

//! ============================== addReview ===========================//
const addReview = catchError( async (req, res, next)=>{
  
    req.body.user =  req.user._id;  //add user id to the request body

    let isReviewExist = await reviewModel.findOne({user : req.user._id , product: req.body.product})
    if(isReviewExist) return next(new AppError('Product already reviewed by this user'))
    
    let review = new reviewModel(req.body)
    await review.save()
    res.json({message:"success" ,review})
})
 
//! ============================== getAllReviews ===========================//
const getAllReviews = catchError(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(reviewModel.find({}), req.query).filter().sort().fields().pagination().search();
    let reviews = await  apiFeatures.mongooseQuery
    
    // let subcategories = await reviewModel.find(filterObj).populate("category")
    res.json({message:"success" ,page:apiFeatures.pageNumber, reviews})
})

//! ============================== getSingleReview ===========================//
const  getSingleReview = catchError(async (req, res, next)=>{
    let review =await reviewModel.findById(req.params.id)
    !review && res.status(404).json({message:"Review not found"})
     review && res.json({message:"success" , review})
})

//! ============================== updateReview ===========================//
const  updateReview = catchError(async (req, res, next)=>{
    
    let review = await reviewModel.findOneAndUpdate({_id: req.params.id , user: req.user._id}, req.body, {new:true})
    !review && res.status(404).json({message:"Review not found"})
     review && res.json({message:"success" , review})
})
//! ============================== deleteReview ===========================//
const  deleteReview = deleteOne(reviewModel)








export {
    addReview,
    getAllReviews,
    getSingleReview,  
    updateReview,
    deleteReview
}