import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter your Email'],
        unique: [true, 'Email Exist']
    },
    username: {
        type: String,
        required: [true, 'Please enter your Name'],
        unique: [true, 'Name Exist'],
        maxLength: 20,
        minLength: 5
    },
    password: {
        type: String,
        required: [true, 'Please enter your Password'],
        minLength: 5
    }
})

userSchema.pre('save', async function (next) {
    //Chỉ hash mk khi có mk mới
    if (!this.isModified('password')) return next()

    //tạo salt
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()
})

const User = mongoose.model('User', userSchema)

export default User