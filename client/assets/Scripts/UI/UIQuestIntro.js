const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');
const CGame = require('../Game');

var game = new CGame();

/**
 * UI controller for the mission introduction popup
 * @name UIQuestIntro
 * @class
 */
var UIQuestIntro = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIQuestIntro'
    },

    properties:
    {
        /**
         * Back button locking the inputs
         */
        bgLock:
        {
            default: null,
            type: cc.Node
        },

        /**
         * The popup
         */
        popup:
        {
            default: null,
            type: cc.Node,
        },

        /**
         * the label containing the objective description
         */
        lbDescription:
        {
            default: null,
            type: cc.Label
        },

        /**
         * Is the popup hidden?
         */
        _hidden:
        {
            default: true,
            visible: false
        },

    },

    // use this for initialization
    onLoad: function () {
        UIEnv.questIntro = this;
        this.bgLock.active = false;

        this._from = this.From;
        this._hidden = true;
        this._defaultX = this.popup.x;
        this._defaultY = this.popup.y;
        this.popup.active = false;
    },

    show: function()
    {
        if (game.phase != null)
        {
            this.lbDescription.string = game.phaseGetIntroText();
        }
        this.bgLock.active = true;
        this.popup.active = true;
        this.popup.x = this._defaultX;
        this.popup.y = this._defaultY;
        this._hidden = false;     
    },

    hide: function()
    {
        this.bgLock.active = false;
        this.hidePopup();
    },


    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hidePopup: function(instant)
    {
        if (!this._hidden)
        {
            this.popup.stopAllActions();

            var cvw = cc.Canvas.instance.node.width;
            var cvh = cc.Canvas.instance.node.height;

            var to = new cc.Vec2(this._defaultX, this._defaultY);
            to.y = cvh;

            if (!instant)
            {
                this.popup.runAction(cc.moveTo(0.2, to));
            }
            else
            {
                this.popup.x = to.x;
                this.popup.y = to.y;
            }

            this._hidden = true;       
        }
    },    

    onBtStart: function()
    {       
        game.phaseStart();
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UIQuestIntro;