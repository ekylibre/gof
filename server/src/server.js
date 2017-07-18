'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');

const server = new Hapi.Server();
const routes = require('./routes/index')

register_mongo(server);
register_views(server);

server.connection({port: 3000, host: 'localhost'});

server.route({
    method: 'GET',
    path:  '/',
    handler : routes.get_index
});

server.start((error) => {
    if(error)
    {
        throw error;
    }

    console.log(`Server running at: ${server.info.uri}`);
});

function register_mongo(server)
{
    const dbOptions = 
    {
        url: "mongodb://localhost:27017/gof",
        settings: {
            poolSize: 10
        },
        decorate: true
    };

    server.register({
        register: require('hapi-mongodb'),
        options: dbOptions
    },
    (error) => {
        Hoek.assert(!error, error);

    });
}

function register_views(server)
{
    //template engine
    server.register(require('vision'), (error) =>
    {
        Hoek.assert(!error, error);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './templates',
            layoutPath: './templates/layout',
            helpersPath: './templates/helpers'
        });
    });
}