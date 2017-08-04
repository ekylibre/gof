

const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');
const CGame = require('../Game');

var UIQuestInfo = cc.Class({
    extends: cc.UIPopupBase,

    properties: {
        /**
         * the label containing the objective description
         */
        lbDescription:
        {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        lbCompletion:
        {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        btValidate:
        {
            default: null,
            type: cc.Button
        }
    },

    statics:
    {
        instance: null
    },

    
    // use this for initialization
    onLoad: function () {
        UIQuestInfo.instance = this;
        UIEnv.questInfo = this;

    },

    onShow: function()
    {
        var game = new CGame();

        if (game.phase != null)
        {
            
            //var completion = 
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
