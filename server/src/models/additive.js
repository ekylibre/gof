'use strict';

const Constants = require('../constants')
var mongoose = require ('mongoose');

var AdditiveSchema = new mongoose.Schema({
    name : {
        type: String,
        index: true,
        unique: true
    },

    price: Number

});

module.exports = mongoose.model('Additive', AdditiveSchema);