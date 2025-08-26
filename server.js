import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/config/database.js'


dotenv.config();
connectDB()
const POST = process.env.POST || 5000;

app.listen(POST,()=>{
    console.log(`server is running on port ${POST}`)
})