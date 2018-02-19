import socket from "socket.io";

exports = module.exports = io => {
  io.socket.on("connection", client => {
    console.log("client connected ", client.id);
    client.on("info", data => {
      console.log(data);
      client.emit("info", data);
    });
  });
};
