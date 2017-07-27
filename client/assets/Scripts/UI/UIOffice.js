
import UIPopupBase from 'UIPopupBase'
import CGame from 'Game'

const i18n = require('LanguageData');

var UIOffice = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIOffice'
    },
    properties: {

        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    statics:
    {
        instance: null,
    },

    // use this for initialization
    onLoad: function () {

        UIOffice.instance = this;
        this.initPopup();

        this._label = this.getComponentInChildren(cc.Label);
    },

    onShow: function()
    {
        var game = new CGame();
        var name = game.farm.name;
        if (name === undefined)
        {
            name = i18n.t('farmDefaultName');
        }

        var txt = name+'\n'+
            i18n.t('parcels')+' '+game.farm.parcels.length+'\n'+
            i18n.t('totalSurface', {'val': game.farm.totalSurface})+'\n';

        this._label.string = txt;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },

    onBtClose: function()
    {
        this.hide();
    }

});
