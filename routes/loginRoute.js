import express from 'express';
import { generateAuthToken } from '../models/repoCreate.js';
import { User } from '../models/users.js';

const router= express.Router();

router.post("/",async(req,res)=>{
    try {
        const userToLogin = await User.findOne({email:req.body.email});

        if(!userToLogin){
            return res.status(402).send({message:"Invalid Credentials :-Email"});
        }
        const isValidPassword = await bcrypt.compare(
            req.body.password,userToLogin.password
        )

        if(!isValidPassword){
            return res.status(402).send({message:"Incorrect Password"});
        }

        const token = await generateAuthToken(userToLogin._id);
        res.status(200).send({AuthToken:token,userName:userToLogin.userName,message:"Successfully LoggedIn"})
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});
export const logInRoutes = router;