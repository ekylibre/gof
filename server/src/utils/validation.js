const Joi = require('joi');

module.exports = {

    buildFormError : function(globalMsg, payload, joiError) {
        var error = {
            global: globalMsg,
            form: {}
        };

        var keys = Object.keys(payload);
        keys.forEach(function(k){
            error.form[k] = payload[k];
        });

        if(joiError){
            error.faults = {};
            joiError.details.forEach(function(detail){
                error.faults[detail.context.key] = {};
            });
        }

        return error;
    },


    checkLogin : function(payload) {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        return Joi.validate(payload, schema);
    },

    checkRegister : function(payload) {
        const schema = Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email().required(),
            password1: Joi.string().min(6).max(12),
            password2: Joi.any().valid(Joi.ref('password1')).required()
        });

        return Joi.validate(payload, schema);
    }

};