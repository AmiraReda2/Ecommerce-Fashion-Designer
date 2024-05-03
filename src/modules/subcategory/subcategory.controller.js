
import slugify from 'slugify';
import { subcategoryModel } from '../../../database/models/sub-category.model.js'
import { catchError } from '../../middleware/catchError.js'
import { deleteOne } from '../handlers/handlers.js';
import { ApiFeatures } from '../../utils/apiFeatures.js';

//! ============================== addSubCategory===========================//
const addSubCategory = catchError( async (req, res, next)=>{
    req.body.slug = slugify(req.body.name)
    let subcategory = new subcategoryModel(req.body)
    await subcategory.save()
    res.json({message:"success" , subcategory})
})
 
//! ============================== getAllSubCategories ===========================//
const getAllSubCategories = catchError(async (req, res, next) => {

    let filterObj = {}
    if(req.params.category){
        filterObj.category = req.params.category;
    }

    let apiFeatures = new ApiFeatures(subcategoryModel.find(filterObj), req.query).filter().sort().fields().pagination().search();
    let subcategories = await  apiFeatures.mongooseQuery
    
    // let subcategories = await subcategoryModel.find(filterObj).populate("category")
    res.json({message:"success" ,page:apiFeatures.pageNumber, subcategories})
})

//! ============================== getSingleSubCategory ===========================//
const  getSingleSubCategory = catchError(async (req, res, next)=>{
    let subcategory =await subcategoryModel.findById(req.params.id)
    !subcategory && res.status(404).json({message:"SubCategory not found"})
     subcategory && res.json({message:"success" , subcategory})
})

//! ============================== updateSubCategory ===========================//
const  updateSubCategory = catchError(async (req, res, next)=>{

    if(req.body.name) req.body.slug = slugify(req.body.name)
    
    let subcategory = await subcategoryModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
    !subcategory && res.status(404).json({message:"SubCategory not found"})
     subcategory && res.json({message:"success" , subcategory})
})
//! ============================== deleteSubCategory ===========================//
const  deleteSubCategory = deleteOne(subcategoryModel)








export {
    addSubCategory,
    getAllSubCategories,
    getSingleSubCategory,  
    updateSubCategory,
    deleteSubCategory
}