const i18n = require('LanguageData');

var UIOutputInfoItem = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIOutputInfoItem'
    },    

    properties: {
        Name: {
            default: null,
            type: cc.Label
        },

        UnitQuantity: {
            default: null,
            type: cc.Label
        },

        ParcelQuantity: {
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

    init: function(parcel, output)
    {
        this.Name.string = i18n.t('output_'+output.name).toUpperCase();
        var unitQt = Number(output.quantityPerSizeUnit);
        var parcelQt =  unitQt * parcel.surface;

        var tid = 'quantity_quintal';
        if (output.unitPerSizeUnit == 't')
        {
            tid = 'quantity_ton';
        }

        this.UnitQuantity.string = i18n.t(tid, {val: unitQt.toLocaleString(undefined, {maximumFractionDigits:2})});
        this.ParcelQuantity.string = i18n.t(tid, {val: parcelQt.toLocaleString(undefined, {maximumFractionDigits:2})});
        

    }
});

module.exports = UIOutputInfoItem;