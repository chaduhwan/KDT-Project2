const {DataTypes} = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('subject',{
        SubjectId : {
            type : DataTypes.INTEGER,
            allowNull : false, // not null
            primaryKey : true,
            autoIncrement : true,
        },
        subjectTitle: {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
    })
};

module.exports = Model;