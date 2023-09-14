const { DataTypes } = require('sequelize');

const Memo = (sequelize) => {
  const Memo = sequelize.define('memo', {
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
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  });
  return Memo;
};

module.exports = Memo;
