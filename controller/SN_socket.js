const { User, Sequelize, room, participant, Chat } = require("../models");
const Op = Sequelize.Op;

//접속한 사람들
let roomList = [];
let checkToken;
exports.connection = (io, socket) => {
  console.log("현재 접속해 있는 사람", roomList);

  //세션에 있는 내 아이디값 저장
  let userName = socket.request.session.userName;

  //바로바로 내 방에 넣어주는거
  // if(userName != undefined){
  //   let coin = 0;
  //   roomList.forEach(res=>{
  //     if(res == userName){
  //       coin +=1
  //     }
  //   })
  //   if(coin==0){
  //     roomList.push(userName);
  //     console.log("방에 들어갔음", userName, roomList);
  //   }
  // }

  //접속자 체크해서 모달 갱신하는거
  io.emit("accessCheck", roomList, userName);
  //현재 접속자 계속 갱신하는거
  io.emit("getAccess", roomList);
  //진짜 입장하는 방 번호
  let realNumber;

  //접속할 때마다 계속 내 이름으로 된 방으로 들어감(알람 날리려고)
  socket?.join(userName);

  //접속하면 내 채팅방 목록 불러와주는거(나중에 채팅방 눌렀을 때 이벤트로 바꾸기)
  socket.emit("chatList", userName, roomList);

  //잠깐 이름보내는거(나중에 지울거임 ㅎ)
  socket.emit("sendName", userName);
  ////////////////변수명////////////////

  ////////////////////////////////////////

  ///////////////함수//////////////////

  //myID에서 이메일 값 추출하는 함수
  async function idExtract(id) {
    const email = await User.findOne({
      where: { id: id },
    });
    return email.email;
  }
  //myID에서 이름값 추출 함수
  async function nameExtract(id) {
    const name = await User.findOne({
      where: { id: id },
    });
    return name.name;
  }

  /////////////////////////////////////

  //로그인이 성공하면 받는 이름
  socket.on("loginSuccess", async (e) => {
    checkToken += 1;
    //id에서 이름 값 찾아서 저장하는거
    userName = await nameExtract(e);
    roomList.push(userName);
    socket?.join(userName);
  });

  //방 생성하는 create문, roomName : 상대방이름, username 내이름
  socket.on("create", async (roomName, username) => {
    //findall해서 내가 입장하려는 방이랑 내 닉네임으로 만들어진 곳이 있는지 찾아보기
    const userFind1 = await room.findAll({
      where: {
        [Op.and]: [{ Name1: roomName }, { Name2: username }],
      },
    });
    const userFind2 = await room.findAll({
      where: {
        [Op.and]: [{ Name1: username }, { Name2: roomName }],
      },
    });
    //roomNumber 꺼내기
    if (userFind1.length > 0) {
      userFind1.forEach((res) => {
        realNumber = res.roomNum;
      });
    }
    if (userFind2.length > 0) {
      userFind2.forEach((res) => {
        realNumber = res.roomNum;
      });
    }
    //만약에 방이 없으면 만들어줌
    if (userFind1.length === 0 && userFind2.length === 0) {
      console.log("방 만들어주는곳~~================");
      const createRoom = await room.create({
        Name1: username,
        Name2: roomName,
      });

      //멤버 리스트에 나(username), 상대(roomName) 추가하기
      const participant1 = await participant.create({
        roomNum: createRoom.roomNum,
        member_list: username,
      });
      const participant2 = await participant.create({
        roomNum: createRoom.roomNum,
        member_list: roomName,
      });
      realNumber = createRoom.roomNum;
      socket.join(realNumber);
    } else {
      //만약에 방이 있으면 그냥 채팅만 불러오기
      console.log("============방있으면 오는곳=================");
      //내가 들어간 방 리스트에 들어가려는 방이 있으면 join은 안함
      if (roomList.join("").includes(realNumber)) {
        console.log("이미있음");
        socket.emit("reload");
        socket.join(realNumber);
      } else {
        //리스트에 없으면 방에 join 시켜줌
        console.log("들어가는 방 번호", realNumber);
        socket.join(realNumber);
      }
      //방 번호 프론트로 보내기
      socket.emit("roomNumber", realNumber);
    }
    //socket.room에 방 이름 저장시키기
    socket.room = realNumber;
    console.log("소켓 방 번호 ", socket.room);
    //값을 제대로 불러오면 상대방 이름 적용시키는거
    socket.emit("true");
  });
  /////////create 끝///////////////

  //메시지 보내기
  socket.on("sendMessage", async (message, userid, otherName) => {
    console.log("메시지 보냈을 때 입장하는 방 : ", realNumber);
    console.log("보내는 놈이름 : ", userid);
    io.to(realNumber).emit("newMessage", message, userid);
    //받은메세지, 보낸사람 이름 저장하기
    await Chat.create({
      roomNum: realNumber,
      message: message,
      send: userid,
    });
  });
  //타이핑중
  socket.on("typing", (username, msgValue) => {
    socket.broadcast.to(socket.room).emit("type", username, msgValue);
  });

  //접속 끊겼을 때, 세션이 없어지면 접속이 끊긴 것으로 간주한다.
  // socket.on("disconnect",()=>{
  //   console.log("접속이 끊겼습니닷..!!!")
  //   io.emit("addList", userName);
  //   io.emit("deleteList", userName);
  //   for(let i =0; i< roomList.length; i++){
  //     if(roomList[i] === userName){
  //       roomList.splice(i,1);
  //       i--;
  //     }
  //   }
  // })
};
//////////connection 끝////////////
