import mongoose from "mongoose"

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting')
        })
        mongoose.connection.on('connected', () => {
            console.log("MongoDB | Connected to MongoDB")
        })
        mongoose.connection.once('open', () => {
            console.log('MongoDB | Connected to database')
        })
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected')
        })
        
        // ✅ CONEXIÓN CORREGIDA - Usa MONGO_URI directamente
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000
        })
    } catch (err) {
        console.error('Database connection failed', err)
    }
}