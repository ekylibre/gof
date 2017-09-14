const i18n = require('LanguageData');
const UIPopupBase = require('./UIPopupBase');
const CGame = require('../Game');
const UISpeciesInfosItem = require('./UISpeciesInfosItem');
const UIEnv = require('./UIEnv');
const SharedConsts = require('../common/constants');
const RscPreload = require('RscPreload');

var game = new CGame();

var UISpeciesInfosPopup = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UISpeciesInfosPopup'
    },
    properties: {
        /**
         * @property {cc.Prefab} itemPrefab the prefab used to created the items in the list
         */
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },

        /**
         * @property {cc.ScrollView} scrollView the scrollview containing the items
         */
        scrollView:
        {
            default: null,
            type: cc.ScrollView
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
         * Species name label
         */
        speciesName:
        {
            default: null,
            type: cc.Label,
        },
        

        btNormal:
        {
            default: null,
            type: cc.Button
        },

        btBio:
        {
            default: null,
            type: cc.Button
        },

        btReasoned:
        {
            default: null,
            type: cc.Button
        },

        totalPrice:
        {
            default: null,
            type: cc.Label
        },
        
        totalDuration:
        {
            default: null,
            type: cc.Label
        },
        
        totalResults:
        {
            default: null,
            type: cc.Label
        },
        
        totalSell:
        {
            default: null,
            type: cc.Label
        },
        
        
        /**
         * @private
         * @property {CParcel} _parcel Currently modified parcel
         */
        _parcel:
        {
            default: null,
            visible: false,
        },
        
        /**
         * @private
         * @property {CPlant} _plant displayed plant
         */
        _plant:
        {
            default: null,
            visible: false,
        },

        _mode:
        {
            default: null,
            visible: false,
        }
    },

    statics:
    {
        /**
         * @property {UISpeciesInfosPopup} instance: UISpeciesInfosPopup unique instance
         * @static
         */
        instance: null,
    },

    // use this for initialization
    onLoad: function () {
        if (UISpeciesInfosPopup.instance != null)
        {
            cc.error('An instance of UISpeciesInfosPopup already exists');
        }
        UISpeciesInfosPopup.instance = this;
        UIEnv.speciesInfos = this;

        this.initPopup();
    },


    /**
     * @method
     * @param {CParcel} _Parcel selected parcel
     * @param {CPlant} _Plant plant to display
     * @param {CultureModeEnum} _Mode selected culture mode
     */
    show: function(_Parcel, _Plant, _Mode)
    {
        this._parcel = _Parcel;
        this._plant = _Plant;
        this._mode = _Mode;

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

        this.showPopup();
    },
    
    // called by UIPopupBase
    onShow: function()
    {
        var moneyUnit = i18n.t('money_unit');
        var timeUnit = i18n.t('duration_unit');
        
        var content = this.scrollView.content;
        content.removeAllChildren(true);
        
        var itk = this._plant.getItk(this._mode);
        if (itk && itk.procedures)
        {
            this.totalPrice.string = (itk.unitCosts.money * this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+' '+moneyUnit;
            this.totalDuration.string = (itk.unitCosts.time * this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+' '+timeUnit;
            this.totalSell.string = (itk.unitResults.money * this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+' '+moneyUnit;
            this.totalResults.string = "";

            var outputs = this._plant.getOutputs(this._mode);
            for (var oi = 0; oi<outputs.length; oi++)
            {
                var output = outputs[oi];
                var qt = Number(output.quantityPerSizeUnit) * this._parcel.surface;
                this.totalResults.string += i18n.t(output.name)+' : '+qt.toLocaleString(undefined, {maximumFractionDigits:2})+' '+output.unitPerSizeUnit;
                if (oi != (outputs.length-1))
                {
                    this.totalResults.string += '\n';
                }
            }
            
            var prevProc = null;
            var prevCount = 0;
            for (var procId=0; procId<itk.procedures.length; procId++)
            {               
                var procedure = itk.procedures[procId];
                if (procedure.name == prevProc)
                {
                    prevCount++;
                }
                else
                {
                    prevProc = procedure.name;
                    prevCount = 1;
                }
                var prefab = cc.instantiate(this.itemPrefab);
                prefab.setParent(content);
    
                var s = prefab.getComponent('UISpeciesInfosItem');
                s.init(this._parcel, procedure, prevCount);
            }
        }
        else
        {
            this.totalPrice.string = 'N/A';
            this.totalDuration.string =  'N/A';
            this.totalSell.string =  'N/A';
            this.totalResults.string =  'N/A';
        }

        this.btNormal.interactable = this._mode != SharedConsts.CultureModeEnum.NORMAL;
        this.btBio.interactable = this._mode != SharedConsts.CultureModeEnum.BIO;
        this.btReasoned.interactable = this._mode != SharedConsts.CultureModeEnum.REASONED;
    },

    // called by UIPopupBase
    onHide: function()
    {

    },

    onBtNormal: function()
    {
        this._mode = SharedConsts.CultureModeEnum.NORMAL;
        this.onShow();
    },

    onBtBio: function()
    {
        this._mode = SharedConsts.CultureModeEnum.BIO;
        this.onShow();
    },
    
    onBtReasoned: function()
    {
        this._mode = SharedConsts.CultureModeEnum.REASONED;
        this.onShow();
    },
    
});
