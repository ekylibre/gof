'use strict';

const Boom = require('boom');
const mongoose = require('mongoose');
const Joi = require('joi');
var User = require('../models/user');
const Bcrypt = require('bcrypt');

module.exports = {
    get_index : function(request, reply)
    {
        reply.view('views/index', {title: 'Game Of Farms'});
    },

    new_user : function(request, reply)
    {
        var u = new User();
        u.firstName = request.params.firstName;
        u.lastName = request.params.lastName;
        u.email = request.params.email;
        u.password = request.params.password;
        Bcrypt.hash(request.params.password, 10, 
            (err, encrypted) => {
                if(err) {
                    reply(err);
                }
                else{
                    u.password = encrypted;
                    u.save(
                        (error, user) => {
                            if(error) {
                                Boom.badRequest();
                            }
                            else{
                                reply.view('views/welcome', {user: u});
                            }

                    });
                }
            }
        );
    },
};