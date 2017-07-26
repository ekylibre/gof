'use strict';

const Plant = require('../models/plant');
const Boom = require('boom');

function PlantsController(server){
    server.route({
        method: 'GET',
        path: '/plants',
        handler: PlantsController.getAll/*,
        config: {
            auth: {
                strategy: 'token'
            }
        }*/
    });
}

PlantsController.getAll = function(request, reply) {
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

module.exports = PlantsController;