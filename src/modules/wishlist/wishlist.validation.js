
import Joi from "joi"


const addTOWishlistVal = Joi.object({
    product: Joi.string().hex().length(24).required()
    

})

const paramsIdVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

const updateWishlistVal = Joi.object({
    product: Joi.string().hex().length(24)
   
})


export {
    addTOWishlistVal,
    paramsIdVal,
    updateWishlistVal,
}