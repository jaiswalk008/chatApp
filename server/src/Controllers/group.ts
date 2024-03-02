import { Request, Response } from "express";
import User from '../Models/user';
import Group from '../Models/group';
import UserGroup from '../Models/userGroup';
import { UserInterface } from "../Models/interface";
export const addGroup = async (req: any, res: Response) => {
    const groupDetails: { groupName: string, userList: UserInterface[] } = { ...req.body };
    groupDetails.userList.push(req.user);
    // console.log(groupDetails);
    try {
        // Create the group
        const group:any = await Group.create({
            groupname: groupDetails.groupName
        });

        // Create associations between users and the group
        for (const user of groupDetails.userList) {
            let admin=false;
            if(user.id==req.user.id) admin=true
            const userGroup = await UserGroup.create({
                userId:user.id,
                groupId: group.id,
                admin:admin
            });
            console.log(userGroup);
        }
        
        res.status(201).json({ message: 'Group created successfully' , groupId:group.id , groupName:groupDetails.groupName});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const getGroups = async (req:any,res:Response) =>{
    try{
        const groupIds = await UserGroup.findAll({where: {userId:req.user.id}, 
            attributes:['groupId'],
            
        });
        //map and filter functions do not wait for async ops to get completed
        //rather they return promises and these promises need to be resolved
        const groupDetailsPromises = groupIds.map(async (groupData: any) => {
            const group:any = await Group.findByPk(groupData.groupId);
            return {groupName: group.groupname,groupId:groupData.groupId};
        });
        
        const groupDetails = await Promise.all(groupDetailsPromises);
        
        
        res.status(201).json({groupDetails});
    }catch(err){console.log(err);}
}
export const getMembers = async (req:any , res:Response) =>{
    const groupId= req.query.groupId;
    try{
        const userIds = await UserGroup.findAll({where: {groupId:groupId}, 
            attributes:['userId','admin'],
            
        });
        
        const userNamePromises = userIds.map(async (userData: any) => {
            const user:any = await User.findByPk(userData.userId);
            return user.userName;
        });
        
        const userNames = await Promise.all(userNamePromises);
        // console.log(userNames);
        
        res.status(201).json({userIds:userIds,userNames:userNames});
    }
    catch(err){console.log(err);}
}
export const removeUser = async (req:any,res:Response) =>{
    const groupId:string= req.query.groupId;
    const userId:string = req.query.userId;
    // console.log(userId,groupId);
    try {
        const userGroup:any = await UserGroup.findAll({where:{userId:userId,groupId:groupId}});
        console.log(userGroup);
        await userGroup[0].destroy();
        res.status(201).json({message:"user removed"});
    } catch (error) {
        console.log(error);
    }
}
export const makeAdmin = async(req:any,res:Response)=>{
    const groupId:string= req.query.groupId;
    const userId:string = req.query.userId;
  
    try {
        const result= await UserGroup.update(
            { admin: true },
            { where: { userId: userId, groupId: groupId } }
        );

        res.status(201).json(result);
    } catch (error) {
        console.log(error);
    }
}
export const updateGroupName = async (req:Request , res:Response) =>{
    const groupName = req.query.groupName;
    const groupId = req.query.id;
    try{
        await Group.update(
            {groupname:groupName},
            {where:{id:groupId}}
        )
    }
    catch(err){console.log(err);}
}