const { Desk, Position, Chosen, File } = require('../models');
const { Op } = require('sequelize');

exports.test = (req, res) => {
  res.render('test');
};
exports.test2 = (req, res) => {
  res.render('test2');
};
exports.test3 = (req, res) => {
  res.render('test3');
};

exports.noteManager = async (req, res) => {
  res.render('TH_noteManager');
};

exports.get_noteManager = async (req, res) => {
  try {
    // let data = await File.findAll();
    let data = await File.findAll({ where: { userid: req.session.userId } });
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let sendingFile = {
        id: data[i].id,
        userid: data[i].userid,
        name: data[i].name,
        filename: data[i].filename,
        isFolder: data[i].isFolder == 0 ? false : true,
        location: data[i].location,
        parent: data[i].parent,
      };
      arr.push(sendingFile);
    }
    let json = JSON.stringify(arr);
    res.send({ data: arr });
  } catch (err) {
    console.log(err);
  }
};

exports.noteUpload = async (req, res) => {
  try {
    let fileSet = [];
    let data = await File.findAll();
    for (let i = 0; i < req.files.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (
          data[j].filename == req.files[i].key &&
          data[j].userid == req.session.userId
        ) {
          res.send({ status: '중복' });
          return;
        }
      }
      const file = await File.create({
        userid: req.session.userId,
        name: req.session.userName,
        filename: req.files[i].key,
        isFolder: false,
        location: req.files[i].location,
        parent:
          typeof req.body.folder_location == 'string'
            ? req.body.folder_location
            : req.body.folder_location[i],
      });
      let obj = {
        id: file.id,
        name: req.files[i].key,
        location: req.files[i].location,
      };
      console.log(obj);
      fileSet.push(obj);
    }
    res.send({ status: '성공', files: fileSet });
  } catch (err) {
    console.log(err);
    res.send({ status: '실패' });
  }
};

exports.noteUpload_folder = async (req, res) => {
  try {
    let data = await File.findAll();
    for (let j = 0; j < data.length; j++) {
      if (
        data[j].filename == req.body.filename &&
        data[j].userid == req.session.userId
      ) {
        res.send('중복');
        return;
      }
    }
    await File.create({
      userid: req.session.userId,
      name: req.session.userName,
      filename: req.body.filename,
      isFolder: true,
      location: null,
      parent: req.body.parent,
    });
    res.send('성공');
  } catch (err) {
    console.log(err);
    res.send('실패');
  }
};

exports.erase_files = async (req, res) => {
  try {
    console.log(req.body);
    for (let i = 0; i < req.body.length; i++) {
      let explorer = req.body[i];
      let arr = [explorer];
      let seq = [explorer];
      while (seq.length !== 0) {
        let isit = await File.findAll({
          where: { userid: req.session.userId, parent: seq[0] },
        });
        console.log(isit.length);
        if (isit.length > 0) {
          for (let j = 0; j < isit.length; j++) {
            arr.push(isit[j].dataValues.filename);
            seq.push(isit[j].dataValues.filename);
          }
        }
        seq.shift();
      }
      console.log(arr);
      for (let a = 0; a < arr.length; a++) {
        await File.destroy({
          where: { userid: req.session.userId, filename: arr[a] },
        });
      }
    }
    res.send('성공');
  } catch (e) {
    res.send('실패');
  }
};

exports.patch_files = async (req, res) => {
  console.log(req.body);
  try {
    for (let i = 0; i < req.body.movers.length; i++) {
      let updated = await File.update(
        { parent: req.body.to },
        {
          where: {
            userid: req.session.userId,
            filename: req.body.movers[i],
          },
        },
      );
    }
    res.send('성공');
  } catch (e) {
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
