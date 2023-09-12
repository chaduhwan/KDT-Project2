const express = require("express");
const router = express.Router();

const C_controller = require("../controller/CH_Cmain");
const M_controller = require("../controller/MA_Cmain");
const S_controller = require("../controller/SN_Cmain");
const T_controller = require("../controller/TH_Cmain");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

///////Board Enter
router.get("/enter/board", C_controller.BoardEnter);

////////Subject Make
router.post("/subject/make", C_controller.Subjectmake);

/////////Subject Enter
router.post("/subject/enter",C_controller.EnterSubject);

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

//////comment Delete
router.post("/comment/delete",C_controller.CommentDelete)

/////// class Make
router.post("/class/make", C_controller.ClassMake);

/////// class Signin
router.post("/class/signin", C_controller.ClassSignin);

//메인화면
router.get("/main", M_controller.classMain);
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

// aws설정
aws.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: "ap-northeast-2",
});
// aws s3 인스턴스 생성
const s3 = new aws.S3();

// multer 설정 - aws
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "kdt9-thbr-test", // aws내에 존재하는 버킷 중에 지금 쓸거
    acl: "public-read", // 파일접근권한 (public-read로 해야 업로드된 파일이 공개)
    metadata: function (req, file, cb) {
      console.log(file);
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      let naming = file.originalname.split(".")[0];
      let ext = file.originalname.split(".")[1];
      cb(null, naming + Date.now().toString() + "." + ext);
    },
  }),
});

// Date.now().toString()

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
router.post("/header/logout", M_controller.logout);
//탈퇴

router.post("/profile/delete", M_controller.delete_user);

router.get("/bob", M_controller.bob);
router.post("/bob/select", M_controller.bobSelect);

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

// 노트매니저(파일관리)
router.get("/noteManager", T_controller.noteManager);
router.get("/get_noteManager", T_controller.get_noteManager);
router.post(
  "/noteManager/upload",
  uploadS3.array("file_upload"),
  T_controller.noteUpload
);
// router.post(
//   '/noteManager/upload',
//   upload.array('file_upload'),
//   T_controller.noteUpload,
// );

router.post("/noteManager/upload_folder", T_controller.noteUpload_folder);
router.delete("/noteManager/erase_files", T_controller.erase_files);
router.patch("/noteManager/patch_files", T_controller.patch_files);

router.get("/test", T_controller.test);
router.get("/test2", T_controller.test2);

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
//캘린더랜더

router.get("/calendar", S_controller.calendar);
router.post("/calendar", S_controller.post_calendar);
router.post("/eventData", S_controller.eventData);
//연습용
router.post("/practice", uploadS3.array("11"), S_controller.practice);
//내 프로필 사진 불러오기
router.post("/myprofile", S_controller.myprofile);
//상대방 프로필 사진 불러오기
router.post("/otherprofile", S_controller.otherprofile);
module.exports = router;
