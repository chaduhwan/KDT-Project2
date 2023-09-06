'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//모델
db.board = require('./Board')(sequelize)
db.User = require('./User')(sequelize);
db.Chat = require("./Chat")(sequelize);
db.participant = require("./participant")(sequelize);
db.room = require("./room")(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;