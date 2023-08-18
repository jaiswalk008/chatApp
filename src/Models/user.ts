import Sequelize from "sequelize";
import sequelize from "../util.js/database";

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phone:{
        type:Sequelize.BIGINT,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
export default User;