'use strict';
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: {
        type: String,
        unique: true,
    },
    room: {
        type: String,
    }
});

module.exports = mongoose.model('User', UserSchema);
