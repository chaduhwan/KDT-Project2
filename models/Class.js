const {DataTypes} = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('class',{
        ClassId : {
            type : DataTypes.INTEGER,
            allowNull : false, // not null
            primaryKey : true,
            autoIncrement : true,
        },
        className: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
        leader: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
    })
};

module.exports = Model;