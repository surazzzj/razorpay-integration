import mongoose from 'mongoose'

const connectDb = () => {
    mongoose.connection.on('connected', () => {
        console.log("Database connected succesfully");
    })

    mongoose.connect(process.env.MONGODB_URI)
}

export default connectDb