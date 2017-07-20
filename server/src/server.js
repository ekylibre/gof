'use strict';

const Constants = require('./constants');
const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const mongoose = require('mongoose');

const IndexController = require('./controllers/index')
const AuthController = require('./controllers/auth');
const PlantsController = require('./controllers/plants');
const GameController = require('./controllers/game');
const DbManager = require('./dbmanager');
const config = require('config');


const server = new Hapi.Server();

var dbUrl = config.get('Database.connectionUrl');
var dbOptions = config.get('Database.options');

mongoose.connect(dbUrl, dbOptions, 
    (error) => {
        Hoek.assert(!error, error);

        DbManager.initiliaze(true);

        var options = config.get('Server.connectionOptions');
        server.connection(options);
        register_plugins(server);
    }
);


function register_plugins(server)
{
    server.register([
        require('vision'),
        require('inert'),
        require('hapi-auth-jwt')
    ],
    (error) => {
        
        Hoek.assert(!error, error);

        server.auth.strategy('token', 'jwt', {
            key: config.get('Jwt.key'),
            verifyOptions: {
                algorithms: [ 'HS256' ],
            }
        });

        server.views({
            engines: {
                html: require('handlebars')
            },
            layout: true,
            relativeTo: __dirname,
            path: './templates',
            layoutPath: './templates/layout',
            helpersPath: './templates/helpers'
        });

        setup_routes(server);
        start_server(server);
    });
}

function setup_routes(server) {
 
    new IndexController(server);
    new AuthController(server);
    new PlantsController(server);
    new GameController(server);
}

function start_server(server){
    server.start((error) => {
        if(error)
        {
            throw error;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
}