'use strict';
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoomSchema   = new Schema({
    name: {
        type: String,
        unique: true,
    },
    active:{
        type: Boolean,
    }
});

module.exports = mongoose.model('Room', RoomSchema);
