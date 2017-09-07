
const UIPopupBase = require('./UIPopupBase');
const CParcel = require('../Parcel');
const UIParcelHistoryItem = require('./UIParcelHistoryItem');
const CGame = require('../Game');
const UIEnv = require('./UIEnv');

const i18n = require('LanguageData');

var game = new CGame();
        
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

        parcelGroundType:
        {
            default: null,
            type: cc.Label,                     
        },

        parcelSurface:
        {
            default: null,
            type: cc.Label,
        },

        historyScrollView:
        {
            default: null,
            type: cc.ScrollView
        },

        previsionScrollView:
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
                    
                }
                if (!this._hidden)
                {
                    this.onShow();
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

        UIEnv.parcel = this;
    },

    show: function() 
    {
        UIEnv.office.hide();
        this.showPopup();
    },

    onShow: function()
    {
        //historyScrollView.scrollToOffset(cc.v2(,0));
        var histContent  = this.historyScrollView.content;
        histContent.removeAllChildren(true);
        var prevContent = this.previsionScrollView.content;
        prevContent.removeAllChildren(true);

        if (this._parcel != null)
        {
            this.parcelName.string = this._parcel.name;
            this.parcelGroundType.string = i18n.t('terrain_type_clay').toUpperCase();
            
            this.parcelSurface.string = i18n.t(
                'surface_hectare',
                {
                    'val': this._parcel.surface.toString()
                });
            
            // rotation history
            for (var i=this._parcel.rotationHistory.length-1; i>=0; i--)
            {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(histContent);

                var h = hPrefab.getComponent(UIParcelHistoryItem);
                h.initCulture(this._parcel, -(i+1), this._parcel.rotationHistory[i], false);
            }

            // rotation previsions
            this.updateRotationPrevisions();

            this.historyScrollView.scrollToRight();
            this.previsionScrollView.scrollToLeft();
        }

    },

    updateRotationPrevisions: function()
    {
        var prevContent = this.previsionScrollView.content;
        prevContent.removeAllChildren(true);

        // previsions
        for (var i=0; i<this._parcel.rotationPrevision.length; i++)
        {
            var hPrefab = cc.instantiate(this.plantPrefab);
            hPrefab.setParent(prevContent);

            var h = hPrefab.getComponent(UIParcelHistoryItem);                
            h.initCulture(this._parcel, i, this._parcel.rotationPrevision[i], true);
        }

        this.addEmptyPrevision();
        
    },

    addEmptyPrevision: function()
    {
        if (game.phase != null)
        {
            if (this._parcel.rotationPrevision.length < game.phase.maxPrevisions)
            {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(this.previsionScrollView.content);

                var h = hPrefab.getComponent(UIParcelHistoryItem);                
                h.initCulture(this._parcel, this._parcel.rotationPrevision.length);
            }
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

module.exports = UIParcel;