import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";

function isEmpty(Value){
       return (Value === "" || Value === undefined)
}

async function  generateAccessTokenAndRefreshToken(userId){
    try {
        const user = await User.findById(userId);

        const accessToken =  user.generateAccessToken();
        
        const refreshToken =  user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave : false});

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError('500', "Something went wrong while generating token")
    }
}
const registerUser = asyncHandler(async (req, res)=>{
        //take input from frontend 
        //add validation
        //check user is already register
        //check avtar file is there 
        //upload on cloudinary 
        //check uploaded or not
        //create user object - create user entry in Db
        //remove password and refresh token from responce 
        //check for user creation 
        //return user
        
        const {fullName, email, userName , password } = req.body;
        console.log("email : ", email);
        //Validation
        if (
            [fullName, email, userName , password].some((field)=>{
                return isEmpty(field?.trim());
            })
        ) {
            console.log("working")
            throw new ApiError(400, "All field are required")
        }

        //Checking user already registered 
        const existingUser = await User.findOne({
            $or : [{email},{userName}]
        })
        console.log(existingUser);
        if(existingUser){
            throw new ApiError(409, "User with email or username already exist ")
        }

        //file handling

        const avatarLocalPath = req.files?.avatar[0]?.path;
        //const coverImageLocalPath = req.files?.coverImage[0].path;

        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImageLocalPath = req.files?.coverImage[0]?.path;
        }
        
        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400, "Avtar file is required in cloudinary ")
        }

        //creating user object 
        const user = await User.create({
            email,
            fullName,
            avatar : avatar.url,
            coverImage : coverImage.url || "",
            password,
            userName : userName.toLowerCase()
        }
        );

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "user Registered successfully ")
        )

})

const loginUser = asyncHandler(async (req, res)=>{

    const{email, userName, password} =  req.body;
    
    if(!(email || userName)){
        console.log(email, userName);
        throw new ApiError(400, "email or username is required")
    }

    const user = await User.findOne({
        $or : [{userName}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not found")
    }
    
    //console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(user)).filter(prop => typeof user[prop] === 'function'));
    const isPasswordValid =  user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(404, "Password is incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password, -refreshToken"
    );

    //designing cookies 
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user : loggedInUser, refreshToken, accessToken
            },
             "User Logged In successfully"
        )
    )
})


const logOutUser = asyncHandler(async (req, res)=>{
    //console.log(res);
   await User.findByIdAndUpdate(res.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true  //provide updated value from db
        }
   )

   const options ={
    httpOnly : true,
    secure : true
   }

   return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("accessToken", options)
            .json(new ApiResponse(200, {}, "User Logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
     const inComingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

     if(!inComingRefreshToken){
        throw new ApiError(401, "Unauthorized token")
     }
     
     const decodedToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!User){
        throw new ApiError(401, "Invalid user token")
     }

     if(inComingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is used or expired ")
     }
 
     const options = {
        httpOnly : true,
        secure : true
    }

    const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(200,
            {
                accessToken, 
                refreshToken : newRefreshToken
            },
            "access token refreshed"
        )
    )

})
export {registerUser, loginUser, logOutUser, refreshAccessToken}