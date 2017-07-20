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
        handler: IndexController.root

    });
}

IndexController.root = function(request, reply) {
    reply.view('views/index', {title: "Game Of Farms"});
}

module.exports = IndexController;