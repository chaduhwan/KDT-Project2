const { DataTypes } = require("sequelize");

const Model = (sequelize) => {
  return sequelize.define("map", {
    mapId: {
      type: DataTypes.INTEGER,
      allowNull: false, // not null
      primaryKey: true,
      autoIncrement: true,
    },
    place: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
};

module.exports = Model;
