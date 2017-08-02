'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var RotationSchema = new mongoose.Schema({
    linkDbId: {
        type: Number,
        unique: true
    },
    plantSpecies: [String],
});

module.exports = mongoose.model('Rotation', RotationSchema);