'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var EquipmentSchema = new mongoose.Schema({
    linkDbId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        index: true,
        unique: true
    },

    price: Number
},
{
    collection:'equipments'
});

module.exports =  mongoose.model('Equipment', EquipmentSchema);
