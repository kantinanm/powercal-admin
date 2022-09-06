const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
var bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const APP_PORT = 3000;
var app = express();

const corsOptions = {
    origin: "*", //origin: ['https://www.section.io', 'https://www.google.com/']
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
};

app.use(cors(corsOptions));
//app.use(cors());
app.use(express.urlencoded({ extended: true }));

/** specify the directory from where to serve static assets such as JavaScript, CSS, images **/
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
//const io = new Server(server);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
const welcomeMsg = "โปรแกรมวิเคราะห์ทางไฟฟ้า, ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์, Lower-Voltage System Analysis Tools";

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("hi", welcomeMsg);
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  
    socket.on("message", (data) => {
      console.log("message activated.");
      const packet = JSON.parse(data);
      console.log("Message from client is :" + packet.message);
    });
});

var port = process.env.PORT || APP_PORT;

/*app.listen(port, function () {
  console.log("Starting node.js on port " + port);
});*/

server.listen(port, () => {
  console.log("listening on *:" + port);
});