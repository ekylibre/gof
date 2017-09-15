'use strict';

const Constants = require('../../../common/constants');
const Boom = require('boom');
const User = require('../models/user');
const config = require('config');
const Hoek = require('hoek');
const Channel = require('../models/channel');
var moment = require('moment');

function DashboardController(server) {

    var self = this;
    server.route({
        method: 'GET',
        path: '/dashboard',
        handler: function(request, reply) { self.dashboardGet(request, reply);},
        config: {
            auth: 'token'
        }
    });
}

DashboardController.prototype.dashboardGet = function(request, reply) {
    var user = request.auth.credentials.user;
    if(user.role == Constants.UserRoleEnum.MASTER) {
        return this.dashboardMaster(request, reply);
    }
    return this.dashboardPlayer(request, reply);
}

DashboardController.prototype.dashboardMaster = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne({email: email}).populate('channels').exec((error, user) => {
        if(error) {
            return reply(Boom.internal());
        }

        for(var i=0;i<user.channels.length;++i) {
            var chan = user.channels[i];
            chan.createdStr = moment(chan.created).format('LLL');
            chan.phaseStr = request.i18n.__('scenario_' + chan.phase);
            chan.closed = chan.state == Constants.ChannelStateEnum.CLOSED;
            chan.scoreAvailable = chan.users.find((x) => {
                return x.phaseResult != null
            });
        }

        var ctx = { channels: user.channels.reverse() };
        return reply.view('views/dashboardmaster', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

DashboardController.prototype.dashboardPlayer = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne({email: email}).populate('channels').exec((error, user) => {
        if(error) {
            return reply(Boom.internal());
        }
        for(var i=0;i<user.channels.length;++i) {
            var chan = user.channels[i];
            chan.createdStr = moment(chan.created).format('LLL');
            chan.phaseStr = request.i18n.__('scenario_' + chan.phase);

            for(var j=0;j<chan.users.length;++j) {
                if(chan.users[j].user.equals(user.id)) {
                    chan.closed = chan.users[j].phaseResult != null;
                    if(chan.closed) {
                        chan.score = Math.round(chan.users[j].phaseResult.score * 20);
                    }
                    break;
                }
            }
        }

        var ctx = { channels: user.channels.reverse() };
        return reply.view('views/dashboardplayer', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}


module.exports = DashboardController;