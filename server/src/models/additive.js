'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var AdditiveSchema = new mongoose.Schema({
    linkDbId: {
        type: Number,
        unique: true
    },
    name : {
        type: String,
        index: true,
        unique: true
    },

    price: Number

});

module.exports = mongoose.model('Additive', AdditiveSchema);