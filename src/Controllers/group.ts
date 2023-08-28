import { Request, Response } from "express";
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
            const userGroup = await UserGroup.create({
                userId,
                groupId: group.id
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
