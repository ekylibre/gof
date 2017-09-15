const i18n = require('LanguageData');

var UISpeciesInfosItem = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UISpeciesInfosItem'
    },    

    properties: {
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

        procedureParcelPrice: {
            default: null,
            type: cc.Label
        },

        procedureParcelDuration: {
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
        var s = this;
        var moneyUnit = i18n.t('money_unit');
        var timeUnit = i18n.t('duration_unit');

        s.procedureName.string = i18n.t('procedure_'+procedure.name).toUpperCase();
        if (index)
        {
            s.procedureName.string += ' ' + index.toString();
        }
        s.procedureUnitPrice.string = i18n.t('price_per_hectare',{ val: procedure.unitCosts.money.toLocaleString(undefined, {maximumFractionDigits:2}) });
        s.procedureUnitDuration.string = i18n.t('duration_per_hectare',{ val: procedure.unitCosts.time.toLocaleString(undefined, {maximumFractionDigits:2}) });
        
        s.procedureParcelPrice.string = (procedure.unitCosts.money * parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+' '+moneyUnit;
        s.procedureParcelDuration.string = (procedure.unitCosts.time * parcel.surface).toLocaleString(undefined, {maximumFractionDigits:2})+ ' '+timeUnit;        

    }
});

module.exports = UISpeciesInfosItem;