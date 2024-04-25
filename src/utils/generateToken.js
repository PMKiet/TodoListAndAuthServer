import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import RefreshToken from '../models/refreshTokenSchema.js'
import mongoose from 'mongoose'

dotenv.config()


const generateAccessToken = (res, payload) => {

    let key = process.env.ACCESS_SECRET_KEY
    let token = jwt.sign(payload, key, { expiresIn: '1d' })
    res.cookie('jwt', token, {
        httpOnly: true
    })

    return token
}


// Generate a new refresh token
const generateRefreshToken = (payload) => {
    const key = process.env.REFRESH_SECRET_KEY;
    const token = jwt.sign(payload, key, { expiresIn: '5d' })

    return token
};

// Update the refresh token in MongoDB
const saveRefreshToken = async (payload) => {
    try {
        const token = generateRefreshToken(payload); // Generate token with email
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5); // 5 days
        // Create refresh token in database
        const objectId = new mongoose.Types.ObjectId(payload.userId)

        const refreshToken = await RefreshToken.create({
            userId: objectId,
            token,
            expiresAt,
        });

        // Check for successful creation (recommended)
        if (!refreshToken) {
            throw new Error('Failed to create refresh token'); // Throw a specific error
        }

        // Consider returning only necessary information (optional)
        return { message: 'Refresh token updated successfully', userId: refreshToken.userId }; // Return relevant data

    } catch (error) {
        console.error(error);
        return { message: `An error occurred: ${error}` };
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const authHeader = req.header('Authorization')
        const token = authHeader && authHeader.split(' ')[1]

        const isValid = await RefreshToken.findOne({ token })

        if (!isValid) {
            throw new Error('Token not exist')
        }

        const decode = jwt.verify(isValid.token, process.env.REFRESH_SECRET_KEY)
        const { userId, username } = decode
        generateAccessToken(res, { userId, username })

        res.status(200).json('ok')
    } catch (error) {
        console.error(error);
        return { message: `An error occurred: ${error}` };
    }
}




export { generateAccessToken, generateRefreshToken, saveRefreshToken, refreshAccessToken }