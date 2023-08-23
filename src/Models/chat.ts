import Sequelize from "sequelize";
import sequelize from "../util.js/database";

const Chat = sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:true
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false
    }

})
export default Chat;