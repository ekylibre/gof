
const i18n = require('LanguageData');
const CPlant = require('Plant');
const RscPreload = require('RscPreload');
const SharedConsts = require('../common/constants');
const UIEnv = require('./UIEnv');

var UISpeciesSelItem = cc.Class({
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
            type: cc.Sprite,
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
         * 'reasoned' buy price label
         */
        buyPriceReasoned:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * 'reasoned' sell price label
         */
        sellPriceReasoned:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * The 'reasoned' culture button
         */
        btReasoned:
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
         * Plant info button
         */
        btInfo:
        {
            default: null,
            type: cc.Button
        },

        /**
         * The highlight if item is currently selected 
         */
        hlSelected:
        {
            default: null,
            type: cc.Node
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
                if (this._isSelected !== val)
                {
                    this._isSelected = val;

                    if (val && this.selectionCallback !== null)
                    {
                        this.selectionCallback(this);
                    }

                    this._selectionChanged = true;
                }
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
                this._plantChanged = true;
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
                this._cultureChanged = true;
            }
        },

        _cultureMode:
        {
            default: SharedConsts.CultureModeEnum.NORMAL,
            visible: false
        },

        /**
         * Callback when item is selected
         * @param {UISpeciesSelItem} data: the selected item
         */
        selectionCallback:
        {
            visible: false,
            default: null,
            type: Object,
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
    _plantChanged: false,

    _cultureChanged: false,

    _isSelected: false,
    _selectionChanged: false,

    // use this for initialization
    onLoad: function ()
    {
        this.speciesVariety.string ='';
        this.hlSelected.active = false;
    },

    updateUI: function()
    {
        if (this._plant != null)
        {
            if (this._plantChanged)
            {
                if (this._plant.isFallow)
                {
                    this.speciesName.string = i18n.t('fallow').toUpperCase();
                    this.speciesIcon.spriteFrame = RscPreload.instance.plantIconsAtlas.getSpriteFrame('ico_prairies');              
                }
                else
                {
                    // Existing plant
                    this.speciesName.string = i18n.t('plant_'+this._plant.species).toUpperCase();
                    this.speciesIcon.spriteFrame = RscPreload.getPlantIcon(this._plant.species);
                }

                this._plantChanged = false;

                // force update of the rest
                this._selectionChanged = true;
                this._cultureChanged = true;
            }

            if (this._cultureChanged)
            {
                if (this._plant.isFallow)
                {
                    this.buyPriceNormal.string = '';
                    this.buyPriceBio.string = '';
                    this.buyPriceReasoned.string = '';
                    this.sellPriceNormal.string = '';
                    this.sellPriceBio.string = '';
                    this.sellPriceReasoned.string = '';

                    this.btNormal.node.active = false;
                    this.btBio.node.active = false;
                    this.btReasoned.node.active = false;
                }
                else
                {
                    var itkNormal = this._plant.getItk(SharedConsts.CultureModeEnum.NORMAL);
                    if (itkNormal && itkNormal.unitCosts)
                    {
                        this.buyPriceNormal.string = i18n.t('money_unit',{ val: itkNormal.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceNormal.string = i18n.t('money_unit',{ val: itkNormal.unitResults.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }
                    else
                    {
                        this.buyPriceNormal.string =  i18n.t('money_unit',{ val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.NORMAL).toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceNormal.string = i18n.t('money_unit',{ val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.NORMAL).toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }

                    var itkBio = this._plant.getItk(SharedConsts.CultureModeEnum.BIO);
                    if (itkBio && itkBio.unitCosts)
                    {
                        this.buyPriceBio.string = i18n.t('money_unit',{ val: itkBio.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceBio.string = i18n.t('money_unit',{ val: itkBio.unitResults.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }
                    else
                    {
                        this.buyPriceBio.string =  i18n.t('money_unit',{ val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.BIO).toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceBio.string = i18n.t('money_unit',{ val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.BIO).toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }

                    var itkReasoned = this._plant.getItk(SharedConsts.CultureModeEnum.REASONED);
                    if (itkReasoned && itkReasoned.unitCosts)
                    {
                        this.buyPriceReasoned.string = i18n.t('money_unit',{ val: itkReasoned.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceReasoned.string = i18n.t('money_unit',{ val: itkReasoned.unitResults.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }
                    else
                    {
                        this.buyPriceReasoned.string =  i18n.t('money_unit',{ val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.REASONED).toLocaleString(undefined, {maximumFractionDigits:2}) });
                        this.sellPriceReasoned.string = i18n.t('money_unit',{ val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.REASONED).toLocaleString(undefined, {maximumFractionDigits:2}) });
                    }

                    this.btNormal.interactable = this.cultureMode != SharedConsts.CultureModeEnum.NORMAL;
                    this.btBio.interactable = this.cultureMode != SharedConsts.CultureModeEnum.BIO;
                    this.btReasoned.interactable = this.cultureMode != SharedConsts.CultureModeEnum.REASONED;
                }                

            }

            if (this._plant.getItk(SharedConsts.CultureModeEnum.NORMAL))
            {
                this.btInfo.interactable = true;              
            }
            else
            {
                this.btInfo.interactable = false;                
            }

            if (this._selectionChanged)
            {
                this.hlSelected.active = this._isSelected;
            }
        }        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt)
    {
        this.updateUI();
    },

    onBtCultureNormal: function()
    {
        if (this._plant != null && !this._plant.isFallow)
        {
            this.cultureMode = SharedConsts.CultureModeEnum.NORMAL;
        }           
    },

    onBtCultureBio: function()
    {
        if (this._plant != null && !this._plant.isFallow)
        {
            this.cultureMode = SharedConsts.CultureModeEnum.BIO;
        }           
    },

    onBtCultureReasoned: function()
    {
        if (this._plant != null && !this._plant.isFallow)
        {
            this.cultureMode = SharedConsts.CultureModeEnum.REASONED;
        }           
    },    

    onBtCulturePerma: function()
    {
        if (this._plant != null && !this._plant.isFallow)
        {
            this.cultureMode = SharedConsts.CultureModeEnum.PERMACULTURE;           
        }           
        
    },

    onBtAdd: function()
    {
        if (this._plant != null && this.validationCallback != null)
        {
            this.validationCallback({species: this._plant.species, culture: this._cultureMode });
        }
    },

    onBtInfo: function()
    {
        if (this._plant != null)
        {
            UIEnv.speciesInfos.show(UIEnv.speciesSelect._parcel, this._plant, this._cultureMode);
        }         
    }
});

module.exports = UISpeciesSelItem;