'use strict';

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
        path: '/game/start',
        handler: GameController.startGame,
        config: {
            auth: 'token'
        }
    });
}


GameController.startGame = function(request, reply) {
    reply.view('views/game');
}

module.exports = GameController;