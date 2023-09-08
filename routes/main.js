const express = require("express");
const router = express.Router();
const C_controller = require("../controller/CH_Cmain");
const M_controller = require("../controller/MA_Cmain");
const S_controller = require("../controller/SN_Cmain");
const T_controller = require("../controller/TH_Cmain");
const multer = require("multer");
const path = require("path");

///////Board page
router.get("/board", C_controller.BoardMain);

//////Board Detail page
router.get("/board/detail", C_controller.BoardDetail);

//////Board Write
router.post("/board/write", C_controller.BoardWrite);

//////Board Search
router.post("/board/search", C_controller.BoardSearch);

//////Board Delete
router.delete("/board/delete", C_controller.BoardDelete);

//////Board Like

router.post("/board/like", C_controller.BoardLike);

//////comment Write
router.post("/comment/write", C_controller.CommentWrite);

//메인화면

router.get("/", M_controller.main);
router.post("/", M_controller.post_main);

//회원가입 페이지
router.get("/join", M_controller.join);
router.post("/join", M_controller.post_join);

//카카오 회원가입
router.get("/auth/kakao/join", M_controller.kakao_get_join);
router.get("/auth/kakao/join/callback", M_controller.kakao_join);

//로그인 페이지
router.get("/login", M_controller.login);
router.post("/login", M_controller.post_login);

//카카오 로그인

router.get("/auth/kakao", M_controller.kakao_get);
router.get("/auth/kakao/login/callback", M_controller.kakao_callback);

//구글 회원가입
router.get("/auth/google/join", M_controller.google_get_join);
router.get("/auth/google/join/callback", M_controller.google_join);

//구글 로그인
router.get("/auth/google", M_controller.google_get);
router.get("/auth/google/login/callback", M_controller.google_callback);

//multer 설정(보통 설정 파일을 따로 만들어서 exports 해서 씀.)
//diskStorage: 파일 저장 관련 설정 객체
const storage = multer.diskStorage({
  //저장될 경로지정
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  //파일 이름 설정
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName = path.basename(file.originalname, ext) + Date.now() + ext;
    cb(null, newName);
  },
});

//파일 크기 제한
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const upload = multer({ storage, limits });

//프로필
router.get("/profile", M_controller.profile);
router.patch("/profile", M_controller.edit_profile);
//프로필사진
router.post("/upload", upload.single("dynamic"), M_controller.profileImg);

//로그아웃
router.get("/logout", M_controller.logout);
//탈퇴

router.post('/profile/delete', M_controller.delete_user)

router.get('/bob', M_controller.bob);

//////////////////상녕/////////////////

router.get("/chat", S_controller.chat);

//자리배치관련
router.get("/desk", T_controller.desk);
router.get("/desk/generator", T_controller.generator);
router.get("/desk/get_generator", T_controller.get_generator);
router.post("/desk/delete_generator", T_controller.delete_generator);
router.get("/desk/reservation", T_controller.reservation);
router.post("/desk/reservationConfirm", T_controller.reservationConfirm);
router.patch("/desk/reservationEdit", T_controller.reservationEdit);

router.get("/test", T_controller.test);
//채팅방 render페이지
router.get("/chat", S_controller.chat);
//채팅 불러오기
router.post("/preMessage", S_controller.preMessage);
//내가 참여한 채팅방 목록 불러오기
router.post("/myChatList", S_controller.myChatList);
//내 참여방 미리보기 목록 불러오기
router.post("/myMessage", S_controller.myMessage);
//가입되어 있는 사람 목록 불러오기
router.post("/userList", S_controller.userList);
module.exports = router;
