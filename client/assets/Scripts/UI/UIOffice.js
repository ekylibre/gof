
const UIPopupBase = require('./UIPopupBase');
const CGame = require('../Game');
const UIEnv = require('./UIEnv');

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

        farmName:
        {
            default: null,
            type: cc.Label
        },

        totalSurface:
        {
            default: null,
            type: cc.Label
        },

        nbParcels:
        {
            default: null,
            type: cc.Label
        },
    },

    statics:
    {
        instance: null,
    },

    // use this for initialization
    onLoad: function () {

        UIOffice.instance = this;
        UIEnv.office = this;
        this.initPopup();
    },

    onShow: function()
    {
        var game = new CGame();
        var name = game.farm.name;
        if (name === undefined)
        {
            name = i18n.t('farm_default_name');
        }

        this.farmName.string = name;
        this.totalSurface.string = i18n.t('surface_hectare', {'val': game.farm.totalSurface});
        this.nbParcels.string = game.farm.parcels.length.toString();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },

    onBtClose: function()
    {
        this.hide();
    }

});
