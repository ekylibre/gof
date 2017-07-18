'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Bcrypt = require('bcrypt');

module.exports = {
    get_index : function(request, reply)
    {
        reply.view('views/index', {title: 'Game Of Farms'});
    },

    new_user : function(request, reply)
    {
        //validation schema of request params
        const schema = {
            _id: Joi.any(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }

        const db = request.mongo.db;
        const ObjectID = request.mongo.ObjectID;

        var u = new User();
        u._id = new ObjectID();
        
        u.firstName = request.params.firstName;
        u.lastName = request.params.lastName;
        u.email = request.params.email;
        u.password = request.params.password;

        Joi.validate(u, schema,
            function (err, value) {
                if(err)
                {
                    reply.view('views/validationerror', {error: err, value: value});
                }
                else
                {
                    Bcrypt.hash(request.params.password, 10, 
                        (err, encrypted) => {
                            if(err)
                            {
                                reply.view('views/validationerror', null);
                            }
                            else
                            {
                                u.password = encrypted;
                                db.collection("user").save(u);
                                reply.view('views/welcome', {user: u});
                            }
                        }
                    );
                    
                }
            }
        )
        
    },
};