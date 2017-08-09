const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');
const i18n = require('LanguageData');

/**
 * UI controller to display a modal message popup
 * @name UIMessage
 * @class
 */
var UIMessage = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIMessage'
    },

    properties:
    {
        bgLock:
        {
            default: null,
            type: cc.Node
        },

        lbTitle:
        {
            default: null,
            type: cc.Label,
        },

        lbMessage:
        {
            default: null,
            type: cc.Label
        },

        btOk:
        {
            default: null,
            type: cc.Button
        },

        btYes:
        {
            default: null,
            type: cc.Button
        },

        btNo:
        {
            default: null,
            type: cc.Button
        },      

    },

    _messagesOptions: null,

    // use this for initialization
    onLoad: function()
    {
        UIEnv.message = this;
        this.initPopup();
    },

    /**
     * Shows the specified message
     * Existing options:
     *  - noButtons: {Boolean}      if true, popup won't have buttons and can't be closed by user
     *  - onOk: {Function}          called when user press the ok or yes button
     *  - onCancel: {Function}      called when user press the no button
     *  - self: {Object}            passed as parameter to the callbacks onOk and onCancel
     * @param {String} _Text: the message
     * @param {String} _Title: the title
     * @param {Object} _Options: options dictionary
     */
    show: function(_Text, _Title, _Options)
    {
        if (_Title === undefined || _Title === null || _Title == '')
        {
            _Title = i18n.t('message').toUpperCase();
        }

        this.lbMessage.string = _Text;
        this.lbTitle.string = _Title;

        if (_Options != undefined)
        {
            this._messagesOptions = _Options;
        }
        else
        {
            this._messagesOptions = null;
        }

        this.bgLock.active = true;

        this.btOk.node.active = this._messagesOptions == null || !this._messagesOptions.noButtons;

        this.showPopup();
    },

    hide: function()
    {
        this.bgLock.active = false;
        this.hidePopup();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBtOk: function()
    {
        if (this._messagesOptions.onOk !== undefined)
        {
            this._messagesOptions.onOk(this._messagesOptions.self);
        }
        this.hide();
    },
    onBtYes: function()
    {
        if (this._messagesOptions.onOk !== undefined)
        {
            this._messagesOptions.onOk(this._messagesOptions.self);
        }
        this.hide();
    },
    onBtNo: function()
    {
        if (this._messagesOptions.onCancel !== undefined)
        {
            this._messagesOptions.onCancel(this._messagesOptions.self);
        }
        this.hide();
    },
});

module.exports = UIMessage;