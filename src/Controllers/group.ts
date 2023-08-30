import { Request, Response } from "express";
import User from '../Models/user';
import Group from '../Models/group';
import UserGroup from '../Models/userGroup';
import { Model } from "sequelize";
export const addGroup = async (req: any, res: Response) => {
    const groupDetails: { groupName: string, userIds: number[] } = { ...req.body };
    groupDetails.userIds.push(req.user.id);
    console.log(groupDetails);
    try {
        // Create the group
        const group:any = await Group.create({
            groupname: groupDetails.groupName
        });

        // Create associations between users and the group
        for (const userId of groupDetails.userIds) {
            let admin=false;
            if(userId==req.user.id) admin=true
            const userGroup = await UserGroup.create({
                userId,
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
        const groupNamesPromises = groupIds.map(async (groupData: any) => {
            const group:any = await Group.findByPk(groupData.groupId);
            return group.groupname;
        });
        
        const groupNames = await Promise.all(groupNamesPromises);
        
        
        res.status(201).json({groupIds:groupIds,groupNames:groupNames});
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
            return user.username;
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
    console.log(userId,groupId);
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
    console.log(groupId,userId);
    console.log(userId,groupId);
    try {
        const result= await UserGroup.update(
            { admin: true },
            { where: { userId: userId, groupId: groupId } }
        );

            console.log(result);
        
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
    }
}