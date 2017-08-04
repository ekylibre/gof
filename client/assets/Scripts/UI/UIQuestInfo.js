

const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');
const CGame = require('../Game');

var game = new CGame();

/**
 * UI controller of the "quest" popup
 * @class
 * @name UIQuestInfo
 */
var UIQuestInfo = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIQuestInfo'
    },

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
        this.initPopup();
    },

    onShow: function()
    {
        if (game.phase != null)
        {
            this.lbDescription.string = game.phaseGetIntroText();
            this.lbCompletion.string = game.phaseGetCompletionStr();

            this.btValidate.interactable = game.phaseCanFinish();
        }
    },

    
    onBtValidate: function()
    {
        cc.error('TODO: Score');
        if (game.phaseCanFinish())
        {
        }
    },

    onBtClose: function()
    {
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UIQuestInfo;