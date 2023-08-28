import Sequelize, { TEXT } from 'sequelize';
import sequelize from '../util.js/database';

const Message = sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    content:{
        type:Sequelize.TEXT,
        allowNull:false

    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }


})
export default Message;