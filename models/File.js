const { DataTypes } = require('sequelize');

const File = (sequelize) => {
  const File = sequelize.define('file', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  });
  return File;
};

module.exports = File;
