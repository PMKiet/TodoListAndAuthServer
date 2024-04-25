import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập' })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY)

        req.userId = decoded.userId

        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Bạn chưa đăng nhập' })
    }

}

export default verifyToken