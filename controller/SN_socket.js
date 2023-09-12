const { User, Sequelize, room, participant, Chat } = require("../models");
const Op = Sequelize.Op;

//접속한 사람들
let roomList = [];

//배열추가
let participantRoom = [];
let map = new Map();
exports.connection = (io, socket) => {
  console.log("현재 접속해 있는 사람", roomList);

  //세션에 있는 내 아이디값 저장
  let userName = socket.request.session.userName;

  //접속자 체크해서 모달 갱신하는거
  io.emit("accessCheck", roomList, userName);
  //현재 접속자 계속 갱신하는거
  io.emit("getAccess", roomList);
  //진짜 입장하는 방 번호
  let realNumber;

  //내방으로 접속
  socket.join(userName);

  //접속하면 내 채팅방 목록 불러와주는거(나중에 채팅방 눌렀을 때 이벤트로 바꾸기)
  socket.emit("chatList", userName, roomList);

  //잠깐 이름보내는거(나중에 지울거임 ㅎ)
  socket.emit("sendName", userName);

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
    //id에서 이름 값 찾아서 저장하는거
    userName = await nameExtract(e);
    roomList.push(userName);

  });

  //방 생성하는 create문, roomName : 상대방이름, username 내이름
  socket.on("create", async (roomName, username) => {
    console.log("현재 방은? 시작부분", realNumber);
    if(realNumber != undefined){
    //연결이 끊어지면 그 방에서 나감
    socket.leave(realNumber);
    //방에서 나가면 map에서 realNumber 키의 value값에 해당하는 내 이름(username)을 빼줌
    //그래야지 위에 메시지를 보낼 때 checked 값이 'N'으로 감
    if(map.get(realNumber)){
      const index = map.get(realNumber).indexOf(userName);
      if(index !== -1){
        map.get(realNumber).splice(index, 1);
      }
    }
    console.log("나갔을 때 ", map);
    }
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
      console.log("현재 방은?", realNumber);
      socket.join(realNumber);
      socket.emit("chatList",username, roomList)  //방 만들어지면 왼쪽section 초기화
    } else {
      //만약에 방이 있으면 그냥 채팅만 불러오기
      console.log("============방있으면 오는곳=================");
      //내가 들어간 방 리스트에 들어가려는 방이 있으면 join은 안함
      if (roomList.join("").includes(realNumber)) {
        socket.join(realNumber);
        socket.emit("chatList",username, roomList)  //방 만들어지면 왼쪽section 초기화
      } else {
        //리스트에 없으면 방에 join 시켜줌
        socket.join(realNumber);
        socket.emit("chatList",username, roomList)  //방 만들어지면 왼쪽section 초기화
      }
      //상대방 프로필 사진 불러오기
      socket.emit("otherprofile", roomName);
      //내 프로필 사진 불러오기(내이름, 상대방이름);
      socket.emit("myprofile", username);
      //방 번호 프론트로 보내서 이전채팅 불러오기
      socket.emit("roomNumber", realNumber);

      //방이 없으면? -> 새로 만들어서 넣어줌
      if (!(map.has(realNumber))) {
        participantRoom.push(username);
        map.set(realNumber, participantRoom);
        participantRoom = [];
        console.log("participantRoom", participantRoom);
        console.log("방이 없을 때 ", map);
      } else {
        // 방이 이미 있으면 새 배열을 만들어 할당
        const existingRoom = map.get(realNumber);
        const newRoom = existingRoom.concat(username); // 또는 [...existingRoom, username]
        map.set(realNumber, newRoom);
        console.log("participantRoom", participantRoom);
        console.log("방이 있을 때 ", map);
      }
    }
    console.log("현재 방은(끝부분)?", realNumber);
    //socket.room에 방 이름 저장시키기
    socket.room = realNumber;                                                         
    //값을 제대로 불러오면 상대방 이름 적용시키는거
    socket.emit("true");
  });
  /////////create 끝///////////////

  //메시지 보내기
  socket.on("sendMessage", async (message, userid, otherName) => {
    //방에 메시지 전송 
    io.to(realNumber).emit("newMessage", message, userid);  
    //받은메세지, 보낸사람 이름 저장하기
    var checked = "N"
    if(map.get(realNumber) != undefined){
      checked = map.get(realNumber).includes(otherName) ? "Y" : "N" //해당 채팅방이랑 현재 참가자 배열
    }
    await Chat.create({
      roomNum: realNumber,
      message: message,
      send: userid,
      checked : checked
    });
    // 1:1 대화를 하고 있지 않을 때 알람이 가게 해주는거
    io.to(otherName).emit("chatList", otherName, roomList);
  });
  //타이핑중
  socket.on("typing", (username, msgValue) => {
    socket.broadcast.to(socket.room).emit("type", username, msgValue);
  });

  socket.on("disconnect", ()=>{
    //연결이 끊어지면 그 방에서 나감
    socket.leave(realNumber);
    //방에서 나가면 map에서 realNumber 키의 value값에 해당하는 내 이름(username)을 빼줌
    //그래야지 위에 메시지를 보낼 때 checked 값이 'N'으로 감
    if(map.get(realNumber)){
      const index = map.get(realNumber).indexOf(userName);
      if(index !== -1){
        map.get(realNumber).splice(index, 1);
      }
    }
    console.log("나갔을 때 ", map);
  })
};
//////////connection 끝////////////
