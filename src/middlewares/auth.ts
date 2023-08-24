/* this is a middleware to check who is login and then changing the req body and passing the controll to expenseController */
import jwt from 'jsonwebtoken';
import User from '../Models/user';
import { Response,NextFunction } from "express";

const authenticate = async (req:any,res:Response,next:NextFunction) =>{
    try{
        const token = req.header('Authorization');
        
        const result:any = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log('userId :' + result.userId);
       
        const user = await User.findByPk(result.userID);
       
        req.user = user;
        next();
    }
    catch(err){console.log(err)};
}
export default authenticate;