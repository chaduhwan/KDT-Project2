const {DataTypes} = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('board',{
        BoardId : {
            type : DataTypes.INTEGER,
            allowNull : false, // not null
            primaryKey : true,
            autoIncrement : true,
        },
        title: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
        date: {
            type : DataTypes.STRING(255),
            allowNull : false,
            defaultValue: '0000-00-00 00:00:00'
        },
        writer : {
            type : DataTypes.STRING(20),
            allowNull : false,
            defaultValue : 'userid' // 기본값
        },
        content: {
            type : DataTypes.STRING(3000),
            allowNull : false,
        },
        tag : {
            type : DataTypes.STRING(20),
            allowNull : true,
        },
    })
};

module.exports = Model;