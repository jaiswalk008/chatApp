import { Request, Response } from "express";
import Message from '../Models/message';
import User from '../Models/user';
import { Model, Op } from 'sequelize';

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
        
        const result =await req.user.createMessage({content:text, groupId:req.body.groupId}); 
        res.status(200).json({message:text});
    } catch (error) {
        console.log(error);
    }
    
}
export const getMessages =async (req:Request,res:Response)=>{
    const lastMessageId = req.query.lastMessageId;
    const groupId= req.query.groupId;
    console.log('groupid = '+groupId);
    try{
        const messages = await Message.findAll(
            {where:{ groupId:groupId, id: {[Op.gt]: lastMessageId }},
            include: [
                { model: User, attributes: ['username'] }
            ]
            ,limit:10
            });
        // console.log(messages);
        res.status(200).json({messages:messages});
    }
    catch(err){console.log(err);}
}