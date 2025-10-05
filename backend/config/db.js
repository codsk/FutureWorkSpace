import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: 'config.env'});

console.log("sk",process.env.MONGO_URI);

export const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }catch(error){
        console.log({message:error.message})
    } 
}