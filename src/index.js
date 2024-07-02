// require('dotenv').config({path : "./env"})
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : "./env"
});


connectDB()
.then(()=>{
    app.on("error", (error )=>{
        console.log("Error with express app : ", error);
        process.exit(1);
    })
    app.listen(process.env.PORT || 8000, () =>{
        console.log("Application is running on : ", process.env.PORT);
    });
})
.catch((error)=>{
    console.log("MongoDB connection error ", error);
})