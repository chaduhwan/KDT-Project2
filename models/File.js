const { DataTypes } = require('sequelize');

const File = (sequelize) => {
  const File = sequelize.define('file', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      llowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    isFolder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    parent: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  });
  return File;
};

module.exports = File;
