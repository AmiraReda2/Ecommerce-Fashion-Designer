
import Joi from "joi"


const createCashVal = Joi.object({
    id: Joi.string().hex().length(24),
     shippingAddress:Joi.object({
     street:Joi.string().trim().required(true),
     city:Joi.string().trim().required(),
     phone:Joi.string().trim().required()
   })

})




const paramsIdVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

const updateCarttVal = Joi.object({
    id: Joi.string().hex().length(24),
    quantity:Joi.number().integer().options({convert:false}).required()
})


export {
    createCashVal,
    paramsIdVal,
    
}