'use strict';

const Constants = require('../../../common/constants');
const Boom = require('boom');
const User = require('../models/user');
const config = require('config');
const Hoek = require('hoek');
const Channel = require('../models/channel');

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
    User.findOne({email: email}).populate('channels').exec((error, result) => {
        if(error) {
            return reply(Boom.internal());
        }
        var user = result;

        for(var i=0;i<user.channels.length;++i) {
            var chan = user.channels[i];
            chan.closed = chan.state == 'CLOSED';
        }

        var ctx = { channels: user.channels };
        return reply.view('views/dashboardmaster', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

DashboardController.prototype.dashboardPlayer = function(request, reply) {
    return reply.redirect('/channels/scenarioselection');
}


module.exports = DashboardController;