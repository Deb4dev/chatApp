import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './lib/db.js'
import {router as authRouter} from './routes/auth.route.js'
import  messageRouter from './routes/message.route.js'
import cors from 'cors'

dotenv.config()

const app = express()

const   PORT = process.env.PORT 

app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials:true,
  }
))


app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectDB()
})