
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

        /**
         * The main button
         */
        btOpen:
        {
            default: null,
            type: cc.Button
        },

        /**
         * Main button highlight
         */
        highlight:
        {
            default: null,
            type: cc.Node
        },

        /**
         * Main button highlight anim component
         * @private
         */
        _hlAnim:
        {
            default: null,
            type: cc.Animation,
            visible: false,
        },

        /**
         * Main button particles (growing after the hl)
         */
        fxParticles:
        {
            default: null,
            type: cc.ParticleSystem
        },


        /**
         * True if button is currently animated
         * @private
         */
        _isAnimated:
        {
            default: false,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function () {
        UIEnv.questMenu = this;
        this._hlAnim = this.highlight.getComponent(cc.Animation);
        this.highlight.active = false;
        this.fxParticles.stopSystem();
        this._isAnimated = false;
        this.btOpen.interactable = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt)
    {
        if (game.state < CGame.State.PHASE_RUN)
        {
            return;
        }

        this.btOpen.interactable = game.state < CGame.State.PHASE_SCORE &&
            UIEnv.questInfo != null && !UIEnv.questInfo.isShown;

        var animate = this.btOpen.interactable && game.phaseCanFinish();
        if (animate != this._isAnimated)
        {
            if (animate)
            {
                this.highlight.active = true;               
                this._hlAnim.play();
                this.fxParticles.resetSystem();
            }
            else
            {
                this._hlAnim.stop();
                this.fxParticles.stopSystem();
                this.highlight.active = false;               
            }

            this._isAnimated = animate;
        }
    },

    onBtOpen: function()
    {
        UIEnv.questInfo.show();
    }
});

module.exports = UIQuestMenu;
