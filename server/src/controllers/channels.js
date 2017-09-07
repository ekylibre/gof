'use strict';

const Constants = require('../../../common/constants');
const User = require('../models/user');
const Channel = require('../models/channel');
const Boom = require('boom');
var moment = require('moment');

function ChannelsController(server){
    server.route({
        method: 'GET',
        path: '/channels',
        handler: ChannelsController.getAll/*,
        config: {
            auth: 'token'
        }*/
    });
    
    server.route({
        method: 'GET',
        path: '/channels/scenarioselection',
        handler: ChannelsController.scenarioSelection,
        config: {
            auth: 'token'
        }
    });

    server.route({
        method: 'GET',
        path: '/channels/create/{scenario}',
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

    server.route({
        method: 'GET',
        path: '/channels/scores/{id}',
        handler: ChannelsController.scores,
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
    Channel.findOne({_id: chanId}).populate('users.user').exec(
        (error, chan) => {
            if (error) {
                return reply(error.message);
            }

            if(!chan) {
                return reply(Boom.badData());
            }

            return reply(JSON.stringify(chan));
    });
}

ChannelsController.create = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne( {email: email}, (error, user) => {
        if(error) {
            return reply(Boom.badRequest());
        }
        
        if(!user) {
            return reply(Boom.unauthorized());
        }

        var scenario = request.params.scenario;

        var chan = new Channel();
        chan.phase = scenario;
        chan.created = new Date();

        if(user.role != Constants.UserRoleEnum.MASTER) {
            chan.users.push({
                user: user.id,
                phaseResult:null 
            });
        } else {

        }

        chan.save(
            (error, chan) => {
                if(error) {
                    return reply(Boom.badRequest());
                }

                if(user.role != Constants.UserRoleEnum.MASTER) {
                    return reply.redirect('/game/start/' + chan._id);
                } else {
                    return reply.redirect('/channels/' + chan._id + 'invite' );
                }
        });

    });

}

ChannelsController.scores = function(request, reply) {
    var channelId = request.params.id;
    Channel.findOne({_id: channelId}).populate('users.user').exec((error, result) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        var channel = {};
        channel.created = moment(result.created).format('LL');
        channel.phase = request.i18n.__('scenario_' + result.phase);
        channel.state = request.i18n.__('channelstate_' + result.state);

        channel.users = [];
        for(var i=0;i<result.users.length;++i) {
            var element = {
                user: result.users[i].user,
                phaseResult: result.users[i].phaseResult
            };
            channel.users.push(element);
        }

        var ctx = {channel: channel};
        return reply.view('views/scoresmaster', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

ChannelsController.scenarioSelection = function(request, reply) {

    var scenarios = ['croprotation', 'budgetplan', 'itk', 'locked', 'locked', 'locked'];
    var ctx = {scenarios : []};

    for(var i=0;i<scenarios.length;++i) {
        var element = {
            id: scenarios[i],
            name: request.i18n.__('scenario_'+scenarios[i]),
            available: i == 0
        };
        ctx.scenarios.push(element);
    }

    var user = request.auth.credentials.user;
    if(user.role == Constants.UserRoleEnum.MASTER) {
        ctx.okButton = request.i18n.__('scenario_selection_ok_master');
    } else {
        ctx.okButton = request.i18n.__('scenario_selection_ok_player');
    }
    
    ctx.userRole = user.role;

    return reply.view('views/scenarioselection', ctx, {layoutPath:'./templates/layout/dashboard'});
}

module.exports = ChannelsController;