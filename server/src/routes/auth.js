'use strict';

const Joi = require('joi');
const User = require('../models/user.js');
const Bcrypt = require('bcrypt');

function Auth(server) {
    server.route({
        method: ['GET', 'POST'],
        path: '/auth/login/{email}/{password}',
        handler: Auth.login
    });
}

Auth.login = function (request, reply) {

    var email = request.params.email;

    var db = request.mongo.db;

    db.collection('user').findOne({email: email},
        (error, result) => {
            if(error)
            {
                reply.error("unknown login");
            }
            else
            {
                reply.view('views/welcome', {user: result});
            }
        }
    );

    var password = request.params.password;
}

module.exports = Auth;

