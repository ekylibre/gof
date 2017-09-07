'use strict';

const Constants = require('../../../common/constants');
var mongoose = require ('mongoose');

// Channel sub schema, representing a phase result
var PhaseResultSchema = new mongoose.Schema({
    score: Number,                              // phase score
    details: mongoose.Schema.Types.Mixed        // phase score details (content is phase dependant)
}, {_id:false});

// Channel sub schema, representing users data in the channel
var ChanUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    linked: Boolean,                            // true when user has accepted the channel
    gameData: mongoose.Schema.Types.Mixed,      // client saved data
    phaseResult: PhaseResultSchema              // if present the game is done
}, {_id:false});

// Channel schema
var ChannelSchema = new mongoose.Schema({
    users: [ChanUserSchema],
    state: {
        type: String,
        enum: [ Constants.ChannelStateEnum.OPENED, Constants.ChannelStateEnum.CLOSED ],
        required: true,
        default: Constants.ChannelStateEnum.OPENED
    },
    phase: {
        type: String,
        required: true
    },
    created: Date
});

module.exports = mongoose.model('Channel', ChannelSchema);