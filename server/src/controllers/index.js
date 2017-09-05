'use strict';

function IndexController(server) {

    //route for static files
    server.route({
        method: 'GET',
        path : '/{file*}',
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
        path: '/',
        handler: IndexController.root,
        config: {
            auth: {
                strategy: 'token',
                mode: 'optional'
            }
        }
    });
}

IndexController.root = function(request, reply) {

    if(request.auth.isAuthenticated) {
        reply.redirect('/game/start');
        return;
    }
    reply.view('views/home', null/*, {layout: false}*/);
}

module.exports = IndexController;