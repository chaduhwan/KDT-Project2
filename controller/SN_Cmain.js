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
    for (const check of chatMessage) {
      //username이랑 send의 값이 다르면 checked 값을 Y로 바꾸기
      if (check.send != req.body.username) {
        console.log("수정되었습니다.!!!!");
        console.log("chatNum값", check.chatNum);
        Chat.update({ checked: "Y" }, { where: { chatNum: check.chatNum } });
      }
    }
    res.send({ chatMessage });
  } catch (error) {
    console.log("에러==============", error);
  }
};

//내가 들어가 있는 방의 배열을 출력함
exports.myChatList = async (req, res) => {
  let myJoinRoom = [];
  let notReadMessage = [];
  let myChatList = await participant.findAll({
    where: { member_list: req.body.username },
  });

  for (const resItem of myChatList) {
    //N값
    let numN = 0;
    //내 방 번호
    let myRoomNumber = resItem.roomNum;
    console.log("방 번호 리스트", myRoomNumber);
    //이 방 번호로 그 방 채팅의 N값을 가져옴
    let checkList = await Chat.findAll({
      where: { roomNum: myRoomNumber },
    });
    // 방 번호로 내 이름이랑 다른 N값을 가져옴
    for (const checkItem of checkList) {
      //내 이름이 아니면서 check된 값이 N인 경우 n에다 1더해줌
      if (checkItem.send != req.body.username && checkItem.checked == "N") {
        numN += 1;
      }
    }
    notReadMessage.push(numN);
    console.log("분류한 번호값", numN);
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
    console.log("읽지않은 메시지", notReadMessage);
    res.send({ myJoinRoom: myJoinRoom, notReadMessage: notReadMessage });
  }
};

exports.myMessage = async (req, res) => {
  try {
    let preMessage = await Chat.findOne({
      where: { send: req.body.send },
      order: [["createdAt", "DESC"]],
    });
    console.log("체크된 값 가져오는거", req.body.send);
    res.send({
      message: preMessage.message,
      send: preMessage.send,
      row: preMessage,
    });
  } catch (error) {
    //만약에 상대방과 대화를 했는데 나만 대화를 걸고 상대방이 대화를 하지 않았을때
    //PreMessage는 빈값이 오기 때문에 오류 처리를 해줫음
    res.send({ message: "아무것도없어요", send: req.body.send });
  }
};

exports.userList = async (req, res) => {
  let findUser = [];
  try {
    console.log(req.body.myName);
    let findUserList = await User.findAll();
    for (const list of findUserList) {
      if (req.body.myName != list.name) findUser.push(list.name);
    }
    res.send(findUser);
  } catch (error) {
    console.log(error);
  }
};
