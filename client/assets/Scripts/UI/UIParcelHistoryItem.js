
import CParcel from 'Parcel';
import CPlant from 'Plant';

const i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIParcelHistoryItem'
    },

    properties: {
        plantAtlas:
        {
            default: null,
            type: cc.SpriteAtlas
        },
        plantDisAtlas:
        {
            default: null,
            type: cc.SpriteAtlas
        },

        icon:
        {
            default: null,
            type: cc.Sprite
        },

        species:
        {
            default: null,
            type: cc.Label
        },

        culture:
        {
            default: null,
            type: cc.Label
        },

        year:
        {
            default: null,
            type: cc.Label
        },

        btAdd:
        {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {
        
    },

    init: function(_Year, _Plant)
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
        this.year.string = i18n.t('parcelHistoryYear', { 'val': y});

        if (_Plant === undefined)
        {
            // "Add" mode
            this.species.string = i18n.t('new').toUpperCase();
            this.culture.string = '';
            this.icon.node.active = false;
            this.btAdd.node.active = true;
        }
        else if (_Plant.species === 'pasture')
        {
            // Fallow
            this.species.string = i18n.t('fallow');
            this.culture.string = '';
            this.icon.node.active = true;
            this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_prairies');
            this.btAdd.node.active = false;
        }
        else
        {
            var icoId = CPlant._getIconId(_Plant.species);

            // Existing plant
            this.species.string = i18n.t('plant_'+icoId).toUpperCase();
           
            if (_Plant.culture !== undefined)
            {
                this.culture.string = i18n.t('culture_'+_Plant.culture).toUpperCase();
            }
            else
            {
                this.culture.string = i18n.t('culture_normal').toUpperCase();
            }

            this.icon.node.active = true;
            this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_'+icoId);
            this.btAdd.node.active = false;
        }
    },


    onBtAdd: function()
    {
        cc.error('UIParcelHistoryItem::onBtAdd: TODO');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
