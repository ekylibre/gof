'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');


const server = new Hapi.Server();
const index = require('./routes/index')
const Auth = require('./routes/auth')

register_plugins(server);

server.connection({port: 3000, host: 'localhost'});

server.route({
    method: 'GET',
    path:  '/',
    handler : index.get_index
});

function register_plugins(server)
{
    const dbOptions = 
    {
        url: "mongodb://localhost:27017/gof",
        settings: {
            poolSize: 10
        },
        decorate: true
    };

    server.register([
        {
            register: require('hapi-mongodb'),
            options: dbOptions
        }
        ,
        require('vision'),
        require('inert')
    ],
    (error) => {
        Hoek.assert(!error, error);
        server.route({
            method: 'GET',
            path : '/data/{file*}',
            handler: {
                directory: {
                    path: 'data',
                    listing: true
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

        new Auth(server);
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