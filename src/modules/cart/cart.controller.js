
import { cartModel } from '../../../database/models/cart.model.js'
import { couponModel } from '../../../database/models/coupon.model.js'
import { productModel } from '../../../database/models/product.model.js'
import { catchError } from '../../middleware/catchError.js'
import { AppError } from '../../utils/appError.js'


//! ============================== calcTotalPrice ===========================//
const calcTotalPrice = (cart) => {
   let totalPrice = 0
       cart.cartItems.forEach((item) => {
          totalPrice += item.quantity *  item.price  
       })
       cart.totalPrice = totalPrice

       if(cart.discount){
         let totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) /100
         cart.totalPriceAfterDiscount = totalPriceAfterDiscount
       }
}
// ! =================================  addToCart ============================//
const addToCart = catchError(async (req, res, next)=>{

     let product = await productModel.findById(req.body.product)
     if(!product) return next(new AppError("Product not found!", 404)) 
      
     if(req.body.quantity > product.quantity )return next(new AppError('sold out'))
         req.body.price = product.price
 
     let isCartExist = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product')
     if(!isCartExist){
       let cart = new cartModel({
          user: req.user._id ,
          cartItems: [req.body]
       })

       calcTotalPrice(cart)
       await cart.save()

       !cart && res.status(404).json( {message: "Cart not found"})
       cart && res.json({ message:"success" , cart}) 
    }
    else{
       let item = isCartExist.cartItems.find((item) => item.product == req.body.product)
       if(item) {
         if(item.quantity >= product.quantity) return next(new AppError('sold out'))
            item.quantity += req.body.quantity || 1 
       }
        else isCartExist.cartItems.push(req.body)

        calcTotalPrice(isCartExist)

        await isCartExist.save()
        res.json({ message:"success" , cart: isCartExist})
  }
 
})
 
//! ====================== removeItemFromCart ====================================//
const removeItemFromCart = catchError(async (req, res, next)=>{
    
    let cart = await cartModel.
         findOneAndUpdate( {user: req.user._id }, { $pull: {cartItems: {_id:req.params.id} } }, { new:true }).populate('cartItems.product')
     
         calcTotalPrice(cart)
         await cart.save()

      !cart && res.status(404).json({message:"Cart not found"})
      cart && res.json({ message:"success" , cart}) 
})

//! ====================== updateQuantity ====================================//
const updateQuantity = catchError(async (req, res, next)=>{
   let cart = await cartModel.findOne( {user: req.user._id })
   !cart && res.status(404).json({message:"Cart not found"})

   let item = cart.cartItems.find((item=> item._id == req.params.id))
    if(!item) return next(new AppError('Item Not Found',404))
    item.quantity = parseInt(req.body.quantity)

        calcTotalPrice(cart)
        await cart.save()
     cart && res.json({ message:"success" , cart}) 
})

//! ====================== getLoggedUserCart ====================================//
const getLoggedUserCart = catchError(async (req, res, next)=>{
    
    let  cart = await cartModel.findOne({user:req.user._id}).populate('cartItems.product')
    !cart && res.status(404).json({message:"Cart not found"})
     cart  && res.json({ message:"success" , cart }) 
})

//! ====================== clearUserCart ====================================//
const clearUserCart = catchError(async (req, res, next)=>{
    
   let  cart = await cartModel.findOneAndDelete({user:req.user._id}).populate('cartItems.product')
   !cart && res.status(404).json({message:"Cart not found"})
    cart  && res.json({ message:"success" , cart }) 
})

//! ====================== applyCoupon ====================================//
const applyCoupon = catchError(async (req, res, next)=>{
    let coupon  = await couponModel.findOne({code: req.body.coupon, expires:{$gte : Date.now() } } )
    if(!coupon) return next(new AppError('Invalid Coupon Code',401))

    let cart = await cartModel.findOne({ user:req.user._id }).populate('cartItems.product')
    if(!cart) return next(new AppError('Cart not found',400))

    let totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    cart.discount = coupon.discount 

    await cart.save()
    res.json({ message:"success" , cart }) 
}) 



export {
     addToCart,
     removeItemFromCart,
     updateQuantity,
     getLoggedUserCart,
     clearUserCart,
     applyCoupon
}