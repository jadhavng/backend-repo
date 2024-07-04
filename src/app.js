import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true,
}))

//Configuration 
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true})); //help to encode url 
app.use(express.static("Public")); // If we want to store images, file in server before storing in DB , Hence we created Public folder in oue directory 
app.use(cookieParser())// To secured store cookies in user browser and read it


//import router 
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users", userRouter); //here we 'use' middleware bcoz we have segregated all things. 
                                    //Whenever https://localhost:8000/api/v1/users api triggers then control given to user.route class

export {app}