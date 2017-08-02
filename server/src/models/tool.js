'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var ToolSchema = new mongoose.Schema({
    linkDbId: {
        type: Number,
        unique: true
    },
    name : {
        type: String,
        index: true,
        unique: true
    },
    price: Number,
    //TODO : ref to equipment Id (need tractor to use this one)
});

module.exports = mongoose.model('Tool', ToolSchema);