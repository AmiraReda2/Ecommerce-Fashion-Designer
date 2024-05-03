import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { dbConnection } from './database/dbConnection.js'
import { bootstrap } from './src/modules/index.routes.js'
import { createOnlineOrder } from './src/modules/order/order.controller.js'

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.post('/webhook', express.raw({type: 'application/json'}),createOnlineOrder)
app.use(express.json())
app.use('/uploads',express.static('uploads'))

bootstrap(app)
dbConnection()

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))

process.on('unhandledRejection', (err) =>{
    console.log('unhandledRejection' , err)
})