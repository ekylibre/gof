'use strict';

const Boom = require('boom');
const config = require('config');
const Hoek = require('hoek');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

function Auth(server) {

    this.check = function(request, reply) {
        var email = request.auth.credentials.email;
        User.findOne( {email: email}).select('-password -resetpasswordtoken').exec(
            (error, user) => {
                if(error) {
                    return reply(Boom.badRequest());
                }
                
                if(!user) {
                    return reply(Boom.unauthorized());
                }

                reply({statusCode: 200, payload: { user: user}}).code(200);
            }
        );
    };

    this.login = function(request, reply) {
        var email = request.payload.email;
        var password = request.payload.password;

        User.findOne({email:email},
            (error, user) => {
                if(error) {
                    return reply(Boom.badRequest());
                }

                if(!user) {
                    return reply(Boom.unauthorized());
                }

                Bcrypt.compare(password, user.password, 
                    (error, same) => {
                        if(error) {
                            return reply(Boom.internal());
                        }
                        if(!same) {
                            return reply(Boom.unauthorized());
                        }
                        const token = jwt.sign({
                                email: user.email,
                                firstname: user.firstName
                            }, 
                            config.get('Jwt.key'),
                            {
                                algorithm: 'HS256',
                                expiresIn: '12h',
                            }
                        );
                        return reply({statusCode: 200, payload: {accessToken: token}}).code(200);
                    }
                );
            }
        );
    };

    var CORS = false;

    console.log(process.env.NODE_ENV);

    if(process.env.NODE_ENV === 'development') {
        //accept Cross Origin Resource Sharing when in dev
        CORS = {
            origin : ['*']
        };
    }

    server.route({
        method: 'GET',
        path: '/api/auth/check',
        handler: this.check,
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method: 'POST',
        path: '/api/auth/login',
        handler: this.login,
        config: {
            cors : CORS
        }
    });
}

function Api(server) {
    
    this.Auth = new Auth(server);
    

}

module.exports = Api;