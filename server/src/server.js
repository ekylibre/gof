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
        require('inert'),
        require('hapi-auth-jwt'),
        {
            //localization plugin will set language from header field 'language'
            register: require('hapi-i18n'),
            options: {
                locales: ['fr'],
                directory: __dirname + '/locales',
                queryParameter: 'lang',
                //languageHeaderField: 'language',
                defaultLocale: 'fr' // default to first element in locales array if not specified
            }
        },
        {
            register: require('hapi-graceful-pm2'),
            options: {
                timeout: 4000
            }
        },
        require('vision'),
    ],
    (error) => {
        
        Hoek.assert(!error, error);

        //setup authentication
        server.auth.strategy('token', 'jwt', {
            key: Config.get('Jwt.key'),
            verifyOptions: {
                algorithms: [ 'HS256' ],
            }
        });

        //register helper to handle bars to allow {{i18n "text_tag_to_localize"}} in templates
        var Handlebars = require('handlebars');
        Handlebars.registerHelper('i18n', require('./utils/handlebarshelpers').i18n_helper);

        //setup view templates
        server.views({
            engines: {
                html: Handlebars
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