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
    if(request.query.fullscreen === "true") {
        reply.view('views/gamefs', 
            {accessToken: request.state['access_token']}, 
            {layout:false});
    } else {
        reply.view('views/game', 
            {accessToken: request.state['access_token']},
            {layoutPath: './templates/layout/game'});
    }
}

module.exports = GameController;