import Sequelize from 'sequelize';
import sequelize from '../util.js/database';

const UserGroup = sequelize.define('user_group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
    }
});

export default UserGroup;
