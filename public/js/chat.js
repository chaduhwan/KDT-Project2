function picadd() {
  let fileUpload = document.querySelector("#fildUpload");
  let newFormData = new FormData();
  newFormData.append("11", fileUpload.files[0]);
  console.log("폼데이터전송", fileUpload.files[0]);
  console.log("폼데이터전송", newFormData);
  //req.files로 받는다.
  axios({
    method: "POST",
    url: "/practice",
    data: newFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    console.log(res.data);
  });
}
//소켓 설정
const socket = io();
//////////변수이름///////////////

//현재 접속한 유저 이름
let username;

//메시지를 보내는 상대방 이름
let otherName;

//타이핑 타이머
let timer;

//나한테 지금 만들어진 채팅방이름
let myRoomList = [];
//사진1번, 2번 (이건 나중에 프로필사진 추가하면 삭제하기)
let mypic; //내사진
// let otherpic="public/uploads/logo.png"; //상대방사진
// let otherpic = "https://t1.daumcdn.net/cfile/tistory/27738433597DCB1312";
let otherpic;
// const pic3 ="https://i.namu.wiki/i/sYSJY7DwDYvqCrRvxzAgqpbm7EQzxE6jKPBhRBJGLwRzWvA-uj3YEQjgAVfR1snu3tian_0NYAtv2b06664WkA.webp";
let pic3;
////////////////////////////////

////////////함수////////////////
//날짜 구하기 위한 함수
let now = new Date();
let hour = now.getHours();
let minute = now.getMinutes();
let sendTime = `${hour.toString().padStart(2, "0")}:${minute
  .toString()
  .padStart(2, "0")}`;

// 상대방이 출력하는 메시지 함수
function createLeftMessage(imageSrc, messageText, timestamp) {
  const listItem = document.createElement("li");
  listItem.classList.add("msg-left");

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("msg-left-sub");

  const image = document.createElement("img");
  image.src = imageSrc;

  const message = document.createElement("div");
  message.classList.add("msg-desc");
  message.textContent = messageText;

  const time = document.createElement("small");
  time.textContent = timestamp;

  messageContainer.appendChild(image);
  messageContainer.appendChild(message);
  messageContainer.appendChild(time);

  listItem.appendChild(messageContainer);

  return listItem;
}

// 내가 출력하는 메시지 함수
function createRightMessage(msgText, imgUrl, timestamp) {
  const listItem = document.createElement("li");
  listItem.classList.add("msg-right");

  const msgLeftSub = document.createElement("div");
  msgLeftSub.classList.add("msg-left-sub");

  const imgElement = document.createElement("img");
  imgElement.src = imgUrl;

  const msgDesc = document.createElement("div");
  msgDesc.classList.add("msg-desc");
  msgDesc.textContent = msgText;

  const smallElement = document.createElement("small");
  smallElement.textContent = timestamp;

  msgLeftSub.appendChild(imgElement);
  msgLeftSub.appendChild(msgDesc);
  msgLeftSub.appendChild(smallElement);

  listItem.appendChild(msgLeftSub);

  return listItem;
}
//미리보기 메시지 출력하는 함수
function createMessageElement(
  time,
  otherPersonName,
  previewMessage,
  imageUrl,
  notRead
) {
  const imgDiv = document.createElement("div");
  imgDiv.className = "img";

  const addonDiv = document.createElement("div");
  addonDiv.className = "addon";

  const imgIcon = document.createElement("i");
  imgIcon.className = "fa fa-circle";
  imgIcon.id = otherPersonName;

  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;

  const descDiv = document.createElement("div");
  descDiv.className = "desc";

  descDiv.addEventListener("click", function () {
    //그 방으로 들어가게 함
    otherName = otherPersonName;
    OtherPerson1.innerText = otherName;
    alert(`${otherName}님 방에 입장하였습니다.`);
    //create -> 방 만들기
    socket.emit("create", otherName, username);
    const pTag = document.querySelector(`#${otherName}msg`);
    if (pTag) {
      pTag.remove();
    }
  });
  //알람의 수(notRead)의 개수가 0이 아니면 p태그까지 출력
  if (notRead != 0) {
    const previewMessageElement = document.createElement("small");
    previewMessageElement.textContent = previewMessage;

    const notReadMsg = document.createElement("p");
    notReadMsg.textContent = notRead;
    notReadMsg.id = otherPersonName + "msg";

    ///desc div 안에 있는 small, h5, small
    const timeElement = document.createElement("small");
    timeElement.className = "time";
    timeElement.textContent = time;

    const otherPersonElement = document.createElement("h5");
    otherPersonElement.id = "OtherPerson2";
    otherPersonElement.textContent = otherPersonName;

    ///
    addonDiv.appendChild(previewMessageElement);
    addonDiv.appendChild(notReadMsg);

    imgDiv.appendChild(imgIcon);
    imgDiv.appendChild(imgElement);

    descDiv.appendChild(timeElement);
    descDiv.appendChild(otherPersonElement);
    descDiv.appendChild(addonDiv);

    chatContainer.appendChild(imgDiv);
    chatContainer.appendChild(descDiv);
    return chatContainer;
    //알람의 개수가 0개면 p태그는 appendChild 하지 않음
  } else {
    const previewMessageElement = document.createElement("small");
    previewMessageElement.textContent = previewMessage;

    const notReadMsg = document.createElement("p");

    ///desc div 안에 있는 small, h5, small
    const timeElement = document.createElement("small");
    timeElement.className = "time";
    timeElement.textContent = time;

    const otherPersonElement = document.createElement("h5");
    otherPersonElement.id = "OtherPerson2";
    otherPersonElement.textContent = otherPersonName;

    ///
    addonDiv.appendChild(previewMessageElement);

    imgDiv.appendChild(imgIcon);
    imgDiv.appendChild(imgElement);

    descDiv.appendChild(timeElement);
    descDiv.appendChild(otherPersonElement);
    descDiv.appendChild(addonDiv);

    chatContainer.appendChild(imgDiv);
    chatContainer.appendChild(descDiv);
    return chatContainer;
  }
}

