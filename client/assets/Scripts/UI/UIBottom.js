
const i18n = require('LanguageData');
const UIEnv = require('./UIEnv');
const UIMessage = require('./UIMessage');

var UIBottom = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIBottom'
    },

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtQuit: function() {
        UIEnv.message.show(
            i18n.t('exit_confirmation'),
            undefined,
            {
                buttons: 'yes_no',
                onOk: function() {location.pathname = '/dashboard';}
            }
        );
    },


});
