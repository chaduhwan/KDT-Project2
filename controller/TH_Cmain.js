const { Desk, Position, Chosen } = require('../models');
const { Op } = require('sequelize');

exports.test = (req, res) => {
  res.render('test');
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
