const Constants = require('../../../common/constants');
const Joi = require('joi');
const Hoek = require('hoek');

module.exports = {

    buildContext : function(request, globalMsgId, joiError, mergeCtx) {
        var error = {
            form: {}
        };

        var ctx = mergeCtx || {};

        var keys = Object.keys(request.payload);
        keys.forEach(function(k){
            error.form[k] = request.payload[k];
            ctx[k] = request.payload[k];
        });

        if(joiError){
            error.faults = {};
            joiError.details.forEach(function(detail){
                error.faults[detail.context.key] = {};
            });
        }

        error.global = request.i18n.__(globalMsgId, {error: error});

        

        ctx.error = error;

        return ctx;
    },


    checkLogin : function(payload) {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            target: Joi.string(),
        });

        return Joi.validate(payload, schema);
    },

    checkRegister : function(payload) {
        const schema = Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email().required(),
            password1: Joi.string().min(6).max(12).required(),
            password2: Joi.any().valid(Joi.ref('password1')).required(),
            role: Joi.string().valid(
                Constants.UserRoleEnum.MASTER, 
                Constants.UserRoleEnum.STUDENT, 
                Constants.UserRoleEnum.PROFESSIONAL, 
                Constants.UserRoleEnum.OTHER).required(),
            establishment: Joi.string(),
            target: Joi.string(),
            srcEmail: Joi.string().email(),
        });

        return Joi.validate(payload, schema);
    },

    checkLostPassword: function(payload) {
        const schema = Joi.object().keys({
            email: Joi.string().email().required()
        });

        return Joi.validate(payload, schema)
    },

    checkResetPassword: function(payload) {
        const schema = Joi.object().keys({
            token: Joi.string().required(),
            password1: Joi.string().min(6).max(12).required(),
            password2: Joi.any().valid(Joi.ref('password1')).required()
        });

        return Joi.validate(payload, schema);
    }

};