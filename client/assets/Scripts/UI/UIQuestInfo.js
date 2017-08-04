

const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');

var UIQuestInfo = cc.Class({
    extends: cc.UIPopupBase,

    properties: {
        lbDescription:
        {
            default: null,
            type: cc.Label
        },
    },

    statics:
    {
        instance: null
    },

    
    // use this for initialization
    onLoad: function () {
        UIQuestInfo.instance = this;
        UIEnv.speciesSelect = this;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
