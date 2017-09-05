'use strict';

var mongoose = require ('mongoose');

var ChannelSchema = new mongoose.Schema({
    // users: {
    //     index: false,
    //     type: [{
    //         uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //         phaseActive: String,
    //         phaseResults: {
    //             index: false,
    //             type: [{
    //                 uid: String,
    //                 score: Number,
    //                 details: mongoose.Schema.Types.Mixed
    //             }]
    //         }
    //     }]
    // },

    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    datas: {
        index: false,
        type: [mongoose.Schema.Types.Mixed]
    },
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