//스크롤 다운 함수
function scrollBottom() {
  messageList.scrollTo(0, messageList.scrollHeight);
}

socket.on("accessCheck", (roomList, username) => {
  modalBody.textContent = "";
  roomList.forEach((res) => {
    addVisitor(res);
  });
});

// 새로운 접속자를 추가하는 함수
function addVisitor(visitorName) {
  var visitorElement = document.createElement("div");
  visitorElement.textContent = visitorName;
  visitorElement.id = visitorName;
  visitorElement.addEventListener("click", function () {
    //이름을 눌렀을 때 모달이 닫히게 하는 이벤트
    $("#staticBackdrop").modal("hide");

    //그 방으로 들어가게 함
    otherName = visitorName;
    if (username == otherName) {
      alert("자신의 이름은 선택할 수 없습니다.");
    } else {
      OtherPerson1.innerText = otherName;
      alert(`${otherName}님 방에 입장하였습니다.`);

      //create -> 방 만들기
      socket.emit("create", otherName, username);
      //그 방에 입장하면 p태그 삭제시켜버림(알람삭제)
      const pTag = document.querySelector(`#${otherName}msg`);
      pTag.remove();
    }
  });
  modalBody.appendChild(visitorElement);
}

//createdAt에서 시:분 으로 추출하는 함수
function formatTime(row) {
  const createdAtValue = row.createdAt;
  const createdDate = new Date(createdAtValue);
  const hours = createdDate.getHours();
  const minutes = createdDate.getMinutes();
  //시:분이 앞에 한자리 수 일때 바꿔주는거
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
}
////////////////////////////////
//이름받기(지울거임ㅎ)
socket.on("sendName", (name) => {
  username = name;
});
//상대채팅생성하는 ul태그
const chatMessageList = document.getElementById("chat-messages");
const messageList = document.querySelector(".message");
//방 입력하는 form태그
const roomForm = document.querySelector("#room");
//방 번호 적는 form
const searchName = document.querySelector("#search");
//메시지 form태그
const messageForm = document.querySelector("#chat");
//채팅 리스트 지우는거
const clear = document.getElementById("chat-messages");
//채팅방 리스트
const chatContainer = document.querySelector(".chatList");
//모달에 나오는 유저 리스트
var modalBody = document.querySelector(".modal-body");

//채팅방 제일 위에 뜨는 이름
const OtherPerson1 = document.querySelector("#OtherPerson1");
const OtherPerson2 = document.querySelector("#OtherPerson2");
// 현재 접속자 (모달화면) 갱신하는 거

//현재 접속자 계속 찾아서 새로 생기면 불 바꾸기
//현재 접속자와 내 채팅방에 있는 사람이 같으면 초록불로 바꿔주기
socket.on("getAccess", (roomList) => {
  roomList.forEach((room) => {
    myRoomList.forEach((myRoom) => {
      if (room == myRoom) {
        document.querySelector(`#${myRoom}`).style.color = "green";
      }
    });
  });
});

