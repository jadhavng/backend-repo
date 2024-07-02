import mongoose from "mongoose";
import { DB_NAME } from "/Users/admin/Desktop/Backend/Owntube/src/constants.js";


export async function connectDB(){
    try{
        console.log(process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        
    }catch(error){
        console.log('MongoDB connection error : ', error);
        process.exit(1); //Node JS provide instance of current process
    }
}