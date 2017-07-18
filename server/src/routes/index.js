'use strict';

var User = require('../models/user.js')

module.exports = {
    get_index : function(request, reply)
    {
        reply.view('views/index', {title: 'Game Of Farms'});
    },

    new_user : function(request, reply)
    {
        const db = request.mongo.db;
        const ObjectID = request.mongo.ObjectID;

        var u = new User();
        u._id = new ObjectID();
        u.firstName = "Julien";
        u.lastName = "CASTETS";
        u.email = "castetsjulien@gmail.com";
        db.collection("user").save(u);
        reply.view('views/welcome', {user: u});
    },
};