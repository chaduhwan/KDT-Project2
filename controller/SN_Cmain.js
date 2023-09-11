const { User, Sequelize, Chat, participant, calendar } = require("../models");
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
    res.send({ myJoinRoom: myJoinRoom, notReadMessage: notReadMessage });
  }
};

exports.myMessage = async (req, res) => {
  try {
    let preMessage = await Chat.findOne({
      where: { send: req.body.send },
      order: [["createdAt", "DESC"]],
    });
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
exports.calendar = (req, res) => {
  res.render("SN_calendar");
};
exports.post_calendar = async (req, res) => {
  await calendar.destroy({
    where: { username: req.session.userName },
  });
  await req.body.forEach((res) => {
    calendar.create({
      username: req.session.userName,
      title: res.title,
      start: res.start,
      end: res.end,
      backgroundColor: res.backgroundColor,
    });
  });
};
exports.eventData = async (req, res) => {
  const modelData = await calendar.findAll({
    where: { username: req.session.userName },
  });
  res.send(modelData);
};
exports.practice = (req, res) => {
  console.log("온 값은?????????", req.files[0]);
  res.send(req.files[0].location);
};

//내 프로필 사진 불러오기
exports.myprofile = async(req,res)=>{
  const mypicture = await User.findOne({
    where : {name : req.body.username}
  })
  //내 사진 경로 보내주기
  if(mypicture.profileImgPath == null){
    //사진 없을 때 디폴트 사진으로 들어가게
    mypicture.profileImgPath = "public\\default\\logo.png";
  }
  res.send({picName : mypicture.profileImgPath});
}
//상대방 프로필 사진 불러오기
exports.otherprofile = async (req,res)=>{
  const otherpicture = await User.findOne({
    where : {name : req.body.otherRoom}
  })
  if(otherpicture.profileImgPath == null){
    //사진 없을 때 디폴트 사진으로 들어가게
    otherpicture.profileImgPath = "public\\default\\logo.png";
  }
  res.send({otherpicName : otherpicture.profileImgPath})
}