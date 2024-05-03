
import slugify from 'slugify'
import { categoryModel } from '../../../database/models/category.model.js'
import { catchError } from '../../middleware/catchError.js'
import { deleteOne } from '../handlers/handlers.js'
import { ApiFeatures } from '../../utils/apiFeatures.js'

//! ============================== add Category ===========================//
const addCategory = catchError( async (req, res, next)=>{
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename
    let category = new categoryModel(req.body)
    console.log(category)
    await category.save()
    res.json({message:"success" , category})
})

//! ============================== getAllCategories ===========================//
const getAllCategories = catchError(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(categoryModel.find(), req.query).filter().sort().fields().pagination().search();
    let categories = await  apiFeatures.mongooseQuery
    
    res.json({message:"success" , page:apiFeatures.pageNumber, categories})
})

//! ============================== getSingleCategory ===========================//
const  getSingleCategory = catchError(async (req, res, next)=>{
    let category =await categoryModel.findById(req.params.id)
    !category && res.status(404).json({message:"Category not found"})
     category && res.json({message:"success" , category})
})

//! ============================== updateCategory ===========================//
const  updateCategory = catchError(async (req, res, next)=>{

    if(req.body.name) req.body.slug = slugify(req.body.name)
    if(req.file) req.body.image = req.file.filename
    
    let category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
    !category && res.status(404).json({message:"Category not found"})
     category && res.json({message:"success" , category})
})
//! ============================== deleteCategory ===========================//
const  deleteCategory = deleteOne(categoryModel)








export {
    addCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}