// 로그인 버튼 누르면 메인화면으로 가기

$("#joinCheck2").on("click", function () {
  location.href = "index.html";
});
let emailCheck = false;
let passwordCheck = false;
var regex =
  /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
$("#email").on("change", function () {
  let email = $("#email").val(); //email value값 받아오기
  if (regex.test(email) == false) {
    $(".errorEmail")
      .removeClass("correctPwCheck")
      .addClass("errorPwCheck")
      .html("이메일 형식이 올바르지 않습니다.");
    emailCheck = false;
  } else {
    $(".errorEmail")
      .removeClass("errorPwCheck")
      .addClass("correctPwCheck")
      .html("이메일을 옳게 입력하셨습니다.");
    emailCheck = true;
  }
});
$("#pw").on("change", function () {
  let password = $("#pw").val();
  if (password.length < 6) {
    $(".errorPassword")
      .removeClass("correctPwCheck")
      .addClass("errorPwCheck")
      .html("6자 이상 입력해주세요");
    passwordCheck = false;
  } else {
    $(".errorPassword")
      .removeClass("errorPwCheck")
      .addClass("correctPwCheck")
      .html("6자 이상입니다.");
    passwordCheck = true;
  }
});

$("input").change(function () {
  if (emailCheck == true && passwordCheck == true) {
    $("#loginBtn").attr("disabled", false);
  } else {
    $("#loginBtn").attr("disabled", true);
  }
});
