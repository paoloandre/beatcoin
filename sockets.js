"use strict";

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports = module.exports = function (io) {
  io.socket.on("connection", function (client) {
    console.log("client connected ", client.id);
    client.on("info", function (data) {
      console.log(data);
      client.emit("info", data);
    });
  });
};
