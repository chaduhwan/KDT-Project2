//회원가입
/*
1. 이메일 유효성검사 (틀리면 밑에 빨간색 맞으면 초록색)
2. 비밀번호 맞는지 확인, 틀리면 밑에 빨간색으로 뜸 맞으면 초록색
3. 보기 누르고 스크롤 다 내려야지 체크박스 클릭 가능
4. 이용약관, 개인정보, 만 14세 눌러야 회원가입 버튼 활성화
5. 
*/

$("input").on("focus", function () {
  $(this).css("border-bottom", "2px solid black");
});
$("input").on("blur", function () {
  $(this).css("border-bottom", "");
});

// 패스워드 확인
// let pwValue2 = $("#pw").val();
// console.log(pwValue2);
let pwValid = false; // 맞는 비밀번호
let emailValid = false; // 맞는 이메일
let checkValid = false; // 체크박스 다 체크

let pwValue; //비밀번호
let pwCheckValue; //비밀번호 확인
$("#pw").on("change", function () {
  pwValue = $("#pw").val();
  if (pwValue == pwCheckValue) {
    $(".error")
      .removeClass("errorPwCheck")
      .addClass("correctPwCheck")
      .html("비밀번호가 일치합니다.");
    pwValid = true;
  } else {
    $(".error")
      .removeClass("correctPwCheck")
      .addClass("errorPwCheck")
      .html("비밀번호가 일치하지 않습니다.");
    pwValid = false;
  }
});
$("#pwVal").on("change", function () {
  pwCheckValue = $("#pwVal").val();
  if (pwValue == pwCheckValue) {
    $(".error")
      .removeClass("errorPwCheck")
      .addClass("correctPwCheck")
      .html("비밀번호가 일치합니다.");
    pwValid = true;
  } else {
    $(".error")
      .removeClass("correctPwCheck")
      .addClass("errorPwCheck")
      .html("비밀번호가 일치하지 않습니다.");
    pwValid = false;
  }
});

//이메일 유효성검사 (숫자or영어)@(숫자or영어)

var regex =
  /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
$(".email").on("change", function () {
  let email = $(".email").val(); //email value값 받아오기
  if (regex.test(email) == false) {
    $(".errorEmail")
      .removeClass("correctPwCheck")
      .addClass("errorPwCheck")
      .html("이메일 형식이 올바르지 않습니다.");
    emailValid = false;
    console.log(emailValid);
  } else {
    $(".errorEmail")
      .removeClass("errorPwCheck")
      .addClass("correctPwCheck")
      .html("이메일을 옳게 입력하셨습니다.");
    emailValid = true;
    console.log(emailValid);
  }
});

// 스크롤을 내렸을 때 button 활성화
$("#modalBodyId1").on("scroll", function () {
  var height = $("#modalBodyId1").scrollTop();
  var max = $("#modalBodyId1").css("max-height");
  var maxValue = max.split("px"); //max-height 값(400px)을 px로 쪼갠다. max-height[0] = 400, max-height[1] = 공백
  var height3 = $("#modalBodyId1")[0].scrollHeight - Number(maxValue[0]);
  if (height >= height3) {
    $("#modalBodyId1Btn").attr("disabled", false); //버튼 비활성화 -> 활성화
  }
});

// 모달 바깥부분 눌렀을 때 취소되는거
const myModal1 = document.getElementById("agree1");
myModal1.addEventListener("show.bs.modal", () => {
  $("#modalBodyId1Btn").attr("disabled", true);
});

//2번이랑 3번 길어질 때 쓰면 됨
//2번
// const myModal2 = document.getElementById('agree2')
// myModal2.addEventListener('hide.bs.modal', () => {
//     $("#modalBodyId1Btn").attr("disabled", true);
// })

// 3번
// const myModal3 = document.getElementById('agree3')
// myModal3.addEventListener('hide.bs.modal', () => {
//     $("#modalBodyId1Btn").attr("disabled", true);
// })

//버튼 눌렀을 때 체크박스 활성화 되는거
$("#modalBodyId1Btn").on("click", function () {
  $("#agreeCheck1").attr("disabled", false); // 체크박스 비활성화 -> 활성화로 바꿈
  $("#agreeCheck1").attr("checked", true); // 체크박스 체크 활성화
});

//2번 확인버튼, 글자 길이 길어졋을 때 풀고 쓰면 됨
/*
$("#modalBodyId2").on("scroll", function(){
    var height = $("#modalBodyId2").scrollTop();
    var max =  $("#modalBodyId2").css("max-height")
    var maxValue = max.split('px')      //max-height 값(400px)을 px로 쪼갠다. max-height[0] = 400, max-height[1] = 공백
    var height3= $("#modalBodyId2")[0].scrollHeight - Number(maxValue[0]);

    if(height >= height3){
        $("#modalBodyId2Btn").attr("disabled", false);
        $("#agreeCheck2").attr("disabled", false);
        $("#agreeCheck2").attr("checked", true);
    }
})
*/

// 2번 확인버튼 누르면 체크
$("#modalBodyId2Btn").on("click", function () {
  $("#agreeCheck2").attr("disabled", false);
  $("#agreeCheck2").attr("checked", true);
});
//3번 확인버튼 누르면 체크
$("#modalBodyId3Btn").on("click", function () {
  $("#agreeCheck3").attr("disabled", false);
  $("#agreeCheck3").attr("checked", true);
});

//4번 체크되면 if문 돌아가는거
// $("#agreeCheck4").on("click", function(){
// })

// 체크박스 확인 if문
// ischecked 사용방법
$(".input-essential").change(function () {
  console.log($("#agreeCheck4").is(":checked"));
  if (
    $("#agreeCheck1").is(":checked") &&
    $("#agreeCheck2").is(":checked") &&
    $("#agreeCheck4").is(":checked")
  ) {
    checkValid = true;
    // $(".joinBtn").attr("disabled", false);
  } else {
    checkValid = false;
  }
});
// prop 사용방법

// $(".input-essential").change(function(){
//     if($("#agreeCheck1").prop("checked", true)
//     && $("#agreeCheck2").prop("checked", true)
//     && $("#agreeCheck4").prop("checked", true))
//     {
//         $(".joinBtn").attr("disabled", false);
//         checkValid = true;
//         //length로 개수 파악한다.
//         //input[name="agrees"].checked.length() >3
//     } else{
//         checkValid = false;
//     }
// })
$("input").change(function () {
  if (pwValid == true && emailValid == true && checkValid == true) {
    $(".joinBtn").attr("disabled", false);
  } else {
    $(".joinBtn").attr("disabled", true);
  }
});

// 회원가입 버튼 누르면 메인페이지로 가고 alert 창까지 나오기
// $("#joinCheck").on("click", function () {
//   location.href = "loginPage.html";
// });
