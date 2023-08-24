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
        type:TEXT,
        allowNull:false

    },
    recieverId:{
        type:Sequelize.INTEGER,
        defaultValue:1,
        allowNull:false
    }

})
export default Message;