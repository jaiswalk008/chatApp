import  {Sequelize}  from "sequelize";
const sequelize = new Sequelize('chatapp', 'root','karan123', {dialect:"mysql" , host:process.env.DB_HOST} );

export default sequelize;