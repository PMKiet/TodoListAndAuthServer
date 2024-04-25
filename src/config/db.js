import mongoose from 'mongoose'

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas')
        })
        .catch((error) => {
            console.log('Unable to connect to MongoDB Atlas')
            console.log(error)
        })
}

export default connectDB