const UIPopupBase = require('UIPopupBase');
const CGame = require('Game');
const UISpeciesSelItem = require('UISpeciesSelItem');

/**
 * UI controller for UISpeciesSelPopup popup
 * @class
 * @name UISpeciesSelPopup
 */
var UISpeciesSelPopup = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UISpeciesSelPopup'
    },    

    properties:
    {
        /**
         * @property {cc.Prefab} itemPrefab: the prefab used to created the items in the list
         */
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },

        /**
         * @property {cc.ScrollView} scrollView: the scrollview containing the species items
         */
        scrollView:
        {
            default: null,
            type: cc.ScrollView
        },

        /**
         * @private
         * @property {CParcel} _parcel: Currently modified parcel
         */
        _parcel:
        {
            default: null,
            visible: false,
        },

        /**
         * @property {Number} _previsionYear: Currently modified rotation prevision year
         */
        _previsionYear:
        {
            default: -1,
            visible: false
        },

    },

    statics:
    {
        /**
         * @property {UISpeciesSelPopup} instance: UISpeciesSelPopup unique instance
         * @static
         */
        instance: null,

        /**
         * @property {UIParcel} uiParcel: the UIParcel instance, to avoid circular dependencies
         * @static
         */
        uiParcel:
        {
            default: null,
            visible: false,
        },
        
    },

    // use this for initialization
    onLoad: function () {
        if (UISpeciesSelPopup.instance != null)
        {
            cc.error('An instance of UISpeciesSelPopup already exists');
        }
        UISpeciesSelPopup.instance = this;

        this.initPopup();
    },

    /**
     * @method
     * @param {CParcel} _Parcel: parcel to modify
     * @param {number} _Year: prevision year to modify (or -1 if new prevision)
     */
    show: function(_Parcel, _Year = -1)
    {
        this._parcel = _Parcel;
        this._previsionYear = _Year;

        this.showPopup();
    },

    // called by UIPopupBase
    onShow: function()
    {
        var game = new CGame();

        // get current selection (if any)
        var current = null;
        if (this._previsionYear>=0 && this._previsionYear<this._parcel.rotationPrevision.length)
        {
            current = this._parcel.rotationPrevision[this._previsionYear];            
        }

        var content = this.scrollView.content;
        content.removeAllChildren(true);
        
        // generates the plants items
        for (var i=0; i<game.plants.length; i++)
        {
            var prefab = cc.instantiate(this.itemPrefab);
            prefab.setParent(content);

            var s = prefab.getComponent('UISpeciesSelItem');
            s.plant = game.plants[i];
            s.selectionCallback = this.onItemSelection;
            s.validationCallback = this.onItemValidation;

            if (current !== null && current.species == s.plant.species)
            {
                // show current selection
                if (current.culture)
                {
                    s.cultureMode = current.culture;
                }
                s.isSelected = true;
            }
        }
    },

    // called by UIPopupBase
    onHide: function()
    {

    },

    onItemSelection: function(_Item)
    {
        var items = UISpeciesSelPopup.instance.scrollView.content.children;
        for (var i=0; i<items.length; i++)
        {
            var s = items[i].getComponent('UISpeciesSelItem');
            if (s.isSelected && _Item.plant !== s.plant)
            {
                s.isSelected = false;
            }
        }

    },

    onItemValidation: function(_Data)
    {
        var self = UISpeciesSelPopup.instance;
        if (self._previsionYear >=0 && self._previsionYear<self._parcel.rotationPrevision.length)
        {
            self._parcel.rotationPrevision[self._previsionYear] = _Data;
        }
        else
        {
            self._parcel.rotationPrevision.push(_Data);
        }

        UISpeciesSelPopup.uiParcel.updateRotationPrevisions();
        self.hide();
    },

    onBtClose: function()
    {
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UISpeciesSelPopup;