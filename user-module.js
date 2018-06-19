'use strict';
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: {
        type: String,
        unique: true,
        default: null
    },
    room: {
        type: String,
        unique: false,
    }
});

module.exports = mongoose.model('User', UserSchema);
