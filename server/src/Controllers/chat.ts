import { Request, Response } from "express";
import Message from '../Models/message';
import User from '../Models/user';
// import { Model, Op } from 'sequelize';
import * as S3services from '../services/s3service';
export const getUserList = async (req:Request,res:Response)=>{
   try{
    const userList =await User.findAll();
    res.status(200).json({userList:userList});
   }
   catch(err){console.log(err);}

}
export const sendMessage = async (req:any,res:Response) =>{
    const text:string = req.body.message;
    
    try {
        
        const result =await req.user.createMessage({content:text, groupId:req.body.groupId}); 
        
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
    
}
export const getMessages =async (req:Request,res:Response)=>{
   
    const groupId= req.query.groupId;
    try{
        const messages = await Message.findAll(
            {where:{ groupId:groupId},
            include: [
                { model: User, attributes: ['username'] }
            ],
            // order: [['createdAt', 'DESC']],      
            // limit:20
            });
        // console.log(messages); 
        res.status(200).json({messages:messages});
    }
    catch(err){console.log(err);}
}
export const sendFile = async (req:any, res:Response) => {
   
    try {
        const groupId  = req.query.groupId;
        const file = req.files[0];
         // console.log(file);
        const fileURL = await S3services.uploadToS3(file,file.originalname);

        const chat = await req.user.createMessage(
            {content:fileURL, groupId:groupId,type:file.mimetype},
           
        );

        res.status(200).json({ message: chat, status: true });


    } catch (err) {
        console.log(err);
    }
};