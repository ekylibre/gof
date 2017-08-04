
const CGame = require('../Game');
const UIEnv = require('./UIEnv');

var game = new CGame();

/**
 * The "quest" menu controller
 * @class
 * @name UIQuestMenu
 */
var UIQuestMenu = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIQuestMenu'
    },

    properties: {

        btOpen:
        {
            default: null,
            type: cc.Button
        },

    },

    // use this for initialization
    onLoad: function () {
        UIEnv.questMenu = this;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt)
    {
        this.btOpen.interactable = game.state >= CGame.State.PHASE_RUN && game.state < CGame.State.PHASE_SCORE &&
            UIEnv.questInfo != null && !UIEnv.questInfo.isShown;
    },

    onBtOpen: function()
    {
        UIEnv.questInfo.show();
    }
});

module.exports = UIQuestMenu;
