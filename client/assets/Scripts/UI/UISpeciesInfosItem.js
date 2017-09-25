const i18n = require('LanguageData');

var UISpeciesInfosItem = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UISpeciesInfosItem'
    },    

    properties: {
        procedureIndex:
        {
            default: null,
            type: cc.Label
        },

        procedureName: {
            default: null,
            type: cc.Label
        },

        procedureUnitPrice: {
            default: null,
            type: cc.Label
        },

        procedureUnitDuration: {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init: function(parcel, procedure, index)
    {
        this.procedureIndex.string = index.toString();
        this.procedureName.string = i18n.t('procedure_'+procedure.name).toUpperCase();
        if (procedure.unitCosts.money != 0)
        {
            this.procedureUnitPrice.string = i18n.t('money_unit',{ val: procedure.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2}) });           
        }
        else
        {
            this.procedureUnitPrice.string = '--'            
        }

        this.procedureUnitDuration.string = i18n.t('duration_unit',{ val: procedure.unitCosts.time.toLocaleString(undefined, {maximumFractionDigits:2}) });
        
        // this.procedureParcelPrice.string = (procedure.unitCosts.money * parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+' '+moneyUnit;
        // this.procedureParcelDuration.string = (procedure.unitCosts.time * parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+ ' '+timeUnit;        

    }
});

module.exports = UISpeciesInfosItem;