
import { userModel } from '../../../database/models/user.model.js';
import { catchError } from '../../middleware/catchError.js'




//! ============================== addToWhislist ===========================//
const addToWhislist = catchError(async (req, res, next)=>{
    
    let wishlist = await userModel.
         findByIdAndUpdate( req.user._id , { $addToSet:{ wishlist:req.body.product } }, { new:true }).populate('wishlist')
    !wishlist && res.status(404).json({message:"Wishlist not found"})
     wishlist && res.json({ message:"success" , wishlist: wishlist.wishlist }) 
})

//! ====================== removeFromWhislist ====================================//
const removeFromWhislist = catchError(async (req, res, next)=>{
    
    let wishlist = await userModel.
         findByIdAndUpdate( req.user._id , { $pull: { wishlist: req.params.id } }, { new:true }).populate('wishlist')
    !wishlist && res.status(404).json({message:"Wishlist not found"})
     wishlist && res.json({ message:"success" , wishlist: wishlist.wishlist }) 
})


//! ====================== getLoggedUserWhislist ====================================//
const getLoggedUserWhislist = catchError(async (req, res, next)=>{
    
    let { wishlist } = await userModel.findById(req.user._id).populate('wishlist')
    !wishlist && res.status(404).json({message:"Wishlist not found"})
     wishlist && res.json({ message:"success" , wishlist }) 
})


export {
    addToWhislist,
    removeFromWhislist,
    getLoggedUserWhislist
}