const { DataTypes } = require('sequelize');

const Position = (sequelize) => {
  const Position = sequelize.define('position', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    who: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    top: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    left: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });
  return Position;
};

module.exports = Position;
