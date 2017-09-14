'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var ActivitySchema = new mongoose.Schema({
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
            Constants.CultureModeEnum.REASONED,
        ],
        required: true,
        default: 'normal'
    },
    itk: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Activity', ActivitySchema);