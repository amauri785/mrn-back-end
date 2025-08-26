import mongoose from "mongoose";    

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('connected to mongodb')
    } catch (error) {
        console.error("MongoDB connect error:")
        process.exit(1);
    }
};
export default connectDB;