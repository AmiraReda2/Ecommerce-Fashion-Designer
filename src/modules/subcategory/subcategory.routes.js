import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addSubCategoryVal, paramsIdVal, updateSubCategoryVal } from '../subcategory/subcategory.validation.js'
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategory } from '../subcategory/subcategory.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'



const subcategoryRouter = express.Router({ mergeParams:true })

subcategoryRouter.route('/')
      .post(protectedRoutes, allowedTo('admin'),validation(addSubCategoryVal), addSubCategory)
      .get(getAllSubCategories)

subcategoryRouter.route('/:id')
      .get(validation(paramsIdVal), getSingleSubCategory)
      .put(validation(updateSubCategoryVal), updateSubCategory)
      .delete(validation(paramsIdVal), deleteSubCategory)

export default subcategoryRouter