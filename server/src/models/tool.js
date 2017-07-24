'use strict';

const Constants = require('../constants')
var mongoose = require ('mongoose');

var ToolSchema = new mongoose.Schema({
    name : {
        type: String,
        index: true,
        unique: true
    },
    price: Number,
    //TODO : ref to equipment Id (need tractor to use this one)
});

module.exports = mongoose.model('Tool', ToolSchema);