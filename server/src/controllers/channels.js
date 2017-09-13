'use strict';

const Constants = require('../../../common/constants');
const User = require('../models/user');
const Channel = require('../models/channel');
const Boom = require('boom');
const Joi = require('joi');
const InviteTools = require('../utils/invitetools');
const ScoreExporter = require('../utils/scoreexporter');
const Moment = require('moment');

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
        path: '/channels/exportscores/{id}/{format}',
        handler: ChannelsController.exportScores,
        config: {
            auth: 'token'
        }

    });

    server.route({
        method: 'GET',
        path: '/channels/{chanId}/monitor',
        handler: ChannelsController.monitorGet,
        config: {
            auth: 'token'
        }
    });

    server.route({
        method: 'POST',
        path: '/channels/{chanId}/monitor',
        handler: ChannelsController.monitorPost,
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

                user.channels.push(chan);
                user.save((userSaveError, userSaveResult) => {
                    if(userSaveError) {
                        return reply(Boom.badRequest());
                    }
                });

                if(user.role != Constants.UserRoleEnum.MASTER) {
                    return reply({target:'/game/start/' + chan._id});
                } else {
                    return reply({target:'/channels/' + chan._id + '/monitor'});
                }
        });
    });
}

ChannelsController.scores = function(request, reply) {
    var channelId = request.params.id;
    Channel.findOne({_id: channelId}).populate('users.user').exec((error, result) => {
        if(error || !result) {
            return reply(Boom.badRequest());
        }

        var channel = {};
        channel.created = Moment(result.created).format('LLL');
        channel.phase = request.i18n.__('scenario_' + result.phase);
        channel.state = request.i18n.__('channelstate_' + result.state);
        channel.id = result.id;

        channel.users = [];
        for(var i=0;i<result.users.length;++i) {
            var element = {
                user: result.users[i].user,
                phaseResult: result.users[i].phaseResult
            };
            element.phaseResult.scoreStr = Math.round(element.phaseResult.score * 20) + " / 20";
            channel.users.push(element);
        }

        var ctx = {channel: channel};
        ctx.pageTitle = request.i18n.__('channels_scores_title', ctx);
        return reply.view('views/scoresmaster', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

ChannelsController.exportScores = function(request, reply) {
    var channelId = request.params.id;
    var format = request.params.format;

    Channel.findOne({_id: channelId}).populate('users.user').exec((error, channel) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        var exporter = new ScoreExporter(channel, format, request.i18n);
        var data = exporter.export();

        var dlFileName = 'gameoffarms_scores_' + Moment(channel.created).format('LLL') + '.' + format;
        dlFileName = dlFileName.replace(/ /g, '_');
        dlFileName = dlFileName.replace(/:/g, '-');

        reply(data).type('text/csv').header('content-disposition', 'attachment; filename='+dlFileName+';');
    });
}

ChannelsController.scenarioSelection = function(request, reply) {

    var scenarios = ['croprotation', 'budgetplan', 'itk', 'locked', 'locked', 'locked'];
    var ctx = {scenarios : []};

    for(var i=0;i<scenarios.length;++i) {
        var element = {
            id: scenarios[i],
            name: request.i18n.__('scenario_'+scenarios[i]),
            desc: request.i18n.__('scenario_desc_'+scenarios[i]),
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

ChannelsController.monitorGet = function(request, reply) {
    var chanId = request.params.chanId;
    Channel.findById(chanId).populate('users.user').exec((error, channel) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        var titleCtx = {};
        titleCtx.date = Moment(channel.created).format('LLL');
        titleCtx.phase = request.i18n.__('scenario_' + channel.phase);
        titleCtx.state = request.i18n.__('channelstate_' + channel.state);

        var ctx = {channel: channel};
        ctx.pageTitle = request.i18n.__('monitor_panel_title', titleCtx);
        ctx.pendings = [];
        ctx.accepteds = [];

        for(var i=0;i<channel.users.length;++i) {
            var userRef = channel.users[i];
            if(userRef.linked) {
                ctx.accepteds.push(userRef.user);
            } else {
                ctx.pendings.push(userRef.user);
            }
        }

        var recentEmails = [];
        User.findOne({email:request.auth.credentials.user.email}).select('channels').exec((error, channels) => {
            if(error) {
                ctx.recentEmails = recentEmails.join(',');
                return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
            }
            Channel.find({
                _id : { $in : channels.channels}
            }).populate('users.user').exec((error, channels) => {
                if(!error) {
                    for(var i=0;i<channels.length;++i) {
                        for(var j=0;j<channels[i].users.length;++j) {
                            var email = channels[i].users[j].user.email;
                            if( recentEmails.indexOf(email) == -1 && 
                                ctx.pendings.find(x => x.email == email) == null) {
                                recentEmails.push(email);
                            }
                        }
                    }
                }

                ctx.recentEmails = recentEmails.join(',');
                return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
            });
        });
        
        

        
    });
}

ChannelsController.monitorPost = function(request, reply) {

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
                            //we don't know this user, maybe we should keep a track of this invite for security?

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
                        return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
                    }

                    channel.populate('users.user', function(popError, popResult){
                        if(popError) {
                            var ctx = {channel: channel, error: {global: popError}};
                            return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
                        }
                        var ctx = {channel: popResult};
                        
                        ctx.date = Moment(channel.created).format('LLL');
                        ctx.pageTitle = request.i18n.__('monitor_panel_title');
                        ctx.pendings = [];
                        ctx.accepteds = [];
                        ctx.success = filtered;
                        
                        for(var i=0;i<channel.users.length;++i) {
                            var userRef = channel.users[i];
                            if(userRef.linked) {
                                ctx.accepteds.push(userRef.user);
                            } else {
                                ctx.pendings.push(userRef.user);
                            }
                        }
                        return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
                    });
                    
                }
            );
        }).catch(function(error){
            //something goes wrong
            var ctx = {channel: channel, error: {global: error}};
            return reply.view('views/channelmonitor', ctx, {layoutPath:'./templates/layout/dashboard'});
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