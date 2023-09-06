const {DataTypes} = require('sequelize');

const room = (sequelize)=>{
    const rooms =  sequelize.define('room',{
        //방 번호
        roomNum:{
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        Name1:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        Name2:{
            type: DataTypes.STRING(255),
            allowNull : false,
        }
        //방 이름은 추후에 추가

        // roomName:{
        //     type : DataTypes.STRING(30),
        //     allowNull : false,
        // },
        // freezeTableName : true,
    });
    return rooms;
};

module.exports = room;
