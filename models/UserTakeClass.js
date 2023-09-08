const {DataTypes} = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('UserTakeClass',{
        TakeId : {
            type : DataTypes.INTEGER,
            allowNull : false, // not null
            primaryKey : true,
            autoIncrement : true,
        },
    })
};

module.exports = Model;