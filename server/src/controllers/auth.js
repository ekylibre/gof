'use strict';

const Constants = require('../constants');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');
const Bcrypt = require('bcrypt');
const crypto = require('crypto');
const Mailer = require('../utils/mailer');
const config = require('config');
const Hoek = require('hoek');

function AuthController(server) {
    server.route({
        method: 'POST',
        path: '/auth/login',
        handler: AuthController.login
    });

    server.route({
        method: 'GET',
        path: '/auth/check',
        handler: AuthController.check,
        config: {
            auth: {
                strategy: 'token'
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/auth/register',
        handler: AuthController.register
    });

    server.route({
        method: 'POST',
        path: '/auth/lostpassword',
        handler: AuthController.lostpassword
    });

    server.route({
        method: 'GET',
        path: '/auth/resetpassword/{token}',
        handler: AuthController.resetpassword,
    });

    server.route({
        method: 'POST',
        path: '/auth/resetpassword',
        handler: AuthController.resetpasswordpost,
    });
}

AuthController.login = function (request, reply) {

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
                        config.get('Jwt.key'),
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

AuthController.check = function (request, reply) {

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

AuthController.register = function(request, reply) {

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
                            
                            var mailer = new Mailer();
                            var ctx = request.i18n;
                            ctx.user = u;
                            
                            request.server.render('mails/welcome', ctx, { layoutPath: './templates/mails/layout', }, 
                                (error, html, config) => {
                                    Hoek.assert(!error, error);

                                    if(!error) {
                                        var subject = request.i18n.__("game_title");
                                        var text = request.i18n.__("welcome_new_user");

                                        mailer.sendMail(u.email, subject, text, html);
                                        mailer.destroy();
                                    }
                                    reply().code(200);
                                }
                            );
                            
                    });
                }
            );

        }
    );
}

AuthController.lostpassword = function(request, reply) {
    var email = request.payload.email;

    User.findOne({email: email},
        (error, result) => {
            if(error || !result) {
                reply(Boom.badRequest('Email not found', error));
                return;
            }

            crypto.randomBytes(20,
                (error, buffer) => {
                    if(error){
                        reply(Boom.badRequest('Email not found', error));
                        return;
                    }
                    var token = buffer.toString('hex');
                    result.resetpassordtoken = token;
                    result.save(
                        (error, user) => {
                            if(error) {
                                reply(Boom.badRequest());
                                return;
                            }

                            var mailer = new Mailer();
                            var url = request.server.info.uri + "/auth/resetpassword/" + token;
                            mailer.sendMail(email, "Game Of Farms - Password reset", url, url);
                            mailer.destroy();

                            reply().code(200);
                        }
                    );
                }
            )
        }
    );
}

AuthController.resetpassword = function(request, reply) {
    var token = request.params.token;
    User.findOne({resetpassordtoken: token},
        (error, result) => {
            if(error || !result) {
                reply(Boom.badRequest('reset password token not found!', error));
                return;
            }
            reply.view('views/resetpassword', {token:token, reset_password_panel_title: 'Saissisez votre nouveau mot de passe'});
        }
    );
}

AuthController.resetpasswordpost = function(request, reply) {
    var token = request.payload.token;
    var p1 = request.payload.password1;
    var p2 = request.payload.password2;

    if(p1 != p2) {
        reply(Boom.badData('passwords are different'));
        return;
    }

    User.findOne({resetpassordtoken: token},
        (error, result) => {
            if(error || !result) {
                reply(Boom.badRequest('reset password token not found!', error));
                return;
            }
            
            Bcrypt.hash(p1, 10,
                (err, encrypted) => {
                    if(err) {
                        reply(Boom.badRequest('unable to hash new password', error));
                        return;
                    }

                    result.resetpassordtoken = null;
                    result.password = encrypted;
                    result.save(
                        (error, user) => {
                            if(error) {
                                reply(Boom.badRequest());
                                return;
                            }
                            
                            reply.view('views/passwordchanged', {user: result});
                    });
                }
            );
        }
    );
}

module.exports = AuthController;

