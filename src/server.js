import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './config/db.js'
import userRouter from './router/userRouter.js'
import todoRouter from './router/todoRouter.js'

connectDB()

const port = process.env.PORT_APP || 5000
const name = process.env.HOST_APP

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/users', userRouter)
app.use('/api/todo', todoRouter)

app.get('/', (req, res) => res.send('Server is ready'))

app.listen(port, () => console.log(`Server stared on http://${name}:${port}`))