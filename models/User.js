const {DataTypes} = require('sequelize');

const Model = (sequelize) =>{
    return sequelize.define('user', {
        id :{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(40),
            // allowNull: false,
        },
        pw: {
            type: DataTypes.STRING(255),
            // allowNull: false
        },
        name: {
            type: DataTypes.STRING(128),
            // allowNull: false,
        },
        phone: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        userType:{
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        snsId: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: true,
        }
    },
    {
        tableName: 'user', //테이블 이름 설정
        freezeTableName: true, //true로 설정하면 이름을 복수로 설정하지 않음
        timestamps: true, // createAt & updateAt을 활성화
    })
}

module.exports = Model