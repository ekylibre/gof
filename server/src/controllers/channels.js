'use strict';

const User = require('../models/user');
const Channel = require('../models/channel');
const Boom = require('boom');

function ChannelsController(server){
    server.route({
        method: 'GET',
        path: '/channels',
        handler: ChannelsController.getAll/*,
        config: {
            auth: {
                strategy: 'token'
            }
        }*/
    });
    
    server.route({
        method: 'GET',
        path: '/channels/new',
        handler: ChannelsController.create,
        config: {
            auth: 'token'
        }
    });

    server.route({
        method: 'GET',
        path: '/channels/get',
        handler: ChannelsController.get,
        config: {
            auth: 'token'
        }
    });     
}

ChannelsController.getAll = function(request, reply) {
    Channel.find(
        (error, results) => {
            if(error) {
                reply(Boom.serverUnavailable('Database error!', error));
                return;
            }
            reply(results);
        }
    );
}

ChannelsController.get = function(request, reply) {
    var chanId = request.query.id;
    if (chanId === undefined) {
        return reply(Boom.badRequest());
    }
    Channel.findOne({_id: chanId}).populate('users').exec(
        (error, chan) => {
            if(error || !chan) {
                return reply(Boom.badData());
            }

            return reply(JSON.stringify(chan));
    });

}

ChannelsController.create = function(request, reply) {
    var email = request.auth.credentials.email;
    User.findOne( {email: email}, (error, user) => {
        if(error) {
            return reply(Boom.badRequest());
        }
        
        if(!user) {
            return reply(Boom.unauthorized());
        }

        var chan = new Channel();
        chan.users.push(user.id);
        chan.datas.push({
                uid: user.id,
                phaseActive: 'none',
                phaseResults: [{
                    uid: 'assolement',
                    score: 1234,
                    details: {}
                }]
            }
        );
        chan.save(
            (error, chan) => {
                if(error) {
                    return reply(Boom.badRequest());
                }

                reply(JSON.stringify(chan));
        });

    });

    /*
    var chan = new Channel();
    chan.save(
        (error, chan) => {
            if(error) {
                return reply(Boom.badRequest());
            }

            reply(JSON.stringify(chan));
    });
    */
}

module.exports = ChannelsController;