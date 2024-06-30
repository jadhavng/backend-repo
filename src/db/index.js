import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "/Users/admin/Desktop/Backend/Owntube/src/constants.js";

const app = express();


export async function connectDB(){
    try{
        console.log(process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);

        app.on("error", (error)=>{
            console.log("Error : ", error);
            throw error; 
        })
        app.listen(process.env.PORT, ()=>{
            console.log("Application is running on : ", process.env.PORT);
        })

        
    }catch(error){
        console.log('MongoDB connection error : ', error);
        process.exit(1); //Node JS provide instance of current process
    }
}