const socketIo = require("socket.io");
const { corsOptions } = require("./middlewares/cors");

let io;
const socketUsers = {};

const initSocket = (server) => {
  io = socketIo(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    console.log("New socket client connected", socket.id);

    socket.on("identify", (userId) => {
      socketUsers[userId] = socket.id;
      console.log(`Socket user connected: ${userId}, Socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket client disconnected: ", socket.id);
      for (let userId in socketUsers) {
        if (socketUsers[userId] === socket.id) {
          delete socketUsers[userId];
          break;
        }
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const getSocketUsers = () => {
  return socketUsers;
};

module.exports = { initSocket, getIo, getSocketUsers };
