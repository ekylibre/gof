
import UIPopupBase from 'UIPopupBase'
import CParcel from 'Parcel'
import UIParcelHistoryItem from 'UIParcelHistoryItem'

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
            
            this.parcelSurface.string = i18n.t(
                'surfaceHectare',
                {
                    'val': this._parcel.surface.toString()
                });
            
            // history
            for (var i=this._parcel.rotationHistory.length-1; i>=0; i--)
            {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(histContent);

                var h = hPrefab.getComponent(UIParcelHistoryItem);                
                h.init(-(i+1), this._parcel.rotationHistory[i], false);
            }

            // previsions
            for (var i=0; i<this._parcel.rotationPrevision.length; i++)
            {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(prevContent);

                var h = hPrefab.getComponent(UIParcelHistoryItem);                
                h.init(i, this._parcel.rotationPrevision[i], true);
            }

            this.addEmptyPrevision();

            this.historyScrollView.scrollToRight();
            this.previsionScrollView.scrollToLeft();
        }

    },

    addEmptyPrevision: function()
    {
        if (this._parcel.rotationPrevision.length < 5)
        {
            var hPrefab = cc.instantiate(this.plantPrefab);
            hPrefab.setParent(this.previsionScrollView.content);

            var h = hPrefab.getComponent(UIParcelHistoryItem);                
            h.init(this._parcel.rotationPrevision.length);
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
