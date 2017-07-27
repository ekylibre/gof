
import UIPopupBase from 'UIPopupBase'
import CParcel from 'Parcel'

const i18n = require('LanguageData');

/**
 * Parcel UI controller
 * @class
 * @name UIParcel
 */
var UIParcel = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIParcel'
    },

    properties: {
        parcelName:
        {
            default: null,
            type: cc.Label,
        },

        historyScrollView:
        {
            default: null,
            type: cc.ScrollView
        },

        plantPrefab:
        {
            default: null,
            type: cc.Prefab
        },


        /**
         * @property {CParcel} parcel The target parcel
         */
        parcel:
        {
            visible: false,
            get: function()
            {
                return this._parcel;
            },
            set: function(_value)
            {
                this._parcel = _value;
                if (this._parcel != null && this.parcelName != null)
                {
                    this.parcelName.string = this._parcel.name;
                }
            },
            type: CParcel
        },         
    },

    statics:
    {
        instance: null,
    },    

    /**
     * The target parcel
     * @private
     */
    _parcel: null,

    // use this for initialization
    onLoad: function () {
        UIParcel.instance = this;
        this.initPopup();
    },

    onShow: function()
    {
        if (this.parcel != null)
        {
            var histContent  = this.historyScrollView.content;
            histContent.removeAllChildren(true);
            //////////TODO
            /**
             * @todo FINIR
             */
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBtClose: function()
    {
        this.hide();
    },
});
