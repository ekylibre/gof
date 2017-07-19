'use strict';

const Constants = require('../constants');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');
const Bcrypt = require('bcrypt');

function Auth(server) {
    console.log("Auth constructor");
    
    server.route({
        method: 'POST',
        path: '/auth/login',
        handler: Auth.login
    });

    server.route({
        method: 'GET',
        path: '/auth/check',
        handler: Auth.check,
        config: {
            auth: {
                strategy: 'token'
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/auth/register',
        handler: Auth.register
    });

}

Auth.login = function (request, reply) {

    var email = request.payload.email;
    var password = request.payload.password;

    User.findOne( {email: email},
        (error, user) => {
            if(error) {
                reply(Boom.unauthorized());
                return;
            }
            
            if(!user) {
                reply(Boom.notFound());
                return;
            }

            Bcrypt.compare(password, user.password,
                (error, same) => {
                    if(error || !same) {
                        reply(Boom.unauthorized());
                        return;
                    }

                    //here the user had successfully entered credentials
                    //let create a token
                    const token = jwt.sign({
                            email: user.email
                        }, 
                        Constants.JWT_KEY,
                        {
                            algorithm: 'HS256',
                            expiresIn: '12h',
                        }
                    );
                    reply({token: token, user: user});
            });
        }
    );
}

Auth.check = function (request, reply) {

    var email = request.auth.credentials.email;

    User.findOne( {email: email},
        (error, user) => {
            if(error) {
                reply(Boom.unauthorized());
                return;
            }
            
            if(!user) {
                reply(Boom.notFound());
                return;
            }

            reply({user:user});
        }
    );
}

Auth.register = function(request, reply) {

    var first = request.payload.firstName;
    var last = request.payload.lastName;
    var email = request.payload.email;
    var p1 = request.payload.password1;
    var p2 = request.payload.password2;
    
    if(p1 != p2) {
        reply(Boom.badData());
        return;
    }

    User.findOne({email: email}, 
        (error, result) => {
            if(result && result.email == email) {
                reply(Boom.conflict('User already registered'));
                return;
            }

            Bcrypt.hash(p1, 10,
                (err, encrypted) => {
                    if(err) {
                        reply(err);
                        return;
                    }
                    var u = new User();
                    u.firstName = first;
                    u.lastName = last;
                    u.email = email;
                    u.password = encrypted;
                    u.save(
                        (error, user) => {
                            if(error) {
                                reply(Boom.badRequest());
                                return;
                            }
                            
                            reply().code(200);
                    });
                }
            );

        }
    );
}

module.exports = Auth;

