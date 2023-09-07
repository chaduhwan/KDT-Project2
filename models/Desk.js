const { DataTypes } = require('sequelize');

const Desk = (sequelize) => {
  const Desk = sequelize.define('desk', {
    name: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Desk;
};

module.exports = Desk;
