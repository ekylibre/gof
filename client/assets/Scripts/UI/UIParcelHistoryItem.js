
const i18n = require('LanguageData');
const CGame = require('../Game');

const CParcel = require('../Parcel');
const CPlant = require('../Plant');
const RscPreload = require('../RscPreload');
const UIEnv = require('./UIEnv');
const SharedConsts = require('../common/constants');

var game = new CGame();

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

        btInfo:
        {
            default: null,
            type: cc.Button
        },

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

        plant:
        {
            default: null,
            visible: false,
            type: CPlant
        },

        cultureMode:
        {
            default: null,
            visible: false,
        }
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
        this.plant = null;
        this.cultureMode = null;

        if (_Year)
        {
            var y;
            if (_Year <0)
            {
                y = _Year.toString();
            }
            else
            {
                y = '+'+_Year.toString();
            }
            this.lbYear.string = y; //i18n.t('parcel_history_year', { 'val': y});
        }
        else
        {
            this.lbYear.string = '';
        }

        if (_Data === undefined || _Data === null)
        {
            // "Add" mode
            this.lbSpecies.string = i18n.t('new').toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = false;
            this.btAdd.node.active = true;
            this.btEdit.node.active = false;
            this.btInfo.node.active = false;
        }
        else if (_Data.species.indexOf('fallow')>=0 || _Data.species === 'pasture')
        {
            // Fallow
            this.lbSpecies.string = i18n.t('plant_'+_Data.species).toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = true;
            this.iconSpecies.spriteFrame = RscPreload.getPlantIcon(_Data.species);
            this.btAdd.node.active = false;
            this.btEdit.node.active = _CanEdit;
            this.btInfo.node.active = false;
        }
        else
        {
            // Existing plant
            this.cultureMode = _Data.culture;
            this.plant = game.findPlant(_Data.species);

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

            if (this.plant && _CanEdit)
            {
                this.btInfo.node.active = true;
                this.btInfo.interactable = this.plant.getItk(this.cultureMode) !== undefined;
            }
            else
            {
                this.btInfo.node.active = false;
            }
        }
    },


    onBtAdd: function()
    {
        UIEnv.speciesSelect.show(this.parcel, this.year);
    },

    onBtInfo: function()
    {
        UIEnv.speciesInfos.show(this.parcel, this.plant, this.cultureMode);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UIParcelHistoryItem;