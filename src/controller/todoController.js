import Todo from "../models/todoSchema.js"
import jwt from 'jsonwebtoken'


const createTodo = async (req, res) => {
    try {
        const { description } = req.body
        const authHeader = req.header('Authorization')
        const token = authHeader && authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY)

        if (!decoded) return new Error(res.status(401).json({ message: 'Bạn chưa đăng nhập' }))

        const userId = decoded.userId

        const todo = await Todo.create({
            userId,
            description,
        })

        if (todo) {
            res.status(201).json({
                userId: todo.userId,
                description: todo.description,
            })
        }

    } catch (error) {
        return res.status(409).json({ message: 'Tạo thất bại' })
    }
}

const getTodo = async (req, res) => {
    try {
        const { userId } = req
        // const userId = new mongoose.Types.ObjectId(req.userId)
        const todoFromUserId = await Todo.find({ userId })
        return res.status(201).json(todoFromUserId)
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateTodo = async (req, res) => {
    const { id } = req.params
    const { description } = req.body
    try {
        const todo = await Todo.findByIdAndUpdate(id, {
            description
        })

        if (!todo) {
            return res.status(404).json({ message: 'Cập Nhật thất bại 1' })
        }

        res.status(200).json({ message: 'ok' })
    } catch (error) {
        res.status(400).json('Cập nhật thất bại')
    }
}

const deleteTodo = async (req, res) => {
    const { id, deletedAt } = req.body
    try {
        const todo = await Todo.findByIdAndUpdate(id, {
            deletedAt
        })
        if (!todo) {
            return res.status(404).json({ message: 'Xóa thất bại 1' })
        }

        res.status(200).json({ message: 'ok' })
    } catch (error) {
        console.log(error);
        res.status(400).json('Xóa thất bại ')
    }
}

const restoreTodo = async (req, res) => {
    const { id } = req.body
    const deletedAt = null
    try {
        const todo = await Todo.findByIdAndUpdate(id, {
            deletedAt
        })
        if (!todo) {
            return res.status(404).json({ message: 'Xóa thất bại 1' })
        }

        res.status(200).json({ message: 'ok' })
    } catch (error) {
        console.log(error);
        res.status(400).json('Xóa thất bại ')
    }
}

export { createTodo, getTodo, updateTodo, deleteTodo, restoreTodo }