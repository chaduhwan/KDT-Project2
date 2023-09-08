const { Desk, Position, Chosen, File } = require('../models');
const { Op } = require('sequelize');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

// // multer 설정 - aws
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'kdt9-thbr-test', // aws내에 존재하는 버킷 중에 지금 쓸거
//     acl: 'public-read', // 파일접근권한 (public-read로 해야 업로드된 파일이 공개)
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + '-' + file.originalname);
//     },
//   }),
// });

// // aws설정
// aws.config.update({
//   accessKeyId: process.env.ACCESSKEYID,
//   secretAccessKey: process.env.SECRETACCESSKEY,
//   region: 'ap-northeast-2',
// });

// // aws s3 인스턴스 생성
// const s3 = new aws.S3();

exports.test = (req, res) => {
  res.render('test');
};

exports.noteManager = async (req, res) => {
  res.render('TH_noteManager');
};

exports.get_noteManager = async (req, res) => {
  try {
    let data = await File.findAll();
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let sendingFile = {
        name: data[i].name,
        filename: data[i].filename,
        location: data[i].location,
      };
      arr.push(sendingFile);
    }
    let json = JSON.stringify(arr);
    console.log(json);
    // json = JSON.parse(json);

    res.send({ data: arr });
  } catch (err) {
    console.log(err);
  }
};

exports.noteUpload = async (req, res) => {
  try {
    console.log(req.files);
    for (let i = 0; i < req.files.length; i++) {
      const file = await File.create({
        name: req.session.userName,
        filename: req.files[i].key,
        location: req.files[i].location,
      });
    }
    res.send('성공');
  } catch (err) {
    console.log(err);
    res.send('실패');
  }
};

exports.desk = (req, res) => {
  res.render('TH_desk');
};
exports.generator = (req, res) => {
  let name = req.session.userName;
  let userType = req.session.userType;
  res.render('TH_deskGenerate', { name, userType });
};

exports.get_generator = async (req, res) => {
  try {
    let desk = await Desk.findAll();
    let position = await Position.findAll();
    let chosen = await Chosen.findAll();

    for (let i = 0; i < desk.length; i++) {
      desk[i].dataValues.position = [];
      for (let j = 0; j < position.length; j++) {
        if (desk[i].name == position[j].name) {
          desk[i].dataValues.position.push(position[j]);
        }
      }

      for (let i = 0; i < desk.length; i++) {
        desk[i].dataValues.chosen = [];
        for (let j = 0; j < chosen.length; j++) {
          if (desk[i].name == chosen[j].name) {
            desk[i].dataValues.chosen.push(chosen[j]);
          }
        }
      }
    }
    console.log(desk);
    res.json({ desk });
  } catch (err) {
    console.log(err);
  }
};

exports.reservation = (req, res) => {
  let name = req.session.userName;
  let userType = req.session.userType;
  res.render('TH_placeReservation', { name, userType });
};

exports.reservationConfirm = async (req, res) => {
  try {
    const { chosen, name, num, position } = req.body;
    const desk = await Desk.create({
      name,
      num,
    });
    for (let i = 0; i < position.length; i++) {
      const desk_position = await Position.create({
        name,
        who: position[i].who,
        top: position[i].top,
        left: position[i].left,
      });
    }
    for (let i = 0; i < chosen.length; i++) {
      const desk_chosen = await Chosen.create({
        name,
        owner: chosen[i].owner,
        which: chosen[i].which,
      });
    }
    res.send('성공');
  } catch (err) {
    res.send('실패');
  }
};

exports.reservationEdit = async (req, res) => {
  try {
    const { chosen, name } = req.body;
    await Chosen.destroy({ where: { name: name } });
    for (let i = 0; i < chosen.length; i++) {
      let chosenCreate = await Chosen.create({
        name,
        owner: chosen[i].owner,
        which: chosen[i].which,
      });
    }
    res.send('성공');
  } catch (err) {
    res.send('실패');
  }
};

exports.delete_generator = async (req, res) => {
  try {
    await Desk.destroy({ where: { name: req.body.data } });
    await Position.destroy({ where: { name: req.body.data } });
    await Chosen.destroy({ where: { name: req.body.data } });
    res.send('성공');
  } catch (err) {
    res.send('실패');
  }
};
