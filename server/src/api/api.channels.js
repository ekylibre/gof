
'use strict';

const Boom = require('boom');
const User = require('../models/user');
const Channel = require('../models/channel');

var CORS = false;
if(process.env.NODE_ENV !== 'production') {
    //accept Cross Origin Resource Sharing when in dev
    CORS = {
        origin : ['*']
    };
}

function ApiChannels(server) {
    var self = this;
    
    server.route({
        method: 'GET',
        path: '/api/channel/getgamedata/{chanId}',
        handler: function(request, reply) { self.getGameData(request, reply); },
        config: {
            //auth : 'token',
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method: 'POST',
        path: '/api/channel/setgamedata',
        handler: function(request, reply) { self.setGameData(request, reply); },
        config: {
            //auth : 'token',
            auth : 'bearer',
            cors : CORS
        }
    });    
}


// @method _getChannelUser
// @param {Request} request request containing the user's credentials, and the channel id (params.chanId)
// @param {Callback} cb callback(channel, chanUser): the channel (or a Boom error), and the user's channel data
//
ApiChannels.prototype._getChannelUser = function (request, cb) {
    if(!request.auth.credentials.user) {
        return cb(Boom.unauthorized());
    }
    var chanId = request.params.chanId;
    if (!chanId) {
        chanId = request.query.chanId;
        if (!chanId) {
            chanId = request.payload.chanId;
            if (!chanId) {
                return cb(Boom.badRequest());           
            }
        }
    }

    User.findById(request.auth.credentials.user._id).exec( (error, user) => {
        if(error) {
            return cb(Boom.serverUnavailable('Database error!', error));
        }

        Channel.findById(chanId).exec( (error, channel) => {
            if(error) {
                return cb(Boom.serverUnavailable('Database error!', error));
            }
            if(!channel) {
                return cb(Boom.notFound());
            }
    
            try {
                // Find user in channel and mark as linked if needed
                var chanUser = null;
                for (var i=0; i<channel.users.length; i++) {
                    var uid = channel.users[i].userId;
                    if (uid.equals(user._id)) {
                        chanUser = channel.users[i];
                        break;
                    }
                }    

                if (chanUser) {
                    if (!chanUser.linked) {
                        if (user.channels.indexOf(channel._id)<0) {
                            user.channels.push(channel._id);
                            user.save();
                        }
                
                        chanUser.linked = true;
                        channel.save();
                    }

                    return cb(channel, chanUser);
                }
                else {
                    return cb(Boom.unauthorized('User not invited in channel'));
                }
            }
            catch (ex) {
                var err = Boom.badImplementation();
                if (CORS) {
                    err.output.payload.error = 'Internal Error: getChannelUser';
                    err.output.payload.message = ex.message;
                }
                return cb(err);
            }
        });
  
    });
    
}

/**
 * Request params:
 * @param {String(ObjectId)} chanId channel id
 */
ApiChannels.prototype.getGameData = function(request, reply) {
    this._getChannelUser(request, (channel, chanUser) =>  {
        if (channel.isBoom) {
            return reply(channel);
        }
    
        return reply({statusCode: 200, payload: {phase: chanUser.phaseActive, gameData: chanUser.gameData}});
    });
}

/**
 * Request params:
 * @param {String(ObjectId)} chanId channel id
 * @param {Object} gameData game data to be stored
 */
ApiChannels.prototype.setGameData = function(request, reply) {
    if (!request.payload.gameData) {
        return reply(Boom.badRequest());
    }
    this._getChannelUser(request, (channel, chanUser) =>  {
        if (channel.isBoom) {
            return reply(channel);
        }
    
        chanUser.gameData = request.payload.gameData;
        channel.save();
        return reply({statusCode: 200});
    });
}

module.exports = ApiChannels;