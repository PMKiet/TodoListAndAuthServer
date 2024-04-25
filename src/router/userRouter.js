import express from 'express'
import { refreshAccessToken } from '../utils/generateToken.js'
import verifyToken from '../middleware/JWT.js'

const router = express.Router()
import {
    register,
    login,
    logout
} from '../controller/userController.js'



router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refreshToken', verifyToken, refreshAccessToken)

export default router