'use strict';


const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const Mongoose = require('mongoose');
const Config = require('config');

const Constants = require('./constants');
const IndexController = require('./controllers/index')
const AuthController = require('./controllers/auth');
const PlantsController = require('./controllers/plants');
const GameController = require('./controllers/game');
const DbManager = require('./dbmanager');

function register_plugins(server)
{
    server.register([
        require('vision'),
        require('inert'),
        require('hapi-auth-jwt'),
        {
            register: require('hapi-graceful-pm2'),
            options: {
                timeout: 4000
            }
        }
    ],
    (error) => {
        
        Hoek.assert(!error, error);

        server.auth.strategy('token', 'jwt', {
            key: Config.get('Jwt.key'),
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

//entry point
function main() {
    const server = new Hapi.Server();

    var dbUrl = Config.get('Database.connectionUrl');
    var dbOptions = Config.get('Database.options');

    Mongoose.connect(dbUrl, dbOptions, 
        (error) => {
            Hoek.assert(!error, error);

            DbManager.initiliaze(true);

            var options = Config.get('Server.connectionOptions');
            server.connection(options);
            register_plugins(server);
        }
    );
}


main();