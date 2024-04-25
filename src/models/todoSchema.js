import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
})

const Todo = mongoose.model('Todo', todoSchema)

export default Todo