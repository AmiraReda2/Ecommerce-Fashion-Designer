
import Joi from "joi"


const addCartVal = Joi.object({
    product: Joi.string().hex().length(24),
    quantity:Joi.number().integer().options({convert:false})

})

const paramsIdVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

const updateCarttVal = Joi.object({
    id: Joi.string().hex().length(24),
    quantity:Joi.number().integer().options({convert:false}).required()
})


export {
    addCartVal,
    paramsIdVal,
    updateCarttVal,
}