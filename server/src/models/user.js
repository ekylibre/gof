'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, index: true, unique: true},
    password: String,
    role: { 
        type:String, 
        enum: [
            Constants.UserRoleEnum.MASTER, 
            Constants.UserRoleEnum.STUDENT, 
            Constants.UserRoleEnum.PROFESSIONAL, 
            Constants.UserRoleEnum.OTHER
        ] 
    },
    establishment: String,
    resetpasswordtoken: String,
    apiaccesstoken: String,

    channels: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Channel'
    }]
});

module.exports = mongoose.model('User', UserSchema);