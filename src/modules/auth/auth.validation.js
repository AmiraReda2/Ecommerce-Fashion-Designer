import Joi from "joi";

const signupVal = Joi.object({
    name:Joi.string().min(2).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    rePassword:Joi.valid(Joi.ref('password')).required(),
    role: Joi.string()
})

const signinVal = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
})

const changePasswordVal = Joi.object({
    password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    newPassword:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
})


export {
    signupVal,
    signinVal,
    changePasswordVal
}