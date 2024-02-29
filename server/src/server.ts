import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import  dotenv from 'dotenv';
dotenv.config();
import sequelize from './util.js/database';
import http from 'http';
import {Server} from 'socket.io';
import path from 'path';
import { CronJob } from 'cron';
import backup from './Controllers/archivedChat';
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
// server.use((req,res) =>{
//     if(req.url=='/') res.redirect('http://localhost:4000/user/signup.html');
//     else res.sendFile(path.join(__dirname,`public${req.url}`));
// });

//socket.io

// io.on('connection',(socket) =>{
//     console.log(socket.id);
//     socket.on('send-message',(chatMessage:{message:string,groupId:string,username:string,type:string}) =>{
//         // socket.join(chatMessage.groupId);
//         socket.to(chatMessage.groupId).emit("received-message",chatMessage);
//         // console.log(chatMessage);
//     })
//     socket.on('join-room',(room:string) =>{
//         console.log(`User ${socket.id} joined room: ${room}`);
//         socket.join(room);
      
//     })
//     socket.on('leave-room', (room) => {
//         socket.leave(room);
//         // console.log(`User ${socket.id} left room: ${room}`);
//     });
 
// })

io.on('connection',(socket) =>{
    console.log('connected:'+socket.id);
    socket.on('join-room' , (groupId:string) =>{
        console.log('joined group' , groupId);
        socket.join(groupId);
    })
    socket.on('send-message',(obj) => {
        console.log(obj);
        const {groupId} = obj;
        socket.to(groupId).emit('receive-message',obj);
    })
    socket.on('leave-room', (groupId) => {
        console.log('left group ',groupId)
        socket.leave(groupId);
    })
    
})

//backup will start at
// const job = new CronJob('00 00 00 * * *', backup);
// job.start();

async function startServer(){
    try{
        await sequelize.sync({force:false});
        app.listen(process.env.PORT || 5000);
    }catch(err){console.log(err as string);}
}

startServer();
