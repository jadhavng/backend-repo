import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (res, req, next)=>{

try {

        //const token = req.req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        const token = req.req?.cookies?.accessToken
        if(!token){
            throw new ApiError(401, "Unauthorized token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
       const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
       if(!user){
        throw new ApiError(401, "Invalid Access token")
        }
    
        req.user = user;  // Adding user object 
        next(); 
} catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token ")
}
})