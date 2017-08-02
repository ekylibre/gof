
const CPlant = require('Plant');

cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UISpeciesSelItem'
    },    

    properties:
    {
        /**
         * Species name label
         */
        speciesName:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * Species variety label (currently unused)
         */
        speciesVariety:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * Species icon
         */
        speciesIcon:
        {
            default: null,
            type: cc.SpriteFrame,
        },

        /**
         * 'normal' buy price label
         */
        buyPriceNormal:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * 'normal' sell price label
         */
        sellPriceNormal:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * The 'normal' culture button
         */
        btNormal:
        {
            default: null,
            type: cc.Button
        },
        
        /**
         * 'bio' buy price label
         */
        buyPriceBio:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * 'bio' sell price label
         */
        sellPriceBio:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * The 'bio' culture button
         */
        btBio:
        {
            default: null,
            type: cc.Button
        },
        
        /**
         * 'permaculture' buy price label
         */
        buyPricePerma:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * 'permaculture' sell price label
         */
        sellPricePerma:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * The 'permaculture' culture button
         */
        btPerma:
        {
            default: null,
            type: cc.Button
        },

        /**
         * Add button (aka validate button)
         */
        btAdd:
        {
            default: null,
            type: cc.Button
        },

        /**
         * true if item currently selected
         */
        isSelected:
        {
            visible: false,
            get: function()
            {
                return this._isSelected;
            },
            set: function(val)
            {
                this._isSelected = val;
            }            
        },

        /**
         * the plant
         */
        plant:
        {
            visible: false,
            get: function()
            {
                return this._plant;
            },
            set: function(val)
            {
                this._plant = val;
                this.updateUI();
            }
        },

        /**
         * Selected culture mode
         */
        cultureMode:
        {
            visible: false,
            get: function()
            {
                return this._cultureMode;
            },
            set: function(val)
            {
                this._cultureMode = val;
            }
        },


        /**
         * Callback when item is validated
         * @param {String: species, String: culture} data: the selected species & culture mode
         */
        validationCallback:
        {
            visible: false,
            default: null,
            type: Object,
        },
        
    },

    _plant: null,
    _cultureMode: null,

    _isSelected: false,

    // use this for initialization
    onLoad: function ()
    {

    },

    updateUI: function()
    {
        // if (this._plant != null)
        // {
        //     if (this._plant.species == 'fallow')
        //     {
        //         this.speciesName.string = i18n.t('fallow');
        //         this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_prairies');              
        //     }
        //     else
        //     {
        //         var icoId = CPlant._getIconId(_Plant.species);

        //         // Existing plant
        //         this.species.string = i18n.t('plant_'+icoId).toUpperCase();
        //         this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_'+icoId);
        //     }
        // }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
