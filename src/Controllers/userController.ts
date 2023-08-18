import User from "../Models/user";
import { Request, Response } from "express";
import { UserInterface } from "../Models/interface";
import bcrypt from 'bcryptjs';
export const addUser = async (req:Request,res : Response) =>{
    try {
        
        const userDetails = {...req.body as UserInterface};
        const checkEmail = await User.findOne({where :{email:userDetails.email}});
        const checkPhone = await User.findOne({where :{phone:userDetails.phone}});
        console.log(userDetails);
        if(checkEmail){
            res.status(409).json({message:"A user is already registered with this e-mail address"});
        }
        else if(checkPhone){
            res.status(409).json({message:"A user is already registered with this Phone Number"});
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
