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
        path : '/game/start/{channelId}/{file*}',
        handler: function (request, reply) {
            // check if {channelId} is really a channelId or just a subfolder
            var path = __dirname + '/../public/web-desktop/';
            if (request.params.channelId && request.params.channelId.length<23) {
                path += request.params.channelId+'/'+request.params.file;
            }
            else {
                path += request.params.file;
            }
            return reply.file(path);
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

        // check if {channelId} is really a channelId or a filename
        if (channelId.length<23) {
            var path = __dirname + '/../public/web-desktop/'+request.params.channelId;
            return reply.file(path);            
        }

        reply.view('views/game', {
            accessToken: user.apiaccesstoken,
            channelId: channelId
        }, {
            layoutPath: './templates/layout/game'
        });
    });
}

module.exports = GameController;