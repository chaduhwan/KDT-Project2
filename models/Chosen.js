const { DataTypes } = require('sequelize');

const Chosen = (sequelize) => {
  const Chosen = sequelize.define('chosen', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    which: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    //   chosen:
  });
  return Chosen;
};

module.exports = Chosen;
