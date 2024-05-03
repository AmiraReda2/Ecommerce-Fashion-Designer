import express from 'express'
import { validation } from '../../middleware/validation.js'
import { uploadSingleFile } from '../../services/fileUploads/fileUploads.js'
import { addBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from './brand.controller.js'
import { addBrandVal, paramsIdVal, updateBrandVal } from './brand.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'


const brandRouter = express.Router()

brandRouter.route('/')
      .post(protectedRoutes, allowedTo('admin'),uploadSingleFile('logo'),validation(addBrandVal), addBrand)
      .get(getAllBrands)

brandRouter.route('/:id')
      .get(protectedRoutes,validation(paramsIdVal),getSingleBrand)

      .put( protectedRoutes,uploadSingleFile('logo'), validation(updateBrandVal), updateBrand)
      .delete(protectedRoutes,validation(paramsIdVal), deleteBrand)

export default brandRouter