import express from 'express'
import verifyToken from '../middleware/JWT.js'
import { createTodo, getTodo, updateTodo, deleteTodo, restoreTodo } from '../controller/todoController.js'

const router = express.Router()

router.post('/createTodo', verifyToken, createTodo)
router.get('/getTodo', verifyToken, getTodo)
router.put('/updateTodo/:id', verifyToken, updateTodo)
router.put('/deleteTodo', verifyToken, deleteTodo)
router.put('/restoreTodo', verifyToken, restoreTodo)

export default router