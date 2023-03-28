const app = require("express");
const http = require("http").createServer(app);
var io = require("socket.io")(http);

const socketRooms = new Map();

io.on("connection", (socket) => {
  console.log("new client connected", socket.id);

  socket.on("user_join", (name, room) => {
    console.log("A user joined their name is " + name + " room: " + room);
    socket.join(room);
    socketRooms.set(socket.id, room);
    socket.broadcast.to(room).emit("user_join", name);
  });

  socket.on("message", ({ name, message, room }) => {
    console.log(name, message, socket.id, room);
    const socketRoom = socketRooms.get(socket.id);
    io.to(socketRoom).emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
