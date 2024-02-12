const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { Board, Pin } = require("johnny-five");
const app = express();
const server = http.createServer(app);
// const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Use the cors middleware

const allowedOrigins = [
  'http://192.168.1.140:5173',
  'http://localhost:5173',
  'https://iot-front-topaz.vercel.app/'

];

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace this with the actual origin of your Vue.js app
//   })
// );

// Serve the static files from the public directory
// app.use(express.static("public"));

// Initialize Johnny-Five board
const board = new Board();

board.on("error", (error) => {
  console.error("Error initializing board:", error);
});

board.on("ready", () => {
  const pin13 = new Pin(13);
  pin13.mode = Pin.OUTPUT;

  console.log("board is ready");
  // Socket.io event handling
  io.on("connection", (socket) => {
    console.log("A client connected");
    // socket.on("ready");
    socket.on("on", () => {
      console.log("LED turned on");
      pin13.write(1);
    });

    socket.on("off", () => {
      pin13.write(0);
      console.log("LED turned off");
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
