const controller = require('../controller/TH_socket');

module.exports = function (io) {
  io.on('connection', (socket) => {
    controller.connection2(io, socket);
  });
};
