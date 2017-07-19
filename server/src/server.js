'use strict';

const Constants = require('./constants');
const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const mongoose = require('mongoose');
const index = require('./routes/index');
const AuthRoute = require('./routes/auth');
const PlantsRoute = require('./routes/plants');
const DbManager = require('./dbmanager');

const server = new Hapi.Server();

var dbUrl = 'mongodb://localhost:27017/gof'; 
var dbOptions = 
{
   useMongoClient: true,
};

mongoose.connect(dbUrl, dbOptions, 
    (error) => {
        Hoek.assert(!error, error);

        DbManager.initiliaze(true);

        server.connection({port: 3000});
        register_plugins(server);

        server.route({
            method: 'GET',
            path:  '/',
            handler : index.get_index
        });

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
            key: Constants.JWT_KEY,
            verifyOptions: {
                algorithms: [ 'HS256' ],
            }
        });

        server.route({
            method: 'GET',
            path : '/data/{file*}',
            handler: {
                directory: {
                    path: 'data',
                    //listing: true
                }
            }
        });

        server.route({
            method: ['GET', 'POST'],
            path: '/newuser/{firstName}/{lastName}/{email}/{password}',
            handler: index.new_user
        });

        server.views({
            engines: {
                html: require('handlebars')
            },
            layout: true,
            relativeTo: __dirname,
            path: './data',
            layoutPath: './data/layout',
            helpersPath: './data/helpers'
        });

        new AuthRoute(server);
        new PlantsRoute(server);
        start_server(server);
    });
}

function start_server(server)
{
    server.start((error) => {
        if(error)
        {
            throw error;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
}