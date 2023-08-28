import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import  dotenv from 'dotenv';
dotenv.config();
import sequelize from './util.js/database';

import path from 'path';
//import Routes
import userRoutes from './Routes/user';
import chatRoutes from './Routes/chat';
import groupRoutes from './Routes/group';

//importing Models
import User from './Models/user';
import Message from './Models/message';
// import Chat from './Models/chat';
import Group from './Models/group';
import UserGroup from './Models/userGroup';
const server = express();
server.use(cors({
    origin:"http://127.0.0.1:5500",
    methods:["GET","POST","DELETE"]
}));
server.use(bodyParser.json());

// Message.hasOne(Chat);
// Chat.hasOne(Message)

User.hasMany(Message);

Message.belongsTo(User);
Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });
// In the User model
// User.belongsToMany(Group, { through: UserGroup, as: 'groups', foreignKey: 'userId' });

// // In the Group model
// Group.belongsToMany(User, { through: UserGroup, as: 'members', foreignKey: 'groupId' });

server.use(userRoutes);
server.use(chatRoutes);
server.use(groupRoutes);
// server.use((req,res) =>{
//     res.sendFile(path.join(__dirname,`public${req.url}`));
// });


async function startServer (){
    try{
        await sequelize.sync({force:false});
        server.listen(process.env.PORT || 4000);
    }catch(err){console.log(err as string);}
}
startServer();