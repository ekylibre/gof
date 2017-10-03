
/**
 * Component used to reference some resources used at runtime
 * @class
 * @name RscPreload
 */
var RscPreload = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/RscPreload'
    },

    properties:{
        /**
         * Atlas containing the "plants" icons
         */
        plantIconsAtlas:
        {
            default: null,
            type: cc.SpriteAtlas
        },

        /**
         * Atlas containing the "plants" disabled icons
         */
        plantDisIconsAtlas:
        {
            default: null,
            type: cc.SpriteAtlas
        },

        /**
         * Atlas of icon note
         */

         noteIconsAtlas:
         {
            default: null,
            type: cc.SpriteAtlas
         },
    },

    statics:
    {
        instance: null,

        _defaultPlantIcon: 'ico_generique',
        
        _plantIconId:
        {
            'corn': 'mais',
            'wheat': 'ble',
            'durum_wheat': 'ble',
            'soft_wheat': 'ble',
            'carrot': 'carotte',
            'sunflower': 'tournesol',
            'barley': 'orge',
            'oat': 'avoine',
            'rye': 'seigle',
            'buckwheat': 'sarrasin',
            'pea': 'pois',
            'beetroot': 'betterave',
            'field_bean': 'feverole',
            'soy': 'soja',

            'pasture': 'prairie',
            'flower_fallow': 'jachere_fleurie',
            'fallow': 'jachere'
        },

        getPlantIcon: function(_species, _disabled)
        {
            if(RscPreload.instance === null)
            {
                cc.error('RscPreload not loaded');
                return null;
            }

            var id = RscPreload._plantIconId[_species];
            if (id === undefined)
            {
                id = _species;            
            }
            
            var spr = null;
            if (_disabled)
            {
                spr = RscPreload.instance.plantDisIconsAtlas.getSpriteFrame('ico_'+id);
            }
            else
            {
                spr = RscPreload.instance.plantIconsAtlas.getSpriteFrame('ico_'+id);
            }

            if (!spr)
            {
                // use default icon
                cc.warn('Icon not found for species: '+_species);
                if (_disabled)
                {
                    spr = RscPreload.instance.plantDisIconsAtlas.getSpriteFrame(this._defaultPlantIcon);
                }
                else
                {
                    spr = RscPreload.instance.plantIconsAtlas.getSpriteFrame(this._defaultPlantIcon);
                }
            }

            return spr;
        }
    },

    // use this for initialization
    onLoad: function () {
        if (RscPreload.instance != null)
        {
            cc.error('An instance of RscPreload already exists');
        }

        RscPreload.instance = this;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = RscPreload;