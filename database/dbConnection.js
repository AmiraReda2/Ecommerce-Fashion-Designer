import mongoose from "mongoose"

export const dbConnection =()=>{
    mongoose.connect('mongodb+srv://amira:amira2614@cluster0.uftupgo.mongodb.net/Ecommerce_Fashion_Designer')
    .then(()=> console.log("Mongodb is connected"))
    .catch((err)=> console.log("databaes error" , err))

}

//mongodb+srv://Fashion-Designer:CEdxLUpLkphTmz4v@cluster0.uftupgo.mongodb.net/Ecommerce-Fashion-Designer
//mongodb://127.0.0.1:27017/Ecommerce-Fashion-Designer