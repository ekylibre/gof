'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var PlantSchema = new mongoose.Schema({
    linkDbId: {
        type: Number,
        unique: true
    },
    species: String,
    pricePerHectare: Number,
    cultureMode: {
        type: String,
        enum: [
            Constants.CultureModeEnum.NORMAL, 
            Constants.CultureModeEnum.BIO, 
            Constants.CultureModeEnum.PERMACULTURE,
        ],
        required: true,
        default: 'normal'
    } 
});

module.exports = mongoose.model('Plant', PlantSchema);