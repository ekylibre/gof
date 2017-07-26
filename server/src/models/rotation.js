'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

var RotationSchema = new mongoose.Schema({
    plantSpecies: [String],
});

module.exports = mongoose.model('Rotation', RotationSchema);