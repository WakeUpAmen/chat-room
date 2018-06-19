'use strict';

var server = require("http").createServer(onRequest);
var io = require("socket.io")(server);

function onRequest(req,res){
res.writeHead(200, {
'Access-Control-Allow-Origin' : '*'
});
};


// const express    = require('express');        
const bodyParser = require('body-parser');
// const app        = express();  

// var server = require("http").createServer(app);
// var io = require("socket.io")(server);
// io.set('origins', '*:*');

const mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:admin1@ds163650.mlab.com:63650/chat-room');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
const port = process.env.PORT || 8888;    

//
const Users     = require('./user-module');
const Rooms     = require('./room-module');




// app.get('/', (req, res) => {
//     res.json({ message: 'welcome to our home page!' });   
// });

io.on("connection", socket => {
    console.log("connection")
    socket.on("login", res => {
       // 1 find active room
       Rooms.find((err, rooms)=>{
           if(err){
               console.log(err);
           }else{
               //2 find all users
               Users.find((err, users)=>{
                   if(err){
                       console.log(err);
                   }else{
                       // 3. create user
                       let roomname = rooms.filter(room=>room.active === true)[0].name;
                       let newUser = {name: "guest"+(users.length+1), room: roomname}
                       Users.create(newUser, (err, user)=>{
                           if(err){
                                console.log(err)
                           }else{
                                socket.emit("login successed",{ 
                                    userName: user.name,
                                    rooms: rooms,
                                    room: roomname
                                })
    
                                socket.join(roomname);
                                socket.emit("update chat", "server", "you entered: "+ roomname);
                                socket.emit(
                                    "update chat",
                                    "server",
                                    "Users currently in this room: "+ users.map(user=>user.name).join(", ")
                                )
                                socket.broadcast
                                .to(roomname)
                                .emit("update chat", "server", `'${user.name}' has joined this room.`)
                           }
                       })
                   }
               })
           }
       })

    });
    socket.on("send chat", (userName, message, roomName)=>{
        socket.emit("update chat", "you", message);
        socket.broadcast.to(roomName).emit("update chat", userName, message);
    });

    socket.on("change userName", (oldUserName, newUserName, roomName) =>{
        Users.update({name: oldUserName}, {$set: {name: newUserName}}, (err, user)=>{
            if(err){
                console.log(err)
            }else{
                socket.emit(
                    "update chat",
                    "server",
                    `you changed your name to '${newUserName}'`
                );
                socket.broadcast
                .to(roomName)
                .emit(
                    "update chat",
                    "server",
                    `'${oldUserName} changed name to '${newUserName}'`
                )
            }
        })
    })

    socket.on("change room", (preRoom, nextRoom, userName) => {
        console.log("change rooom")
        if(preRoom === nextRoom){
            socket.emit("update chat", "server", `you have already in '${preRoom}'`);
            return;
        }
        Rooms.find((err, rooms)=>{
            if(err){
                console.log(err);
            }else{
                if(!rooms.map(room=>room.name).includes(nextRoom)){
                    Rooms.update({active: true}, {$set:{active: false}}, (err, updatedroom)=>{
                        if(err){
                            console.log(err);
                        }else{
                            Rooms.create({name: nextRoom, active: true}, (err, room)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    Users.update({name: userName},{$set:{room: nextRoom}}, (err, user)=>{
                                        if(err){
                                            console.log(err);
                                        }else{
                                            Users.find({room: nextRoom},(err, users)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    socket.leave(preRoom);
                                                    socket.join(nextRoom);
                                                    socket.emit("update chat", "server", `you entered '${nextRoom}'`);
                                                    socket.emit(
                                                        "update chat",
                                                        "server",
                                                        `Users currently in '${nextRoom}': '${users.filter(user=>user.room == nextRoom).map(user=>user.name).join(", ")}'`
                                                    )
                                                    socket.broadcast
                                                    .to(preRoom)
                                                    .emit("update chat", "server", `'${userName}' has left the room.`);
                                                    socket.broadcast
                                                        .to(nextRoom)
                                                        .emit("update chat", "server", `'${userName}' has joined this room.`);
                                                    io.local.emit("update rooms", rooms);
                                                }
                                            })
                                        } 
                                    })
                                }
                            })
                        }
                    })
                }else{
                    Rooms.update({active: true}, {$set:{active: false}}, (err, updatedroom)=>{
                        if(err){
                            console.log(err);
                        }else{
                            Rooms.update({name: nextRoom}, {$set:{active: true}}, (err, room)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    Users.update({name: userName},{$set:{room: nextRoom}}, (err, user)=>{
                                        if(err){
                                            console.log(err);
                                        }else{
                                            Users.find({room: nextRoom}, (err, users)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    socket.leave(preRoom);
                                                    socket.join(nextRoom);
                                                    socket.emit("update chat", "server", `you entered '${nextRoom}'`);
                                                    socket.emit(
                                                        "update chat",
                                                        "server",
                                                        `Users currently in '${nextRoom}': '${users.filter(user=>user.room == nextRoom).map(user=>user.name).join(", ")}'`
                                                    )
                                                    socket.broadcast
                                                    .to(preRoom)
                                                    .emit("update chat", "server", `'${userName}' has left the room.`);
                                                    socket.broadcast
                                                        .to(nextRoom)
                                                        .emit("update chat", "server", `'${userName}' has joined this room.`);
                                                    io.local.emit("update rooms", rooms);
                                                }
                                            })
                                        } 
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
})

server.listen(port, () => {
    console.log('chatroom server happens on port ' + port)}
);

