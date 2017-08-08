const CParcel = require('../Parcel');
const UIParcel = require('./UIParcel')
const RscPreload = require('../RscPreload');

/**
 * Displays the parcel name and open its menu when clicked
 * @class
 * @name UIParcelButton
 */
cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIParcelButton'
    },

    properties: {

        parcelName:
        {
            default: null,
            type: cc.Label,
        },

        parcelSpecies:
        {
            default: null,
            type: cc.Sprite,
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

    /**
     * @private
     */
    _parcel: null,

    /**
     * @private
     */
    _species: null,

    // use this for initialization
    onLoad: function () {
        this.parcelSpecies.node.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt)
    {
        if (this._parcel != null)
        {
            var species = null;

            if (this._parcel.rotationPrevision.length > 0)
            {
                species = this._parcel.rotationPrevision[0].species;
            }

            if (species != this._species)
            {
                if (species != null)
                {
                    this.parcelSpecies.node.active = true;                    
                    this.parcelSpecies.spriteFrame = RscPreload.getPlantIcon(species);
                }
                else
                {
                    this.parcelSpecies.node.active = false;
                }

                this._species = species;
            }
        }
    },

    onButtonClick: function()
    {
        UIParcel.instance.parcel = this.parcel;
        UIParcel.instance.show();
    }
});
