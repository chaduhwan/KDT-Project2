const {DataTypes} = require('sequelize');

const Chat = (sequelize)=>{
    const chats = sequelize.define('chatting',{
        chatNum:{
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        roomNum:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        message:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        send:{
            type: DataTypes.STRING(255),
            allowNull : false,
        }
    });
    chats.associate = (models)=>{
        chats.belongsTo(models.room,{foreignKey : {roomNum}, onDelete: 'CASCADE'});
    }
    return chats;
}
module.exports = Chat;