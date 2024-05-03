
import slugify from 'slugify'
import { catchError } from '../../middleware/catchError.js'
import { brandModel } from '../../../database/models/brand.model.js'
import { deleteOne } from '../handlers/handlers.js'
import { ApiFeatures } from '../../utils/apiFeatures.js'

//! ============================== addBrand ===========================//
const addBrand = catchError( async (req, res, next)=>{
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename
    let brand = new brandModel(req.body)
    await brand.save()
    res.json({ message:"success" , brand})
})

//! ============================== getAllBrands ===========================//
const getAllBrands = catchError(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(brandModel.find(), req.query).filter().sort().fields().pagination().search();
    let brands = await  apiFeatures.mongooseQuery

    res.json({message:"success" , page:apiFeatures.pageNumber, brands})
})

//! ============================== getSingleBrand ===========================//
const  getSingleBrand = catchError(async (req, res, next)=>{
    let brand = await brandModel.findById(req.params.id)
    !brand && res.status(404).json({message:"Brand not found"})
    brand && res.json({ message:"success" , brand})
})

//! ============================== updateBrand ===========================//
const  updateBrand = catchError(async (req, res, next)=>{

    if(req.body.name) req.body.slug = slugify(req.body.name)
    if(req.file) req.body.logo = req.file.filename
    
    let brand =await brandModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
    !brand && res.status(404).json({message:"Brand not found"})
    brand && res.json({message:"success" , brand})
})
//! ============================== deleteBrand ===========================//
const  deleteBrand = deleteOne(brandModel)



export {
    addBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand,
}