'use strict';

var mongoose = require ('mongoose');

// Channel sub schema, representing a phase result
var PhaseResultSchema = new mongoose.Schema({
    phaseId: String,                            // phase id
    score: Number,                              // phase score
    details: mongoose.Schema.Types.Mixed        // phase score details (content is phase dependant)
}, {_id:false});

// Channel sub schema, representing users data in the channel
var ChanUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date,                                 // creation date
    linked: Boolean,                            // true when user has accepted the channel
    gameData: mongoose.Schema.Types.Mixed,      // client saved data
    phaseActive: String,                        // current active phase
    phaseResults: [PhaseResultSchema]           // previous phases results
}, {_id:false});

// Channel schema
var ChannelSchema = new mongoose.Schema({
    users: [ChanUserSchema],
    state: {
        type: String,
        enum: [
            'OPENED', 
            'CLOSED'
        ],
        required: true,
        default: 'OPENED'
    }
});

module.exports = mongoose.model('Channel', ChannelSchema);