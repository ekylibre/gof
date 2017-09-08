'use strict';

const User = require('../models/user');

function GameController(server) {

    //routes for static files
    server.route({
        method: 'GET',
        path : '/game/{file*}',
        handler: {
            directory: {
                path: __dirname + '/../public/web-desktop',
                listing: false,
                index: false,
            }
        }
    });

    server.route({
        method: 'GET',
        path : '/game/start/{file*}',
        handler: {
            directory: {
                path: __dirname + '/../public/web-desktop',
                listing: false,
                index: false,
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/game/start/{channelId}',
        handler: GameController.startGame,
        config: {
            auth: 'token'
        }
    });
}

GameController.startGame = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne( {email: email}, (error, user) => {
        if(error) {
            return reply(Boom.badRequest());
        }
        
        if(!user) {
            return reply(Boom.unauthorized());
        }

        var channelId = request.params.channelId;

        reply.view('views/game', {
            accessToken: user.apiaccesstoken,
            channelId: channelId
        }, {
            layoutPath: './templates/layout/game'
        });
    });
}

module.exports = GameController;