function profileImg() {
  console.log("이미지넣어줘");
  const img = localStorage.getItem("profileImgPath");

  const profile = document.querySelector("#profile_img");
  console.log(profile, img);
  profile.innerHTML = `<img src='${img}' style="width: 200px;">`;
}

profileImg();
