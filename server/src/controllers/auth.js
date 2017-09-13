'use strict';

const Constants = require('../../../common/constants');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Bcrypt = require('bcrypt');
const crypto = require('crypto');
const Mailer = require('../utils/mailer');
const Validation = require('../utils/validation')
const config = require('config');
const Hoek = require('hoek');
const Channel = require('../models/channel');

var cookie_options = {
    ttl: 12 * 3600 * 1000, // expires in 12h
    encoding: 'none',    // we already used JWT to encode
    isSecure: false,
    isHttpOnly: true,    // prevent client alteration
    clearInvalid: true, // remove invalid cookies
    path: '/'            // set the cookie for all routes
};

function getUrl(request, endpoint) {
    var host = request.server.info.uri;
    if(process.env.NODE_ENV === 'production'){
        host = 'https://game-of-farms.ekylibre.com';
    }
    return host + endpoint;
}

function AuthController(server) {
    server.route({
        method: 'POST',
        path: '/auth/login',
        handler: AuthController.loginpost
    });

    server.route({
        method: 'GET',
        path: '/auth/login',
        handler: AuthController.loginget,
        config: {
            auth: {
                strategy: 'token',
                mode: 'optional'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/auth/logout',
        handler: AuthController.logout,
        config: {
            auth: 'token'
        }
    });

    /*
    server.route({
        method: 'GET',
        path: '/auth/check',
        handler: AuthController.check,
        config: {
            auth: 'token'
        }
    });
    */

    server.route({
        method: 'POST',
        path: '/auth/register',
        handler: AuthController.registerpost
    });

    server.route({
        method: 'GET',
        path: '/auth/register/{role?}',
        handler: AuthController.registerget
    });

    server.route({
        method: 'POST',
        path: '/auth/lostpassword',
        handler: AuthController.lostpasswordpost
    });

    server.route({
        method: 'GET',
        path: '/auth/lostpassword',
        handler: AuthController.lostpasswordget
    });

    server.route({
        method: 'GET',
        path: '/auth/resetpassword/{token}',
        handler: AuthController.resetpasswordget,
    });

    server.route({
        method: 'POST',
        path: '/auth/resetpassword',
        handler: AuthController.resetpasswordpost,
    });
}

AuthController.loginget = function(request, reply) {
    if(request.auth.isAuthenticated) {
        if(request.query.target) {
            return reply.redirect(request.query.target);
        }
        return reply.redirect('/dashboard');
    }
    reply.view('views/login');
}

AuthController.loginpost = function (request, reply) {

    const vResult = Validation.checkLogin(request.payload);

    if(vResult.error) {
        return reply.view('views/login', Validation.buildContext(request, "login_failed", vResult.error));
    }

    var email = request.payload.email;
    var password = request.payload.password;

    User.findOne( {email: email}, (error, user) => {
        if(error || !user) {
            return reply.view('views/login', Validation.buildContext(request, "login_failed"));
        }

        Bcrypt.compare(password, user.password, (error, same) => {
            if(error || !same) {
                return reply.view('views/login', Validation.buildContext(request, "login_failed"));
            }

            //here the user had successfully entered credentials
            //let create a token
            const token = jwt.sign({
                    user: user
                }, 
                config.get('Jwt.key'),
                {
                    algorithm: 'HS256',
                    expiresIn: '12h',
                }
            );
            user.apiaccesstoken = token;
            user.save(function(err){
                if(err) {
                    return reply(Boom.internal());
                }

                var target = '/dashboard';
                if(request.payload.target) {
                    target = request.payload.target;
                }
                reply().state('access_token', token, cookie_options).redirect(target);
            });
        });
    });
}

AuthController.logout = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne( {email: email}, (error, user) => {
        if(error) {
            reply(Boom.unauthorized());
            return;
        }
        
        if(!user) {
            reply(Boom.notFound());
            return;
        }

        user.apiaccesstoken = "";
        user.save(function(err) {
            if(err) {
                return reply(Boom.internal());
            }
            return reply().unstate('access_token', cookie_options).redirect('/');
        });
    });
}

function buildRoleContext(predefinedRole, i18n) {
    var ctx = {roles: []};

    var roleKeys = Object.keys(Constants.UserRoleEnum);
    for(var i=0; i<roleKeys.length; ++i) {
        var role = Constants.UserRoleEnum[roleKeys[i]];
        ctx.roles.push(
            {id: role, name: i18n.__(role)}
        );
    };

    var match = false;
    for(var i=0; i<ctx.roles.length;++i) {
        match = ctx.roles[i].id == predefinedRole;
        ctx.roles[i].selected = match;
        if(match) {
            break;
        }
    }
    if(!match && ctx.roles.length > 1) {
        ctx.roles[1].selected = true;
    }

    return ctx;
}

AuthController.registerget = function(request, reply) {

    var ctx = buildRoleContext(request.params.role, request.i18n);
    reply.view('views/register', ctx);
}

AuthController.registerpost = function(request, reply) {

    const vResult = Validation.checkRegister(request.payload);
    var roleContext = buildRoleContext(request.payload.role, request.i18n);
    
    if(vResult.error) {
        return reply.view('views/register', Validation.buildContext(request, "register_failed", vResult.error, roleContext));
    }

    var first = request.payload.firstname;
    var last = request.payload.lastname;
    
    var email = request.payload.email;
    var p1 = request.payload.password1;
    var p2 = request.payload.password2;

    var role = request.payload.role;
 
    var establishment = request.payload.establishment;

    User.findOne({email: email}, 
        (error, result) => {
            if(result && result.email == email) {
                return reply.view('views/register', Validation.buildContext(request, "register_failed_already_exists", null, roleContext));
            }

            Bcrypt.hash(p1, 10,
                (err, encrypted) => {
                    if(err) {
                        return reply.view('views/register', Validation.buildContext(request, "generic_error", null, roleContext));
                    }
                    var u = new User();
                    u.firstName = first;
                    u.lastName = last;
                    u.email = email;
                    u.password = encrypted;
                    u.establishment = establishment;
                    u.role = role;
                    u.save(
                        (error, user) => {
                            if(error) {
                                return reply.view('views/register', Validation.buildContext(request, "generic_error", null, roleContext));
                            }
                            
                            var mailer = new Mailer();
                            var ctx = request.i18n;
                            ctx.user = u;
                            var path = '/auth/login';
                            if(request.payload.target) {
                                path = '/auth/login?email='+encodeURIComponent(u.email)+'&target=' + encodeURIComponent(request.payload.target);
                            }

                            ctx.url = getUrl(request, path);
                            
                            request.server.render('mails/welcome', ctx, { layoutPath: './templates/mails/layout', }, 
                                (error, html, config) => {
                                    Hoek.assert(!error, error);

                                    if(!error) {
                                        var subject = request.i18n.__("game_title");
                                        var text = request.i18n.__("welcome_new_user_mail");

                                        mailer.sendMail(u.email, subject, text, html);
                                        mailer.destroy();
                                    }
                                    
                                    if(request.payload.target) {
                                        //maybe the user was invited to join a game?
                                        if(request.payload.target.startsWith('/game/start/')) {
                                            //get channel id
                                            var splitted = request.payload.target.split('/');
                                            var chanId = splitted[3];
                                            Channel.findById(chanId).populate('users.user invitesOfNonUsers').exec((error, channel) => {
                                                if(error) {
                                                    return reply(Boom.internal());
                                                }
                                                if(!channel) {
                                                    return reply(Boom.badRequest());
                                                }

                                                channel.users.push({
                                                    user: u.id,
                                                    phaseResult: null 
                                                });

                                                //find associated invite to remove it
                                                for(var i=0;i<channel.invitesOfNonUsers.length;++i) {
                                                    var iEmail = channel.invitesOfNonUsers[i].email;
                                                    if(iEmail == u.email || iEmail == request.payload.srcEmail) {
                                                        channel.invitesOfNonUsers.splice(i, 1);
                                                        break;
                                                    }
                                                }

                                                channel.save((error, saveResult) => {
                                                    if(error) {
                                                        return reply(Boom.internal());
                                                    }
                                                    return reply.redirect(path);
                                                });
                                            });
                                        }
                                    } else {
                                        return reply.redirect(path);
                                    }
                                }
                            );
                    });
                }
            );
        }
    );
}

AuthController.lostpasswordget = function(request, reply) {
    reply.view('views/lostpassword');
}

AuthController.lostpasswordpost = function(request, reply) {
    
    var vResult = Validation.checkLostPassword(request.payload);

    if(vResult.error) {
        return reply.view('views/lostpassword', Validation.buildContext(request, "lostpassword_invalid_mail", vResult.error));
    }

    var email = request.payload.email;

    User.findOne({email: email},
        (error, user) => {
            if(error || !user) {
                return reply.view('views/lostpassword', Validation.buildContext(request, "lostpassword_unknown_mail"));
            }

            crypto.randomBytes(20,
                (error, buffer) => {
                    if(error){
                        return reply.view('views/lostpassword', Validation.buildContext(request, "generic_error"));
                    }
                    var token = buffer.toString('hex');
                    user.resetpasswordtoken = token;
                    user.save(
                        (error, user) => {
                            if(error) {
                                return reply.view('views/lostpassword', Validation.buildContext(request, "generic_error"));
                            }

                            var subject = request.i18n.__("game_title");
                            var text = request.i18n.__("lost_password_message");

                            var mailer = new Mailer();
                            var ctx = request.i18n;
                            ctx.user = user;
                            ctx.url = getUrl(request, "/auth/resetpassword/" + token);
                            ctx.preheader_text = text;

                            request.server.render('mails/lostpassword', ctx, { layoutPath: './templates/mails/layout', }, 
                                (error, html, config) => {
                                    Hoek.assert(!error, error);

                                    mailer.sendMail(user.email, subject, text, html);
                                    mailer.destroy();

                                    reply.view('views/lostpassword', {user: user});
                                }
                            );
                        }
                    );
                }
            )
        }
    );
}

AuthController.resetpasswordget = function(request, reply) {
    var token = request.params.token;
    User.findOne({resetpasswordtoken: token},
        (error, result) => {
            if(error || !result) {
                return reply.view('views/resetpassword', Validation.buildContext(request, "reset_password_invalid_token"));
            }
            reply.view('views/resetpassword', {token:token});
        }
    );
}

AuthController.resetpasswordpost = function(request, reply) {

    var vResult = Validation.checkResetPassword(request.payload);

    if(vResult.error) {
        return reply.view('views/resetpassword', Validation.buildContext(request, "reset_password_mismatch", vResult.error));
    }

    var token = request.payload.token;
    var p1 = request.payload.password1;
    var p2 = request.payload.password2;

    User.findOne({resetpasswordtoken: token},
        (error, result) => {
            if(error || !result) {
                return reply.view('views/resetpassword', Validation.buildContext(request, "reset_password_invalid_token"));
            }
            
            Bcrypt.hash(p1, 10,
                (err, encrypted) => {
                    if(err) {
                        return reply.view('views/resetpassword', Validation.buildContext(request, "generic_error"));
                    }

                    result.resetpasswordtoken = null;
                    result.password = encrypted;
                    result.save(
                        (error, user) => {
                            if(error) {
                                return reply.view('views/resetpassword', Validation.buildContext(request, "reset_password_invalid_token"));
                            }
                            
                            reply.view('views/resetpassword', {user: result});
                    });
                }
            );
        }
    );
}

module.exports = AuthController;

