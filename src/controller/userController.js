import User from '../models/userSchema.js'
import RefreshToken from '../models/refreshTokenSchema.js'
import bcrypt from 'bcrypt'
import { generateAccessToken, saveRefreshToken } from '../utils/generateToken.js'
import jwt from "jsonwebtoken"

//Register <<<<<<<<<<
const register = async (req, res) => {
    const { email, username, password } = req.body
    try {
        const userEmailExist = await User.findOne({ email })
        const userNameExist = await User.findOne({ username })
        if (!userEmailExist || !userNameExist) {
            await User.create({
                email,
                username,
                password
            })

            return res.status(201).json({ message: 'Đăng ký thành công' })

        } else if (userEmailExist.email === email) {
            res.status(400).json({ message: 'Email đã tồn tại', type: 'email' })
            return
        } else if (userNameExist.username === username) {
            res.status(400).json({ message: 'Tên người dùng đã tồn tại', type: 'username' })
            return
        }


    } catch (error) {
        if (error.code === 11000) {

            return res.status(400).json({ message: 'Người dùng đã tồn tại' })

        } else if (error.kind === 'minlength') {
            return res.status(400).json({ message: 'Tối Thiểu 5 ký tự' })
        } else {
            // Handle other errors
            res.status(500).json('Lỗi máy chủ khi đăng ký')
            throw error; // Re-throw non-duplicate key errors
        }
    }

}

//Login <<<<<<<<<<
const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({ message: 'Người dùng không tồn tại', type: 'email' })
            return
        }

        const isMatchPassword = await bcrypt.compare(password, user.password)
        console.log(isMatchPassword)
        if (isMatchPassword === false) {
            res.status(401).json({ message: 'Mật khẩu không đúng' })
            return
        }

        let payload = { userId: user._id, username: user.username }
        const token = generateAccessToken(res, payload)
        saveRefreshToken(payload)


        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token
        })

    } catch (error) {
        console.error(error)
        res.status(500).json('Lỗi máy chủ khi đăng nhập')
    }
}
const logout = async (req, res) => {
    const { userId } = req.body
    try {

        if (!userId) return res.status(401).json({ message: 'Bạn chưa đăng nhập' })
        await RefreshToken.findOneAndDelete(userId)
        res.status(200).json({ message: 'Đăng xuất thành công' })
    } catch (error) {
        console.error(error)
        res.status(500).json('Lỗi máy chủ khi đăng Xuất')
    }
}
export {
    register,
    login,
    logout
}