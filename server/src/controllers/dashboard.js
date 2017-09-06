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
    var user = request.auth.credentials.user;

    
}

module.exports = DashboardController;