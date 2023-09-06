const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

//내 이름 저장
let myID;
//내 이메일 값
let userEmail;

exports.connection = (io, socket) => {
  console.log("접속했습니다.~");
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

  /////////////////////////////////////

  //로그인이 성공하면 받는 이메일
  socket.on("loginSuccess", async (e) => {
    //id에서 이메일 값 찾아서 저장하는거
    userEmail = await idExtract(e);
    console.log("!!!!!!!!111111");
    socket?.join(userEmail);
  });
  console.log("!!!!!!!!!!!!!!222222");
  //접속할 때마다 계속 내 이메일로 된 방으로 들어감
  console.log("접속한 내 방 이름 : ", userEmail);
};

//////////connection 끝////////////
