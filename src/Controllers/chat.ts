import { Request, Response } from "express";
import Message from '../Models/message';
import User from '../Models/user';
export const getUserList = async (req:Request,res:Response)=>{
   try{
    const userList =await User.findAll();
    res.status(200).json({userList:userList});
   }
   catch(err){console.log(err);}

}
export const sendMessage = async (req:any,res:Response) =>{
    const text:string = req.body.message;
    console.log(req.body);
    console.log(text);
    try {
        
        const result =await req.user.createMessage({content:text}); 
        res.status(200).json({message:text});
    } catch (error) {
        console.log(error);
    }
    
}
export const getMessages =async (req:Request,res:Response)=>{
    try{
        const messages = await Message.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] } 
            ]
        });
        
        res.status(200).json({messages:messages});
    }
    catch(err){console.log(err);}
}