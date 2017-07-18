'use strict';

module.exports = {
    get_index : function(request, reply)
    {
        reply.view('index', {title: 'Game Of Farms'});
    },

};