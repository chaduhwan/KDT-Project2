//소켓 설정
const socket = io();
//프로필 수정 함수
async function registerEdit(id) {
  let email = $("#email"); // 이메일
  let name = $("#name"); //이름
  let phone = $("#phone"); //핸드폰번호
  console.log(email.val(), name.val(), phone.val());
  const res = await axios({
    method: "PATCH",
    url: "/profile",
    data: {
      id: Number(id),
      email: email.val(),
      name: name.val(),
      phone: phone.val(),
    },
  });
  console.log("res", res.data);
  if (res.data.result) {
    alert("성공");
    // window.location.reload();
  }
}

//프로필 사진 업로드 함수
// function imgEdit2(fileupload) {
//   // event.preventDefault(); // 폼 제출 방지
//   const dynamicInput = document.getElementById("dynamic");

//   if (dynamicInput.style.display === "none") {
//     dynamicInput.style.display = "block"; // input 요소를 보이게 함
//     this.innerText = "사진 저장"; // 버튼 텍스트 변경
//   } else {
//     fileupload();
//     dynamicInput.style.display = "none"; // input 요소를 숨김
//     this.innerText = "사진 수정"; // 버튼 텍스트 변경
//   }
// }

async function fileupload() {
  event.preventDefault();
  console.log("사진등록");
  const imgBox = $(".profile_img_div");
  const file = document.querySelector("#dynamic");
  // const file = $('#dynamic');
  console.log(file);
  // console.log(file[0].files);

  const formData = new FormData();
  formData.append("dynamic", file.files[0]);
  try {
    const res = await axios({
      method: "POST",
      url: "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("res", res.data.path);
    imgBox.empty();
    imgBox.append(
      `<img src=${res.data.path} style="width: 200px; height: 200px; border-radius: 50%;">`
    );
  } catch (error) {
    console.log(error);
  }
}
//탈퇴 함수
async function deleteUser(id) {
  const res = await axios({
    method: "POST",
    url: "profile/delete",
    data: {
      id: Number(id),
    },
  });
  console.log("탈퇴중");
  if (res.data.result) {
    alert("성공");
    window.location.href = "/";
  } else {
    alert("실패");
  }
}

//로그아웃 함수
async function logout() {
  axios({
    method: "POST",
    url: "/header/logout",
  });
  window.alert("로그아웃되었습니다.");
  location.href = "/login";
}

//클래스만들기 함수
async function makeClass() {
  const form = document.forms["ClassMake"];
  const data = {
    className: form.className.value,
    leader: "<%= data.name %>",
  };
  const res = await axios({
    method: "POST",
    url: "/class/make",
    data: data,
  });
  if (res.data.res) {
    alert(
      `클래스 생성완료! 클래스 공유 코드입니다 외부유출에 조심하세요 : ${res.data.token}`
    );
  }
  window.location.reload();
}
//클래스 들어가기 함수
async function signinClass() {
  const form = document.forms["ClassSignin"];
  const data = {
    token: form.token.value,
  };
  const res = await axios({
    method: "POST",
    url: "/class/signin",
    data: data,
  });
  if (res) {
    alert("가입성공!");
    window.location.reload();
  } else {
    alert("가입실패!");
  }
}

async function enterClass(element) {
  const classid = element.getAttribute("data-class-id");
  try {
    const result = await axios({
      method: "GET",
      url: "/enter/board",
      params: {
        classId: classid,
      },
    });
    // AJAX 요청이 완료된 후에 이동하도록 처리
    if (result.status === 200) {
      document.location.href = "/board";
    } else {
      console.error("요청이 실패했습니다.");
    }
  } catch (error) {
    console.error("오류 발생: ", error);
  }
}
