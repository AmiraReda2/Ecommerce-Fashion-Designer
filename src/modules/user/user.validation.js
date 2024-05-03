
import Joi from "joi"


const addUserVal = Joi.object({
    name:Joi.string().min(2).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(),
    rePassword:Joi.valid(Joi.ref('password')).required(),
    role: Joi.string()
   
})

const paramsIdVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

const updateUserVal = Joi.object({
    id: Joi.string().hex().length(24).required(), 

    name:Joi.string().min(2).max(30),
    email:Joi.string().email(),
    password:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/),
    rePassword:Joi.valid(Joi.ref('password')),
    role:Joi.string().valid('user','admin')
})


export {
    addUserVal,
    paramsIdVal,
    updateUserVal,
}