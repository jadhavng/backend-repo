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

export {app}