
const CParcel = require('Parcel');
const CPlant = require('Plant');
const RscPreload = require('RscPreload');

const UISpeciesSelPopup = require('UISpeciesSelPopup');
const i18n = require('LanguageData');

var UIParcelHistoryItem = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIParcelHistoryItem'
    },

    properties: {
        iconSpecies:
        {
            default: null,
            type: cc.Sprite
        },

        lbSpecies:
        {
            default: null,
            type: cc.Label
        },

        lbCulture:
        {
            default: null,
            type: cc.Label
        },

        lbYear:
        {
            default: null,
            type: cc.Label
        },

        btAdd:
        {
            default: null,
            type: cc.Button
        },

        btEdit:
        {
            default: null,
            type: cc.Button
        },

        /**
         * @property {CParcel} parcel: current parcel
         */
        parcel:
        {
            default: null,
            visible: false,
            type: CParcel
        },

        year:
        {
            default: 0,
            visible: false,
        },
    },

    // use this for initialization
    onLoad: function () {
        
    },

    /**
     * @method init Initialize the item
     * @param {CParcel} _Parcel: current parcel
     * @param {Number} _Year: year
     * @param {String: species, String: culture} _Data: the culture data
     * @param {Boolean} _CanEdit: can the culture be edited
     */
    initCulture: function(_Parcel, _Year, _Data, _CanEdit)
    {
        this.parcel = _Parcel;
        this.year = _Year;

        var y;
        if (_Year <0)
        {
            y = _Year.toString();
        }
        else
        {
            y = '+'+_Year.toString();
        }
        this.lbYear.string = i18n.t('parcel_history_year', { 'val': y});

        if (_Data === undefined || _Data === null)
        {
            // "Add" mode
            this.lbSpecies.string = i18n.t('new').toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = false;
            this.btAdd.node.active = true;
            this.btEdit.node.active = false;
        }
        else if (_Data.species === 'fallow')
        {
            // Fallow
            this.lbSpecies.string = i18n.t('fallow').toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = true;
            this.iconSpecies.spriteFrame = RscPreload.getPlantIcon('fallow');
            this.btAdd.node.active = false;
            this.btEdit.node.active = _CanEdit;
        }
        else
        {
            // Existing plant
            this.lbSpecies.string = i18n.t('plant_'+_Data.species).toUpperCase();
           
            if (_Data.culture !== undefined)
            {
                this.lbCulture.string = i18n.t('culture_'+_Data.culture).toUpperCase();
            }
            else
            {
                this.lbCulture.string = i18n.t('culture_normal').toUpperCase();
            }

            this.iconSpecies.node.active = true;
            this.iconSpecies.spriteFrame = RscPreload.getPlantIcon(_Data.species);
            this.btAdd.node.active = false;
            this.btEdit.node.active = _CanEdit;
        }
    },


    onBtAdd: function()
    {
        UISpeciesSelPopup.instance.show(this.parcel, this.year);
    },

    onBtEdit: function()
    {
        UISpeciesSelPopup.instance.show(this.parcel, this.year);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UIParcelHistoryItem;