const {DataTypes} = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('comment',{
        commentId : {
            type : DataTypes.INTEGER,
            allowNull : false, // not null
            primaryKey : true,
            autoIncrement : true,
        },
        content: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
        writer: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
        date: {
            type : DataTypes.STRING(255),
            allowNull : false,
            defaultValue: '0000-00-00 00:00:00'
        },
        img : {
            type : DataTypes.STRING(255),
            allowNull : false,
        }
    })
};

module.exports = Model;