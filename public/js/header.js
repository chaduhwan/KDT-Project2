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
  console.log("로그아웃");
  location.href = "/login";
}
