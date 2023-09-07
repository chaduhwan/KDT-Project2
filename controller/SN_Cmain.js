const { User, Sequelize, Chat, participant } = require("../models");
const Op = Sequelize.Op;

exports.chat = (req, res) => {
  res.render("SN_chat");
};

exports.preMessage = async (req, res) => {
  try {
    let chatMessage = await Chat.findAll({
      where: { roomNum: req.body.roomNum },
    });
    res.send({ chatMessage });
  } catch (error) {
    console.log("에러==============", error);
  }
};

//내가 들어가 있는 방의 배열을 출력함
exports.myChatList = async (req, res) => {
  let myJoinRoom = [];

  let myChatList = await participant.findAll({
    where: { member_list: req.body.username },
  });

  for (const resItem of myChatList) {
    let myRoomNumber = resItem.roomNum;
    let findName = await participant.findAll({
      where: { roomNum: myRoomNumber },
    });

    for (const resItem2 of findName) {
      if (resItem2.member_list !== req.body.username) {
        myJoinRoom.push(resItem2.member_list);
      }
    }
  }

  if (myChatList.length === myJoinRoom.length) {
    console.log("보낸 값", myJoinRoom);
    res.send(myJoinRoom);
  }
};

exports.myMessage = async (req, res) => {
  let preMessage = await Chat.findOne({
    where: { send: req.body.send },
    order: [["createdAt", "DESC"]],
  });
  console.log("premessage", preMessage.message);
  res.send({ message: preMessage.message, send: preMessage.send });
};
