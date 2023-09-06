const { User, Sequelize, Chat } = require("../models");
const Op = Sequelize.Op;

exports.chat = (req, res) => {
  res.render("SN_chat");
};

exports.preMessage = async(req,res)=>{
  try {
    let chatMessage = await Chat.findAll({
      where : {roomNum : req.body.roomNum},
    });
    res.send({chatMessage});
  } catch (error) {
    console.log("에러==============", error)
  }

}