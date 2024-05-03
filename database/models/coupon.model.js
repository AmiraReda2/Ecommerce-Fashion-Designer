import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code: {
        type: String,
        trim: true,
        required: true,
        unique:[true,"Code already exists"],
        minLength: [2, 'The code must be at least 2 characters'],
    },
    expires: Date,
    discount: Number,
  
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }
   
}, { timestamps: true })


export const couponModel = mongoose.model('coupon', schema)



