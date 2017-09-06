'use strict';

const Constants = require('../../../common/constants');
const Boom = require('boom');
const User = require('../models/user');
const config = require('config');
const Hoek = require('hoek');

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

        //find current active phase
        var minIndexOfPhase = Number.MAX_SAFE_INTEGER;
        for(var i=0;i<user.channels.length;++i) {
            var chan = user.channels[i];
            for(var j=0;j<chan.users.length;++j) {
                var chanUser = chan.users[j];
                var index = chan.phases.indexOf(chanUser.phaseActive);
                if(index > -1) {
                    minIndexOfPhase = Math.min(minIndexOfPhase, index);
                }
            }
            if(minIndexOfPhase < Number.MAX_SAFE_INTEGER) {
                chan.currentPhase = chan.phases[minIndexOfPhase];
                chan.closed = false;
            } else {
                chan.currentPhase = 'none';
                chan.state = 'CLOSED';
                chan.closed = true;
                chan.save();
            }
        }

        var ctx = { channels: user.channels };
        return reply.view('views/dashboardmaster', ctx, {layoutPath:'./templates/layout/dashboard'});
    });
}

module.exports = DashboardController;