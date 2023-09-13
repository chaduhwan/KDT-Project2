const {
  board,
  comment,
  like,
  Class,
  UserTakeClass,
  Subject,
} = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const sequelize = require("sequelize");

exports.main = (req, res) => {
  res.render("index");
};

///////////// 클래스 별 게시판 들어가기
exports.BoardEnter = async (req, res) => {
  const classId = req.query.classId;
  req.session.classId = classId;
  res.json({ result: true });
};

////////////게시판 주제만들기
exports.Subjectmake = async (req, res) => {
  const { subjectTitle } = req.body;
  const ClassId = req.session.classId;
  Subject.create({ subjectTitle, ClassId });
};

////////////게시판 들어가기
exports.EnterSubject = async (req, res) => {
  const user = req.session.userName;
  const userid = req.session.userId;
  const classId = req.session.classId;
  const { SubjectId } = req.body;
  req.session.subjectId = SubjectId;

  let subjectId = [];
  let subjectTitle = [];

  if(SubjectId !== 9999) {

    const subject = await Subject.findAll({ where: { classId } });
  
    for (const ele of subject) {
      subjectId.push(ele.SubjectId);
      subjectTitle.push(ele.subjectTitle);
    }
  
    let likeArr = [];
  
    const boards = await board.findAll({
      where: { SubjectId: req.session.subjectId },
    });
    for (const boardEle of boards) {
      const cou = await like.count({
        where: { BoardId: boardEle.BoardId },
      });
      likeArr.push(cou);
    }
    res.send({ data: boards, likeArr });
  } else {
   const subject = await Subject.findAll({ where: { classId } });
  
    for (const ele of subject) {
      subjectId.push(ele.SubjectId);
      subjectTitle.push(ele.subjectTitle);
    }
  
    let likeArr = [];
  
    const boards = await board.findAll();
    for (const boardEle of boards) {
      const cou = await like.count({
        where: { BoardId: boardEle.BoardId },
      });
      likeArr.push(cou);
    }
    res.send({ data: boards, likeArr });
  }

};

///// 게시판 메인페이지
exports.BoardMain = async (req, res) => {
  const user = req.session.userName;
  const userid = req.session.userId;
  const classId = req.session.classId;

  console.log(req.session.classId);

  let subjectId = [];
  let subjectTitle = [];
  const subject = await Subject.findAll({ where: { classId } });

  for (const ele of subject) {
    subjectId.push(ele.SubjectId);
    subjectTitle.push(ele.subjectTitle);
  }

  console.log(subject);
  let likeArr = [];

  const boards = await board.findAll({ where: { ClassId: classId } });
  for (const boardEle of boards) {
    const cou = await like.count({
      where: { BoardId: boardEle.BoardId },
    });
    likeArr.push(cou);
  }
  res.render("CHA_boardMain", {
    data: boards,
    user,
    userid,
    likeArr,
    subjectId,
    subjectTitle,
  });
};

///////게시판 상세페이지
exports.BoardDetail = (req, res) => {
  const user = req.session.userName;
  const userid = req.session.userId;
  board
    .findOne({
      where: { BoardId: req.query.boardId },
    })
    .then((result) => {
      comment
        .findAll({
          include: [
            {
              model: board,
            },
          ],
          where: { boardId: req.query.boardId },
        })
        .then((commentData) => {
          like
            .count({
              where: {
                boardId: req.query.boardId,
              },
            })
            .then((likecount) => {
              res.render("CHA_boardDetail", {
                data: result,
                commentData,
                user,
                userid,
                likecount,
              });
            });
        });
      // console.log(result)
    });
};

////////게시글 작성
exports.BoardWrite = async (req, res) => {
  if(req.session.subjectId== null) {
    res.json({result:false})
    return;
  }
  const { title, date, writer, content, tag } = req.body;
  let likeArr = [];
  const newboard = await board.create({
    title,
    date,
    writer,
    content,
    tag,
    SubjectId: req.session.subjectId,
    ClassId: req.session.classId,
    id: req.session.userId,
  });
  const result = await board.findOne({
    attributes: [[sequelize.fn("max", sequelize.col("BoardId")), "maxBoardId"]],
  });
  const maxBoardId = result.get("maxBoardId");
  const boardnew = await board.findAll({ where: { BoardId: maxBoardId } });

  const cou = await like.count({
    where: {
      boardId: maxBoardId,
    },
  });
  likeArr.push(cou);
  res.json({ data: boardnew, likeArr ,result:true});
};

////////게시글 삭제
exports.BoardDelete = async (req, res) => {
  const { BoardId } = req.body;
  const find = await board.findOne({ where: { BoardId } });
  if (find.writer == req.session.userName) {
    board.destroy({
      where: { BoardId },
    });
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
};

/////////게시글 검색
exports.BoardSearch = async (req, res) => {
  const { searchValue, searchBar } = req.body;
  let likeArr = [];

  let result;
  if (searchValue === "title") {
    result = await board.findAll({
      where: { title: { [Op.like]: "%" + searchBar + "%" } },
    });
    for (const boardEle of result) {
      const cou = await like.count({
        where: { BoardId: boardEle.BoardId },
      });
      likeArr.push(cou);
    }
  } else if (searchValue === "tag") {
    result = await board.findAll({
      where: { tag: { [Op.like]: "%" + searchBar + "%" } },
    });
    for (const boardEle of result) {
      const cou = await like.count({
        where: { BoardId: boardEle.BoardId },
      });
      likeArr.push(cou);
    }
  } else if (searchValue === "content") {
    result = await board.findAll({
      where: { content: { [Op.like]: "%" + searchBar + "%" } },
    });
    for (const boardEle of result) {
      const cou = await like.count({
        where: { BoardId: boardEle.BoardId },
      });
      likeArr.push(cou);
    }
  } else {
    // 유효하지 않은 검색 조건일 때 처리
    return res.status(400).send("Invalid searchValue");
  }
  res.send({ data: result, likeArr });
};

//////////////좋아요 기능
exports.BoardLike = async (req, res) => {
  const { id, BoardId } = req.body;
  const check = await like.findAll({
    where: {
      [Op.and]: [
        { BoardId }, // 첫 번째 조건
        { id }, // 두 번째 조건
      ],
    },
  });
  if (!(check.length > 0)) {
    const result = await like.create({ BoardId, id });
    const cou = await like.count({ where: { BoardId } });
    res.json({ result: true, cou });
  } else {
    res.json({ result: false });
  }
};

//////////////댓글 작성
exports.CommentWrite = (req, res) => {
  const { content, writer, date, BoardId } = req.body;
  comment.create({ content, writer, date, BoardId }).then((result) => {
    console.log(result);
    res.json({ result: true });
  });
};

////////////댓글 삭제
exports.CommentDelete = async (req, res) => {
  const { commentId } = req.body;
  const find = await comment.findOne({ where: { commentId } });
  if (find.writer == req.session.userName) {
    comment.destroy({ where: { commentId } });
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
};

///////////////리더 클래스 생성
exports.ClassMake = async (req, res) => {
  const { className, leader } = req.body;
  let randomNumber = function (min, max) {
    const randNum = Math.floor(Math.random() * (max - min +1)) +min;
    return randNum;
  }
  const token = await randomNumber(111111,999999)
  const result = await Class.create({ className, leader, token });
  res.json({ res: true, result, token });
};

////////////////클래스 가입
exports.ClassSignin = async (req, res) => {
  const { token } = req.body;
  const result = await Class.findOne({ where: { token } });
  if (result) {
    const signin = await UserTakeClass.create({
      userId: req.session.userId,
      classClassId: result.ClassId,
    });
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};


