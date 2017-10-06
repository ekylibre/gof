'use strict';

var fs = require('fs');
const Boom = require('boom');
const config = require('config');
const Hoek = require('hoek');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Activity = require('../models/activity');
const User = require('../models/user');
const Additive = require('../models/additive');
const Equipment = require('../models/equipment');
const Rotation = require('../models/rotation');
const Tool = require('../models/tool');

const ApiChannels = require('./api.channels');

var CORS = false;
if(process.env.NODE_ENV !== 'production') {
    //accept Cross Origin Resource Sharing when in dev
    CORS = {
        origin : ['*']
    };
}

var Auth = function(server) {

    var self = this;

    server.route({
        method: 'GET',
        path: '/api/auth/check',
        handler: function(request, reply) { self.check(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method: 'POST',
        path: '/api/auth/login',
        handler: function(request, reply) { self.login(request, reply); },
        config: {
            cors : CORS
        }
    });

    server.route({
        method:'GET',
        path: '/api/activities/{id?}',
        handler: function(request, reply) { self.getActivities(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method:'GET',
        path: '/api/additives/{id?}',
        handler: function(request, reply) { self.getAdditives(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method:'GET',
        path: '/api/tools/{id?}',
        handler: function(request, reply) { self.getTools(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method:'GET',
        path: '/api/equipments/{id?}',
        handler: function(request, reply) { self.getEquipments(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });

    server.route({
        method:'GET',
        path: '/api/rotations/{id?}',
        handler: function(request, reply) { self.getRotations(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });
}

Auth.prototype.check = function(request, reply) {
    var email = request.auth.credentials.user.email;
    User.findOne( {email: email}).select('-password -resetpasswordtoken').exec(
        (error, user) => {
            if(error) {
                return reply(Boom.badRequest());
            }
            
            if(!user) {
                return reply(Boom.unauthorized());
            }
            var hToken = request.headers.authorization;
            hToken = hToken.replace('Bearer ', '');

            if(user.apiaccesstoken !== hToken) {
                return reply(Boom.unauthorized());
            }
            reply({statusCode: 200, payload: { user: user}});
        }
    );
};

Auth.prototype.login = function(request, reply) {
    var email = request.payload.email;
    var password = request.payload.password;

    User.findOne({email:email}, (error, user) => {
        if(error) {
            return reply(Boom.badRequest());
        }

        if(!user) {
            return reply(Boom.unauthorized());
        }

        Bcrypt.compare(password, user.password, (error, same) => {
            if(error) {
                return reply(Boom.internal());
            }
            if(!same) {
                return reply(Boom.unauthorized());
            }
            const token = jwt.sign({
                    user: {
                        _id : user._id,
                        email : user.email,
                        role : user.role,
                        firstName : user.firstName,
                        lastName : user.lastName
                    }
                }, 
                config.get('Jwt.key'),
                {
                    algorithm: 'HS256',
                    expiresIn: '12h',
                }
            );

            user.apiaccesstoken = token;
            user.save(function(err) {
                if(err) {
                    return reply(Boom.internal());
                }
                return reply({statusCode: 200, payload: {accessToken: token}});
            });
        });
    });
};

Auth.prototype.defaultGetModel = function(model, request, reply) {
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
            queryKeys.forEach(function(k) {
                if(fields[k]) {
                    filter[k] = request.query[k];
                }
            });

            model.find(filter).exec((error, results) => {
                if(error) {
                    return reply(Boom.serverUnavailable('Database error!', error));
                }
                if(!results) {
                    return reply(Boom.notFound());
                }
                return reply(results);
            });
        } else {
            model.find().exec((error, results) => {
                if(error) {
                    return reply(Boom.serverUnavailable('Database error!', error));
                }
                if(!results) {
                    return reply(Boom.notFound());
                }
                return reply(results);
            });
        }
    }
}

Auth.prototype.getActivities = function(request, reply) {
    this.defaultGetModel(Activity, request, reply);
}

Auth.prototype.getTools = function(request, reply) {
    this.defaultGetModel(Tool, request, reply);
}

Auth.prototype.getEquipments = function(request, reply) {
    this.defaultGetModel(Equipment, request, reply);
}

Auth.prototype.getRotations = function(request, reply) {
    this.defaultGetModel(Rotation, request, reply);
}

Auth.prototype.getAdditives = function(request, reply) {
    this.defaultGetModel(Additive, request, reply);
}

/**
 * @class Scenario: api class to manage scenario
 * @param {*} server 
 */
function Scenario(server) {

    var self = this;

    server.route({
        method: 'GET',
        path: '/api/scenarios/{uid?}',
        handler: function(request, reply) { self.getScenarios(request, reply); },
        config: {
            auth : 'bearer',
            cors : CORS
        }
    });
}

Scenario.prototype.getScenarios = function(request, reply) {
    var uid = request.params.uid;
    var folder = './scenarios/';
    if(uid) {
        var fPath = folder + uid + '.json';
        fs.readFile(fPath, 'utf8', function(err,data) {
            if(err) {
                return reply(Boom.notFound());
            }
            return reply(data);
        });
    } else {
        fs.readdir(folder, {encoding: 'utf8'}, function(err, files) {
            if(err) {
                return reply(Boom.notFound());
            }
            var scenarios = files.filter( f => f.endsWith('.json'));
            return reply(scenarios.map(s => s.replace('.json', '')));
        });
    }
}


function Api(server) {
    this.Auth = new Auth(server);
    this.Scenario = new Scenario(server);
    this.Channels = new ApiChannels(server);
}

module.exports = Api;