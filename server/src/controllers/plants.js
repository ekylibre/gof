'use strict';

const Plant = require('../models/plant');
const Boom = require('boom');

function PlantsRoute(server){
    server.route({
        method: 'GET',
        path: '/plants',
        handler: PlantsRoute.getAll,
        config: {
            auth: {
                strategy: 'token'
            }
        }
    });
}

PlantsRoute.getAll = function(request, reply) {

    Plant.find(
        (error, results) => {
            if(error) {
                reply(Boom.serverUnavailable('Database error!', error));
                return;
            }

            reply(results);
        }
    );
}

module.exports = PlantsRoute;