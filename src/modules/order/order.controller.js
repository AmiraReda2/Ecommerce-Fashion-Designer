
import { cartModel } from '../../../database/models/cart.model.js'
import { orderModel } from '../../../database/models/order.model.js'
import { productModel } from '../../../database/models/product.model.js'
import { catchError } from '../../middleware/catchError.js'
import { AppError } from '../../utils/appError.js'
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PBZng2NWYimMti9iMTzq4J9L7FGp8jVBNw9qYcCMFuB5rSaQI4vQeXrOWciVdo5cazAaf59nRq1AjuiMnWobIiW00pRyND8oG')


//! ===================== createOderCash ====================== //
const createOderCash = catchError(async (req, res, next)=>{
// 1- get cart -> cartId
const cart = await cartModel.findById(req.params.id)

// 2- total order price
const totalOrderPrice = cart.totalPriceAfterDiscount ? 
        cart.totalPriceAfterDiscount : cart.totalPrice

// 3- create order -> cash
const order = new orderModel({
   user:req.user._id,
   cartItems: cart.cartItems,
   totalOrderPrice,
   shippingAddress: req.body.shippingAddress,
}) 
  await order.save()

if(order){
// 4- increment sold & decrement quantity
let options = cart.cartItems.map(item =>({
   updateOne :
   {
         "filter":{_id: item.product},
         "update":{$inc:{sold: item.quantity , quantity:-item.quantity }}            
    }

}))
    await productModel.bulkWrite(options)

// 5- clear cart 
   await cartModel.findByIdAndDelete(req.params.id)
   return res.status(201).json({message:"Your Order has been created!" ,order })

}else {
   return next(new AppError('erroe in cart id ',404))
}})

//! ==================== getSpecificOrders =====================//
const getSpecificOrder = catchError(async (req, res, next)=>{
 
   let order = await orderModel.findOne({user: req.user._id}).populate('orderItems.product')
   res.status(200).json({ message:'sucess', order})
   
   })

//! ==================== getAllOrders  =====================//
const getAllOrders = catchError(async (req, res, next)=>{
 
   let orders = await orderModel.find({}).populate('orderItems.product')
   res.status(200).json({ message:'sucess', orders})
   
   })
//! ===================== createCheckOutSession ======================//
   const createCheckOutSession = catchError(async (req, res, next)=>{
      try {
         const cart = await cartModel.findById(req.params.id);
         
         if (!cart) {
           throw new Error('Cart not found');
         }
     const totalOrderPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice;
         

      // const cart = await cartModel.findById(req.params.id)
      // const totalOrderPrice = cart.totalPriceAfterDiscount ?
      //          cart.totalPriceAfterDiscount : cart.totalPrice
 
      let session = await stripe.checkout.sessions.create({
         line_items:[
            {
               price_data:{
                  currency:'egp',
                  unit_amount: totalOrderPrice * 100,
                  product_data:{
                     name: req.user.name
                  } 
               },
               quantity: 1
            }
         ],
         mode:"payment",
         success_url:"https://route-comm.netlify.app/#/",
         cancel_url:"https://route-comm.netlify.app/#/cart",
         customer_email:req.user.email,
         client_reference_id:req.params.id,
         metadata:req.body.shippingAddress
      })
      res.json({ message:"success", session})
   }
      catch (error) {
         res.status(500).json({ error: error.toString() });
       }
      
 })


//!  =========================== createOnlineOrder ================================//
   const createOnlineOrder = catchError(async (request, response) => {
      const sig = request.headers['stripe-signature'].toString();
    
      let event;
    
      try {
        event = stripe.webhooks.constructEvent(request.body, sig, "whsec_Nw6kWoVkRLhUBgF96kqfyLH0Z5jZyf6R");
      } catch (err) {
         return response.status(400).send(`Webhook Error: ${err.message}`);
      }
    
      // Handle the event
      if(event.type){
         const checkoutSessionCompleted = event.data.object;
         console.log("create order here")
      }else{
         console.log(`Unhandled event type ${event.type}`);
      }
    })


export {
   createOderCash,
   getSpecificOrder,
   getAllOrders,
   createCheckOutSession,
   createOnlineOrder

}