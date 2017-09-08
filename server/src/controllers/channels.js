'use strict';

const Constants = require('../../../common/constants');
const User = require('../models/user');
const Channel = require('../models/channel');
const Boom = require('boom');
const Joi = require('joi');
const InviteTools = require('../utils/invitetools');
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
        method: 'POST',
        path: '/channels/create',
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

    server.route({
        method: 'GET',
        path: '/channels/{chanId}/invite',
        handler: ChannelsController.inviteToChannelGet,
        config: {
            auth: 'token'
        }
    });

    server.route({
        method: 'POST',
        path: '/channels/{chanId}/invite',
        handler: ChannelsController.inviteToChannelPost,
        config: {
            auth: 'token'
        }
    });

    server.route({
        method: 'GET',
        path: '/channels/{chanId}/accept/{email}',
        handler: ChannelsController.acceptChannelInvite,
        config: {
            auth: {
                strategy: 'token',
                mode: 'optional'
            }
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

        var scenario = request.payload.scenario;

        var chan = new Channel();
        chan.phase = scenario;
        chan.created = new Date();

        //non master player auto-register to its own channel
        if(user.role != Constants.UserRoleEnum.MASTER) {
            chan.users.push({
                user: user.id,
                phaseResult:null 
            });
        }

        chan.save(
            (error, chan) => {
                if(error) {
                    return reply(Boom.badRequest());
                }

                if(user.role != Constants.UserRoleEnum.MASTER) {
                    return reply({target:'/game/start/' + chan._id});
                } else {
                    return reply({target:'/channels/' + chan._id + '/invite'});
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

ChannelsController.inviteToChannelGet = function(request, reply) {
    var chanId = request.params.chanId;
    Channel.findById(chanId).populate('users.user').exec((error, channel) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        //TODO : find recent emails already invited in other channels of same owner
        var ctx = {channel: channel};
        return reply.view('views/invite', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

ChannelsController.inviteToChannelPost = function(request, reply) {

    //Filter emails
    var emails = request.payload.emails.split(/[\s,]+/);
    var errors = [];
    var filtered = emails.filter(s => {
        var vResult = Joi.validate(s, Joi.string().email());
        if(vResult.error != null) {
            errors.push(s);
            return false;
        }
        return true;
    });

    //Retrieve channel
    var chanId = request.params.chanId;
    Channel.findById(chanId).populate('users.user').exec((error, channel) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        //map all invitations to promises
        var promises = filtered.map(function(email) {
            return new Promise(function(resolve, reject) {
                //send email to invited
                InviteTools.send(request, email, chanId, function(error) {
                    if(error) {
                        return reject(error);
                    }

                    //we need to retrieve the user by email to register its id to the channel users
                    User.findOne({email:email}, function(error, user) {
                        if(error) {
                            return reject(error);
                        }
                        
                        if(!user) {
                            return resolve();
                        }

                        //maybe this user was already added to the channel
                        var already = channel.users.find(function(e){
                            return e.user.email == email;
                        });

                        //so avoid pushing him multiple times
                        if(!already) {
                            channel.users.push({
                                user: user.id,
                                phaseResult: null 
                            });
                        }
                        resolve();
                    });
                });
            });
        });

        //exec promises
        Promise.all(promises).then(function(){
            channel.save(
                function(error, result) {
                    if(error) {
                        //something goes wrong
                        var ctx = {channel: channel, error: {global: error}};
                        return reply.view('views/invite', ctx, {layoutPath:'./templates/layout/dashboard'});
                    }

                    channel.populate('users.user', function(popError, popResult){
                        if(popError) {
                            var ctx = {channel: channel, error: {global: popError}};
                            return reply.view('views/invite', ctx, {layoutPath:'./templates/layout/dashboard'});
                        }
                        var ctx = {channel: popResult, success: filtered};
                        return reply.view('views/invite', ctx, {layoutPath:'./templates/layout/dashboard'});
                    });
                    
                }
            );
        }).catch(function(error){
            //something goes wrong
            var ctx = {channel: channel, error: {global: error}};
            return reply.view('views/invite', ctx, {layoutPath:'./templates/layout/dashboard'});
        });
    });
}

ChannelsController.acceptChannelInvite = function(request, reply) {
    var chanId = request.params.chanId;
    var target = '/game/start/' + chanId;
    if(!request.auth.isAuthenticated) {
        //redirect to login
        return reply.redirect('/auth/login?email='+encodeURIComponent(request.params.email)+'&target='+encodeURIComponent(target));
    }
    return reply.redirect(target);
}

module.exports = ChannelsController;