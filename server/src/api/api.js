'use strict';

const Boom = require('boom');
const config = require('config');
const Hoek = require('hoek');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Plant = require('../models/plant');
const User = require('../models/user');
const Additive = require('../models/additive');
const Equipment = require('../models/equipment');
const Rotation = require('../models/rotation');
const Tool = require('../models/tool');

function Auth(server) {

    var self = this;

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

                reply({statusCode: 200, payload: { user: user}});
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
                        return reply({statusCode: 200, payload: {accessToken: token}});
                    }
                );
            }
        );
    };

    this.defaultGetModel = function(model, request, reply) {
        
        var id = request.params.id;
        if(id) {
            model.findById(id).exec(
                (error, result) => {
                    if(error) {
                        return reply(Boom.serverUnavailable('Database error!', error));
                    }
                    if(!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(result);
                }
            );
        } else {
            var queryKeys = Object.keys(request.query);
            if(queryKeys.length) {
                var filter = {};
                var fields = model.schema.paths;
                queryKeys.forEach(function(k){
                    if(fields[k]) {
                        filter[k] = request.query[k];
                    }
                });

                model.find(filter).exec(
                    (error, results) => {
                        if(error) {
                            return reply(Boom.serverUnavailable('Database error!', error));
                        }
                        if(!results) {
                            return reply(Boom.notFound());
                        }
                        return reply(results);
                    }
                );
            } else {
                model.find().exec(
                    (error, results) => {
                        if(error) {
                            return reply(Boom.serverUnavailable('Database error!', error));
                        }
                        if(!results) {
                            return reply(Boom.notFound());
                        }
                        return reply(results);
                    }
                );
            }
        }
    }

    this.getPlants = function(request, reply) {
        self.defaultGetModel(Plant, request, reply);
    }

    this.getTools = function(request, reply) {
        self.defaultGetModel(Tool, request, reply);
    }

    this.getEquipments = function(request, reply) {
        self.defaultGetModel(Equipment, request, reply);
    }

    this.getRotations = function(request, reply) {
        self.defaultGetModel(Rotation, request, reply);
    }

    this.getAdditives = function(request, reply) {
        self.defaultGetModel(Additive, request, reply);
    }

    var CORS = false;

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

    server.route({
        method:'GET',
        path: '/api/plants/{id?}',
        handler: this.getPlants/*,
        config: {
            auth : 'bearer',
            cors : CORS
        }*/
    });

    server.route({
        method:'GET',
        path: '/api/additives/{id?}',
        handler: this.getAdditives/*,
        config: {
            auth : 'bearer',
            cors : CORS
        }*/
    });

    server.route({
        method:'GET',
        path: '/api/tools/{id?}',
        handler: this.getTools/*,
        config: {
            auth : 'bearer',
            cors : CORS
        }*/
    });

    server.route({
        method:'GET',
        path: '/api/equipments/{id?}',
        handler: this.getEquipments/*,
        config: {
            auth : 'bearer',
            cors : CORS
        }*/
    });

    server.route({
        method:'GET',
        path: '/api/rotations/{id?}',
        handler: this.getRotations/*,
        config: {
            auth : 'bearer',
            cors : CORS
        }*/
    });
}

function Api(server) {
    this.Auth = new Auth(server);
}

module.exports = Api;