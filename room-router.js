'use strict';
const express    = require('express');        
const routerRoom = express.Router();     

const Rooms     = require('./room-module');
const Users     = require('./user-module');

routerRoom.get('/', (req, res) => {
    res.json({ message: 'welcome to room api!' });   
});

routerRoom.get('/rooms', (req, res) => {
    Rooms.find((err, rooms) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            Rooms.find({active: true}, (err, room)=>{
                if(err){
                    res.status(500).json({error: err});
                }else{
                    Users.find({room: room._id}, (err, users)=>{
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json({
                                rooms: rooms,
                                users: users,
                                room: room
                            })
                        }
                    })
                }
            })
        }
    });
});

routerRoom.get('/rooms/:id', (req, res) => {
    Rooms.findById(req.params.id, (err, room) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({room});
        }
    });
});

routerRoom.post('/rooms', (req, res) => {
    Rooms.create(req.body.room,(err, room)=>{
        if(err){
            res.status(500).json({error: err});
        }else{
            res.status(200).json("created successed");
        }
    })
        
});

routerRoom.put('/rooms/:id', (req, res) => {
    // Users.update({room: req.params.id}, {$set: {room: null}}, {multi: true}, (err, users) => {
    //     if(err){
    //         res.status(500).json({error: err});
    //     }else{
            Rooms.findByIdAndUpdate(req.params.id, req.body.room, (err, em) => {
                if(err){
                    res.status(500).json({error: err});
                }else{
                    res.status(200).json("put successed")
                }
            });
    //     }
    // }); 
});

routerRoom.delete('/rooms/:id', (req, res) => {
    Users.update({room: req.params.id}, {$set: {room: null}}, {multi: true}, (err, users) => {
        if(err){
            res.status(500).json({error: err});
        }else{
            Rooms.remove({ 
                _id: req.params.id
            }, (err, room) => {
                if (err) {
                    res.status(500).json({ error: err });
                } 
                res.json({ message: 'Successfully deleted' });
            });
        }
    }); 
});
module.exports = routerRoom;


