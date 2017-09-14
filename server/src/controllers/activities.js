'use strict';

const Activity = require('../models/activity');
const Boom = require('boom');

function ActivitiesController(server){
    server.route({
        method: 'GET',
        path: '/activities',
        handler: ActivitiesController.getAll/*,
        config: {
            auth: {
                strategy: 'token'
            }
        }*/
    });
}

ActivitiesController.getAll = function(request, reply) {
    Activity.find(
        (error, results) => {
            if(error) {
                reply(Boom.serverUnavailable('Database error!', error));
                return;
            }
            reply(results);
        }
    );
}

module.exports = ActivitiesController;