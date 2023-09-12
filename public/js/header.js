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
  window.alert("로그아웃되었습니다.");
  location.href = "/login";
}
