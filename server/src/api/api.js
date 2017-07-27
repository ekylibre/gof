'use strict';

const Boom = require('boom');
const config = require('config');
const Hoek = require('hoek');

const User = require('../models/user');

function Auth(server) {

    this.check = function(request, reply) {
        var email = request.auth.credentials.email;
        User.findOne( {email: email}).select('-password -resetpasswordtoken').exec(
            (error, user) => {
                if(error) {
                    return Boom.badRequest();
                }
                
                if(!user) {
                    return Boom.unauthorized();
                }

                reply(user);
            }
        );
    }


    server.route({
        method: 'GET',
        path: '/api/auth/check',
        handler: this.check,
        config: {
            auth: 'token'
        }
    });
}

function Api(server) {
    
    this.Auth = new Auth(server);
    

}

module.exports = Api;