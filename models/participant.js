const {DataTypes} = require('sequelize');

const participant = (sequelize)=>{

    const participants =  sequelize.define('participant',{
        roomNum:{
            type : DataTypes.INTEGER,
            allowNull : false,
            // primaryKey : true,
        },
        member_list:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
    });
    participants.associate = (models)=>{
        participants.belongsTo(models.room,{foreignKey : {roomNum}, onDelete: 'CASCADE'});
    }
    return participants
};

module.exports = participant;
