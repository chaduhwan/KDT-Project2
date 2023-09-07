let data2 = [];

let currentData = [];
let currentMap = '';

exports.connection2 = (io, socket) => {
  if (currentData.length > 0) {
    io.emit('show', currentData, currentMap);
  }

  socket.on('basicSetting', (data) => {
    data2 = data.desk;
  });

  socket.on('dataPush', (data) => {
    let flag = 0;
    for (let i = 0; i < data2.length; i++) {
      if (data2[i].name == data.name) {
        data2[i].chosen = data.chosen;
        flag = 1;
      }
    }
    if (flag == 0) {
      data2.push(data);
    }
  });

  socket.on('dataPop', (title) => {
    for (let i = 0; i < data2.length; i++) {
      if (data2[i].name == title) {
        data2.splice(i, 1);
        break;
      }
    }
  });

  socket.on('confirmed', (title) => {
    for (let i = 0; i < data2.length; i++) {
      if (title == data2[i].name) {
        io.emit('confirmed', data2[i]);
        break;
      }
    }
  });

  socket.on('choose', (num, name) => {
    io.emit('occupate', num, name);
  });

  socket.on('saveState', (data, name) => {
    currentData = data;
    currentMap = name;
    io.emit('show', currentData, currentMap);
  });
};
