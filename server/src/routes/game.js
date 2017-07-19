'use strict';

function GameRoute(server) {
    server.route({
        method: 'GET',
        path: '/game/start',
        handler: GameRoute.startGame
    });
}


GameRoute.startGame = function(request, reply) {
    reply.view('views/game', {path:'..'});
}

module.exports = GameRoute;