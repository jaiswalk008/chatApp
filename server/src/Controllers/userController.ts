import User from "../Models/user";
import { Request, Response } from "express";
import { UserInterface } from "../Models/interface";
import bcrypt from 'bcryptjs';
import jwt from'jsonwebtoken';

export const addUser = async (req:Request,res : Response) =>{
    try {
        
        const userDetails:UserInterface = {...req.body};
        
        const checkEmail = await User.findOne({where :{email:userDetails.email}});
        
        if(checkEmail){
            res.status(409).json({message:"A user is already registered with this e-mail address"});
        }
        else{
            const saltRounds = 10;
            bcrypt.hash(userDetails.password,saltRounds, async (err,hash)=>{
              //we can use const user because const is blocked scope
              if(err) console.log(err);
              else{
                const user = await User.create({...userDetails,password:hash});
                res.status(200).json({message:'Signup successful', userDetails: user});
              }
              
            })
            
        }
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }

}
function generateToken(id:number){
    return jwt.sign({userID: id},process.env.JWT_SECRET_KEY);
}
export const login = async (req:Request , res: Response)=>{
    const loginDetails:UserInterface = {...req.body};
    // console.log(loginDetails);
    try{
        const user:any = await User.findOne({where:{email: loginDetails.email}});
        console.log(user.userName);
        if(user){
            bcrypt.compare(loginDetails.password , user.password, (err,result)=>{
                if(err) res.status(500).json({message:"Something went wrong"});
                else if(result===true){
                    res.status(200).json({message:'Login Successful',username:user.userName,token:generateToken(user.id)});
                }
                else{
                    res.status(401).json({message:"User not authorized"});
                }
            })
        }
        else{
            res.status(404).json({message:"User not found :("});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}