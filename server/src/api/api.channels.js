
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
        path: '/api/channel/getGameData',
        handler: function(request, reply) { self.getGameData(request, reply); },
        config: {
            auth : 'token', //'bearer',
            cors : CORS
        }
    });

    server.route({
        method: 'POST',
        path: '/api/channel/setGameData',
        handler: function(request, reply) { self.setGameData(request, reply); },
        config: {
            auth : 'token', //'bearer',
            cors : CORS
        }
    });    
}

ApiChannels.prototype._getChannelUser = function (request, cb) {
    if(!request.auth.credentials.user) {
        return cb(Boom.unauthorized());
    }
    var chanId = request.params.chanId;
    if (!chanId) {
        chanId = request.query.chanId;
        if (!chanId) {
            return cb(Boom.badRequest());           
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
    
            // Find user in channel and mark as linked if needed
            var chanUser = null;
            for (var i=0; i<channel.users.length; i++) {
                var uid = channel.users[i].userId;
                if ( uid.equals(user._id)) {
                    chanUser = channel.users[i];
                    break;
                }
            }    

            if (chanUser) {
                if (!chanUser.linked) {
                    if (!user.channels.contains(channel._id)) {
                        user.channels.push(channel._id);
                        user.save();
                    }
            
                    chanUser.linked = true;
                    channel.save();
                }

                return cb(chanUser);
            }
            else {
                return cb(Boom.unauthorized('User not invited in channel'));
            }
        });
  
    });
    
}

ApiChannels.prototype.getGameData = function(request, reply) {
    this._getChannelUser(request, (chanUser) =>  {
        if (chanUser.isBoom) {
            return reply(chanUser);
        }
    
        return reply({statusCode: 200, payload: {gameData: chanUser.gameData}});
    });
}

ApiChannels.prototype.setGameData = function(request, reply) {
    if (!request.payload.gameData) {
        return reply(Boom.badRequest());
    }
    this._getChannelUser(request, (chanUser) =>  {
        if (chanUser.isBoom) {
            return reply(chanUser);
        }
    
        chanUser.gameData = request.payload.gameData;
        chanUser.save();
        return reply({statusCode: 200});
    });
}

module.exports = ApiChannels;