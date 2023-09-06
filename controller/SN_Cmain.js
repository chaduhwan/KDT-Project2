const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

exports.chat = (req, res) => {
  res.render("SN_chat");
};
