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
    res.send(myJoinRoom);
  }
};

exports.myMessage = async (req, res) => {
  try {
    let preMessage = await Chat.findOne({
      where: { send: req.body.send },
      order: [["createdAt", "DESC"]],
    });
    res.send({ message: preMessage.message, send: preMessage.send });
  } catch (error) { 
    //만약에 상대방과 대화를 했는데 나만 대화를 걸고 상대방이 대화를 하지 않았을때
    //PreMessage는 빈값이 오기 때문에 오류 처리를 해줫음
    res.send({message: "아무것도없어요", send : req.body.send})
  }

};
