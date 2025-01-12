import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth/auth.mjs'
import userRouter from './routes/users/users.mjs'
import productRouter from './routes/products/products.mjs'
import orderRouter from './routes/orders/orders.mjs'
import cors from 'cors'


dotenv.config()
const app = express()
app.listen(process.env.MAIN_PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.MAIN_PORT}`)
})


app.use(express.json({limit: '50mb'}))
app.use(cors())
app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api',productRouter)
app.use('/api', orderRouter)