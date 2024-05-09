import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import  dotenv from 'dotenv';
dotenv.config();
import sequelize from './util.js/database';
import http from 'http';
import {Server} from 'socket.io';
import { redisPublisher , redisSubscriber } from './util.js/redis';
const server = express();

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
import { group } from 'console';

const app = http.createServer(server);
const io = new Server(app , {
    cors:{
        origin:'*',
    }
});

server.use(cors({
    // origin:"http://127.0.0.1:5500",
    // methods:["GET","POST","DELETE"]
}));
server.use(bodyParser.json());


User.hasMany(Message);
Message.belongsTo(User);
Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });


server.use(userRoutes);
server.use(chatRoutes);
server.use(groupRoutes);

// const triggerFunction:any ={};
io.on('connection',(socket) =>{
    console.log('connected:'+socket.id);
    socket.on('join-room' , async ({groupId, username}) =>{
        console.log('joined group' , groupId,username);
        socket.join(groupId);
        await redisSubscriber.subscribe(groupId);
        
        
    })
    socket.on('send-message',async (messageObj) => {
        console.log(messageObj);
        const {groupId} = messageObj;
        io.to(groupId).emit('receive-message',messageObj);
        await redisPublisher.publish( groupId, JSON.stringify(messageObj))
       
        // triggerFunction.sendMessage = function (groupId:any , messageObj:any) {
        //     io.to(groupId).emit('receive-message',messageObj)
        // }
    })
    socket.on('leave-room', (groupId) => {
        console.log('left group ',groupId)
        // socket.leave(groupId);
    })
    
  
    
})
//consuming messages
redisSubscriber.on('message' , (groupId:any,message)=> {
    console.log('consuming');
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
   
    console.log(groupId);
    io.to(groupId).emit('receive-message',message)
    // console.log(channel)

});
async function startServer(){
    try{
        await sequelize.sync({force:false});
        app.listen(process.env.PORT || 5000);
    }
    catch(err){console.log(err as string);}
}

startServer();
