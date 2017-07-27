
import CParcel from 'Parcel'

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

        plantIcon:
        {
            default: null,
            type: cc.Sprite
        },

        plantSpecies:
        {
            default: null,
            type: cc.Label
        },

        year:
        {
            default: null,
            type: cc.Label
        },

        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

    },

    // use this for initialization
    onLoad: function () {
        
    },

    start: function()
    {
        this.plantIcon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_pois');

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
