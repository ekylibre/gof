
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
    },

    statics:
    {
        instance: null
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
