import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true,
            maxlength:32,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        }
    }
)
const User = mongoose.model("users",userSchema)

export {User};