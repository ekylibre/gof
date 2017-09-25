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

        title:
        {
            default: null,
            type: cc.Label
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

        totalSell:
        {
            default: null,
            type: cc.Label
        },

        totalProfit:
        {
            default: null,
            type: cc.Label
        },
        
        hectarePrice:
        {
            default: null,
            type: cc.Label
        },

        hectareSell:
        {
            default: null,
            type: cc.Label
        },

        hectareProfit:
        {
            default: null,
            type: cc.Label
        },

        /**
         * @property {cc.ScrollView} outputPanel the panel containing the product outputs
         */
        outputPanel :
        {
            default: null,
            type: cc.Node
        },

        /**
         * @property {cc.Prefab} ouputPrefab the prefab used to created the items in the product ouputs list
         */
        ouputPrefab: {
            default: null,
            type: cc.Prefab
        },

        /**
         * @property {cc.ScrollView} ouputScrollView the scrollview containing the product outputs
         */
        ouputScrollView:
        {
            default: null,
            type: cc.ScrollView
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

        this.title.string = i18n.t('activity_infos_title')+'\n'+this._parcel.name+' ('+i18n.t('surface_hectare', {val: this._parcel.surface.toLocaleString(undefined, {maximumFractionDigits:2})})+')';

        this.outputPanel.active = false;
        
        this.showPopup();
    },
    
    // called by UIPopupBase
    onShow: function()
    {
        var content = this.scrollView.content;       
        content.removeAllChildren(true);

        var outputContent = this.ouputScrollView.content;
        outputContent.removeAllChildren(true);
        
        var itk = this._plant.getItk(this._mode);
        if (itk && itk.procedures)
        {
            this.hectarePrice.string = i18n.t('money_unit', {val: itk.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2})});
            this.hectareSell.string = i18n.t('money_unit', {val: itk.unitResults.money.toLocaleString(undefined, {maximumFractionDigits:2})});
            this.hectareProfit.string = i18n.t('money_unit', {val: (itk.unitResults.money-itk.unitCosts.money).toLocaleString(undefined, {maximumFractionDigits:2})});
            
            this.totalPrice.string = i18n.t('money_unit', {val: (itk.unitCosts.money * this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})});
            this.totalSell.string = i18n.t('money_unit', {val: (itk.unitResults.money * this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})});
            this.totalProfit.string = i18n.t('money_unit', {val: ((itk.unitResults.money-itk.unitCosts.money)*this._parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})});

            for (var procId=0; procId<itk.procedures.length; procId++)
            {               
                var procedure = itk.procedures[procId];
                var prefab = cc.instantiate(this.itemPrefab);
                prefab.setParent(content);
    
                var s = prefab.getComponent('UISpeciesInfosItem');
                s.init(this._parcel, procedure, procId+1);
            }


            var outputs = this._plant.getOutputs(this._mode);
            for (var oi = 0; oi<outputs.length; oi++)
            {
                var output = outputs[oi];
                var prefab = cc.instantiate(this.ouputPrefab);
                prefab.setParent(outputContent);

                var s = prefab.getComponent('UIOutputInfoItem');
                s.init(this._parcel, output);
            }            
        }
        else
        {
            this.hectarePrice.string = '';
            this.hectareSell.string = '';
            this.hectareProfit.string = '';
            this.totalPrice.string = '';
            this.totalSell.string =  '';
            this.totalProfit.string =  '';
        }

        this.btNormal.interactable = this._mode != SharedConsts.CultureModeEnum.NORMAL;
        this.btBio.interactable = this._mode != SharedConsts.CultureModeEnum.BIO;
        this.btReasoned.interactable = this._mode != SharedConsts.CultureModeEnum.REASONED;

        this.scrollView.scrollToTop();
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

    onBtDetails: function()
    {
        this.outputPanel.active = !this.outputPanel.active;
    }
    
});
