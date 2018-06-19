'use strict';
const express    = require('express');        
const routerUser = express.Router();     

const Users     = require('./user-module');

routerUser.get('/', (req, res) => {
    res.json({ message: 'welcome to user api!' });   
});

routerUser.get('/users', (req, res) => {
    Users.find((err, users) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({users});
        }
    });
});
routerUser.get('/users/:id', (req, res) => {
    Users.findById(req.params.id, (err, user) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({user});
        }
    });
});

routerUser.post('/users', (req, res) => {
    Users.create(req.body.user,(err, user)=>{
        if(err){
            res.status(500).json({error: err});
        }else{
            res.status(200).json("created successed");
        }
    })
        
});

routerUser.put('/users/:id', (req, res) => {
    Users.findByIdAndUpdate(req.params.id, req.body.user, (err, em) => {
        if(err){
            res.status(500).json({error: err});
        }else{
            res.status(200).json("put successed")
        }
    });
});

routerUser.delete('/users/:id', (req, res) => {
    Users.remove({ 
        _id: req.params.id
    }, (err, user) => {
        if (err) {
            res.status(500).json({ error: err });
        } 
        res.json({ message: 'Successfully deleted' });
    });
});
module.exports = routerUser;


