import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import sequelize from './util.js/database';
env.config();
import path from 'path';
import userRoutes from './Routes/user';
const server = express();
server.use(cors({
    origin:"http://127.0.0.1:5500",
    methods:["GET","POST","DELETE"]
}));
server.use(bodyParser.json());

server.use('/addUser',userRoutes);
server.use((req,res) =>{
    res.sendFile(path.join(__dirname,`public${req.url}`));
});

async function startServer (){
    try{
        await sequelize.sync();
        server.listen(process.env.PORT || 4000);
    }catch(err){console.log(err as string);}
}
startServer();