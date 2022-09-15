const express = require("express");
const http = require("http");

var bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const moment = require("moment-timezone");

const { placeOrder } =require('./QueueManagement');

const APP_PORT = 3000;
var app = express();

const corsOptions = {
    origin: "*", //origin: ['https://xxx.nu.ac.th', 'http://xxx.nu.ac.th/']
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

/** specify the directory from where to serve static assets such as JavaScript, CSS, images **/
app.use(express.static(path.join(__dirname, "public")));

var numUsers=0; // current total users
var allClients = []; //check ena /disable


const server = http.createServer(app);
//const io = new Server(server);
const io = require('socket.io')(server, {
    cors: corsOptions
});
const welcomeMsg = "โปรแกรมวิเคราะห์ทางไฟฟ้า, ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์, Lower-Voltage System Analysis Tools";

io.on("connection", (socket) => {
    console.log("a user connected");
    ++numUsers;
    
    socket.emit("hi", welcomeMsg);
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
      console.log("Remove token is "+socket.token);
      
      //Remove element match token in allClients [] arrays 
      //const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

      //const result = words.filter(word => word.length > 6);

      //console.log(result);

      numUsers--; // decrease users
    });
  
    socket.on("message", (data) => {
      console.log("message activated.");
      const packet = JSON.parse(data);
      console.log("Message from client is :" + packet.message);
    });

    socket.on('joidRoom', (message, callback) => {
        console.log('joidRoom', message);
        //add to array allClients [], {data.token,data.ip}
        // const objClient = {token: message.token, ip: message.ip};
        // allClients.push(objClient); // collected 

        socket.token=message.token;

        var clientProfile={'token':message.token,'ip':message.ip};
        allClients.push(clientProfile); // collected 

        var health_data={
          wating_clients:allClients.length,
          connected:numUsers
        }


        //sent system health data to notify user in django project.
        callback(health_data);
            //var data={
            //    ip:message.ip,
            //    token:message.token
            //}
             //////   store 
            //socket.time=moment.tz("Asia/Bangkok").format("YYYY-MM-DD THH:mm:ss.SSSZ");
            //socket.token=data.token;
            //socket.ip=data.ip;
             //////   store 
          
            //++numUsers;
            //allClients.push(socket);
            //console.log('store socket =', socket);
            //console.log('store token =', socket.token);
            //console.log('store ip =', socket.ip);
            //console.log('store time =', socket.time);
            //console.log('Num of store client =', allClients.length);
  
            //socket.broadcast.emit('newPlayerJoin', data);
        
    });

    socket.on('startGame', (data, callback) => {
        console.log('startGame ', data);
        // implement

        
        // add to bee-queue
        // placeOrder
        // process


        //if cal finish
        // release obj from array
        console.log('Release current quene processed.');
        var recentClient = allClients.shift();
        console.log('Count queue:', allClients.length);

        //count allClients
        var wating_clients= allClients.length;

        //nextClient = allClients[0]; // next client still in queue.
        // var token_finished=recentClient.token;

        nextToken =(allClients.length>=1)?allClients[0].token:'';// next client still in queue.

        console.log('current token is ', recentClient.token);
        console.log('next token is ', nextToken);

        //boardcast to all client
        var output={'current':recentClient.token,'next':nextToken,'wating_clients':wating_clients};
        socket.broadcast.emit('announcer', output); // boardcast with data


        var result = {
          time: moment.tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm"),
          fileName: 'chart.png',
          _token: output,
        };

        // set result to django
        callback(result);
  
        //  io.emit('goToPage', data.page);
        //  callback('This start time :'+new Date().getTime());
  
    });
      
    socket.on('getNumOfPlayers', (callback) => {
          callback(allClients.length);
    });

});

var port = process.env.PORT || APP_PORT;


server.listen(port, () => {
  console.log(`Server open at:${port}`);
});