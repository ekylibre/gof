'use strict';

function GameController(server) {

    //route for static files
    server.route({
        method: 'GET',
        path : '/game/{file*}',
        handler: {
            directory: {
                path: __dirname + '/../public',
                listing: false,
                index: false,
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/game/start',
        handler: GameController.startGame
    });

    
}


GameController.startGame = function(request, reply) {
    reply.view('views/game', {path:'..'});
}

module.exports = GameController;