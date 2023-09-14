function profileImg() {
  console.log("이미지넣어줘");
  const img = localStorage.getItem("profileImgPath");

  const profile = document.querySelector("#profile_img");
  console.log(profile, img);
  profile.innerHTML = `<img src='${img}' style="width: 200px;">`;
}

profileImg();

$(".my_page").click(() => {
  location.href = "/profile";
});

$(".planner").click(() => {
  location.href = "/calendar";
});

async function logout() {
  axios({
    method: "POST",
    url: "/header/logout",
  });
  socket.emit("logout");
  window.alert("로그아웃되었습니다.");
  location.href = "/login";
}