// 나가면 회색으로 변하는 이벤트
socket.on("deleteList", (username) => {
  document.querySelector(`#${username}`).style.color = "gray";
});
//내가 채팅하고 잇는 방 불러오고 -> 그 채팅방 미리보기 메시지까지 가져오는거
socket.on("chatList", async (username, roomList) => {
  document.querySelector(".chatList").innerHTML = "";
  myRoomList = [];
  //참여 채팅방 불러오기
  const listResult = await axios({
    method: "POST",
    url: "/myChatList",
    data: {
      username: username,
    },
    //방 불러올 때 내가 읽지 않은 채팅의 수를 가져옴
    //각 방의 메세지 하나씩 불러오기
  });
  let i = 0;
  console.log("내 방 목록>>>", listResult.data.myJoinRoom);
  for (const myMessage of listResult.data.myJoinRoom) {
    const messageResult = await axios({
      method: "POST",
      url: "/myMessage",
      data: {
        send: myMessage,
      },
    });
    const otherProfilePicture = await axios({
      method: "POST",
      url: "/myprofile",
      data: {
        username: myMessage,
      },
    });
    pic3 = `${otherProfilePicture.data.picName}`;
    const preViewMessage = await createMessageElement(
      formatTime(messageResult.data.row),
      messageResult.data.send,
      messageResult.data.message,
      pic3,
      listResult.data.notReadMessage[i]
    );
    //나랑 채팅방 만들어진 사람 배열에 저장해놓기
    myRoomList.push(messageResult.data.send);
    await preViewMessage;
    //element만들고 접속자 icon 색상 바꾸기
    for await (const currentList of roomList) {
      let changeElement = document.querySelector(`#${messageResult.data.send}`);
      if (currentList == messageResult.data.send) {
        changeElement.style.color = "green";
        break;
      } else {
        changeElement.style.color = "gray";
      }
    }
    i++;
  }
});
//방 번호 정해서 들어가기
roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  //상대방 방 번호(이름)
  otherName = searchName.value;
  //방 들어가면 현재 가입되어 있는 사람들의 정보를 가져옴
  const nowUserList = await axios({
    method: "POST",
    url: "/userList",
    data: {
      myName: username,
    },
  });
  //유저 리스트에 있는 사람들만 방에 초대할 수 있음
  if (otherName == username) {
    alert("다른 이름을 입력해주세요.");
  } else if (nowUserList.data.indexOf(otherName) != -1) {
    //리스트 검사해서 그 사람이 있으면 방 만들어줌
    // create -> 방 만들기
    socket.emit("create", otherName, username);
    socket.on("true", () => {
      //원래 헤더만 바꿔야 되는데 일단은 이것만 바꾸고 나중에 수정하기
      OtherPerson1.innerText = otherName;
      // OtherPerson2.innerText = otherName;
    });
    alert(`${otherName}님 방에 입장하였습니다.`);
    //방 들어가면 p태그 삭제시켜버려서 알람 없애기
    const pTag = document.querySelector(`#${otherName}msg`);
    pTag.remove();
  } else {
    //없으면 가입되지 않은 사람이라고 해줌
    alert("가입되지 않은 사용자 입니다.");
  }
});

//메시지 보내는 이벤트
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //메시지 input
  const message = document.querySelector("#message");
  socket.emit("sendMessage", message.value, username, otherName);
  scrollBottom();
  message.value = "";
});

//보낸 메시지 받는 이벤트
socket.on("newMessage", (message, userid) => {
  if (userid == username) {
    const newChatMessage = createRightMessage(message, mypic, sendTime);
    chatMessageList.appendChild(newChatMessage);
  } else {
    const newChatMessage = createLeftMessage(otherpic, message, sendTime);
    chatMessageList.appendChild(newChatMessage);
  }
  //메시지 받으면 입력중입니다. 문구 안 보이게 바로 삭제
  $("#messageStatus")[0].style.display = "none";
  scrollBottom();
});

//이전 채팅 내용 가져오기(roomNumber => 현재 입장한 방 번호(UUID))
socket.on("roomNumber", (data) => {
  axios({
    method: "POST",
    url: "/preMessage",
    data: {
      roomNum: data,
      username: username,
    },
  }).then((res) => {
    clear.innerHTML = "";
    const postMessage = res.data.chatMessage;
    postMessage.forEach(async (row) => {
      //내가 보낸 메시지는 오른쪽에 출력
      if (row.send == username) {
        const newChatMessage = createRightMessage(
          row.message,
          mypic,
          formatTime(row)
        );
        chatMessageList.appendChild(newChatMessage);
      } else {
        //다른 사람이 보낸 메시지는 왼쪽에 출력
        const newChatMessage = createLeftMessage(
          otherpic,
          row.message,
          formatTime(row)
        );
        chatMessageList.appendChild(newChatMessage);
      }
    });
  });
});
///이전채팅내용 끝부분//////
//상대방 프로필 사진 불러오기
socket.on("otherprofile", async (otherRoom) => {
  console.log("??!!!!!!!!!!!!!!!!!!!!", otherRoom);
  let otherprofile = await axios({
    method: "POST",
    url: "/otherprofile",
    data: { otherRoom },
  });
  console.log("이건뭐죠", otherprofile.data.otherpicName);
  otherpic = `${otherprofile.data.otherpicName}`;
  console.log("다른사람 사진", otherpic);
});

//내 프로필 사진 불러오기
socket.on("myprofile", async (username) => {
  let myProfile = await axios({
    method: "POST",
    url: "/myprofile",
    data: { username },
  });
  mypic = `${myProfile.data.picName}`;
  console.log("내사진", mypic);
});
//타이핑중..
$("#message").on("input", function () {
  const msgValue = $("#message").val();
  socket.emit("typing", username, msgValue);
});
socket.on("type", (chatName, msgValue) => {
  //타임아웃 제거해주는 함수
  clearTimeout(timer);
  $("#messageStatus")[0].style.display = "block";
  timer = setTimeout(() => {
    $("#messageStatus")[0].style.display = "none";
  }, 500);
});
