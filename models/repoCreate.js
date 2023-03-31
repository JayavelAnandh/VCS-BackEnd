import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const repoSchema = new mongoose.Schema(
    {
        repositoryName:{
            type:String,
            required:true
        },
        createdby:{
            type:String,
            required:true,
            trim:true
        },
        createdat:{
            type:String,
            required:true,
        },
        file:{
            type:String,
            required:true,
        },
        history:[
            {commitedby:{
                type:String,
            },
            commitedat:{
                type:String
            },
            content:{
                type:String,
            }}
        ]
    }
)
const generateAuthToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}
const Repository = mongoose.model("repository",repoSchema);
export{Repository,generateAuthToken}