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

        _lbOk:
        {
            default: null,
            type: cc.Label,
            visible: false
        },

        btYes:
        {
            default: null,
            type: cc.Button
        },

        _lbYes:
        {
            default: null,
            type: cc.Label,
            visible: false
        },


        btNo:
        {
            default: null,
            type: cc.Button
        },

        _lbNo:
        {
            default: null,
            type: cc.Label,
            visible: false
        },
    },

    statics:
    {
        YES_NO:
        {
            buttons: 'yes_no'
        },
        OK_CANCEL:
        {
            buttons: 'ok_cancel'
        }
    },

    _messagesOptions: null,


    // use this for initialization
    onLoad: function()
    {
        UIEnv.message = this;
        this.initPopup();

        this._lbOk = this.btOk.node.getComponentInChildren(cc.Label);
        this._lbYes = this.btYes.node.getComponentInChildren(cc.Label);
        this._lbNo = this.btNo.node.getComponentInChildren(cc.Label);

        this._lbOk.string = i18n.t('ok').toUpperCase();
    },

    /**
     * Shows the specified message
     * Existing options:
     *  - buttons: {String}         'yes_no', 'ok_cancel', 'ok', 'none' (default: 'ok')
     *  - onOk: {Function}          called when user press the ok or yes button
     *  - onCancel: {Function}      called when user press the no button
     *  - self: {Object}            passed as parameter to the callbacks onOk and onCancel
     * @param {String} _Text: the message
     * @param {String} _Title: the title
     * @param {Object} _Options: options dictionary
     * @example show('My text', 'My title', {buttons: 'yes_no', onOk: function() {cc.log('YES pressed');}, onCancel: function(){cc.log('NO pressed');}})
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

        if (this._messagesOptions != null)
        {
            this.btOk.node.active = this._messagesOptions.buttons == undefined || this._messagesOptions.buttons == 'ok';
            this.btYes.node.active = this._messagesOptions.buttons == 'yes_no' || this._messagesOptions.buttons == 'ok_cancel';
            this.btNo.node.active = this.btYes.node.active;
            this._lbYes.string = this._messagesOptions.buttons == 'yes_no' ? i18n.t('yes').toUpperCase() : i18n.t('ok').toUpperCase();
            this._lbNo.string = this._messagesOptions.buttons == 'yes_no' ? i18n.t('no').toUpperCase() : i18n.t('cancel').toUpperCase();
        }
        else
        {
            this.btOk.node.active = true;
            this.btYes.node.active = false;
            this.btNo.node.active = false;
        }

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