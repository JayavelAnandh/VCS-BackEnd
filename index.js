import express from 'express';
import dotenv from 'dotenv';
import { repoRoutes } from './routes/repoRoutes.js';
import cors from 'cors';
import { dataBaseConnection } from './db.js';
import { signUpRoute } from './routes/signUpRoute.js';
import { logInRoutes } from './routes/loginRoute.js';

const app = express();
dotenv.config();
dataBaseConnection();
app.get("/",(req,res)=>{
    res.status(200).send('Working Successsful')
})
app.use(cors());

app.use(express.json())
const corsOptions={
    origin:'*',
    Credentials:true,
    optionSuccessStatus:200,
}
app.use("/",repoRoutes);
app.use("/signUp",signUpRoute);
app.use("/logIn",logInRoutes);
app.listen(process.env.PORT)