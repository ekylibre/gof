'use strict';

var mongoose = require ('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, index: true, unique: true},
    password: String,
    resetpassordtoken: String,
});

module.exports = mongoose.model('User', UserSchema);