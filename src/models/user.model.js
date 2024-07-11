import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            index : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullName : {
            type : String,
            required : true,
            lowercase : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, // cloudanary URL
            required : true, 
        },
        coverImage : {
            type : String, 
        },
        watchHistory :[{
            type : Schema.Types.ObjectId,
            ref : "Video"
        }],
        password : {
            type : String,
            required : [true, "password is required"]
        },
        refreshToken :{
            type : String
        }
    }, {timestamps : true});

//Should not arrow function, bcoz it not have this reference
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return null;

    this.password = await bcrypt.hash(this.password, 10);
    next()
});

//defining custom method

userSchema.methods.isPasswordCorrect = async  function (password){
      return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken =  function (){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {
     expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshToken =  function (){
    return jwt.sign({
        _id : this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {
     expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
    })
}

export const User = mongoose.model("User", userSchema);