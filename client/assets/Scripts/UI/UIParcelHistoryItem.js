
import CParcel from 'Parcel'

const i18n = require('LanguageData');

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

        icon:
        {
            default: null,
            type: cc.Sprite
        },

        species:
        {
            default: null,
            type: cc.Label
        },

        culture:
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

    init: function(_Year, _Species, _Culture)
    {
        this.year.string = _Year;

        if (_Species == 'fallow')
        {
            this.species.string = i18n.t(_Species);
            this.culture.string = '';
            this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_prairies');
        }
        else
        {
            this.species.string = i18n.t('plant_'+_Species).toUpperCase();
            
            if (_Culture !== undefined)
            {
                this.culture.string = i18n.t('culture_'+_Culture).toUpperCase();
            }
            else
            {
                this.culture.string = i18n.t('culture_normal').toUpperCase();
            }

            this.icon.spriteFrame = this.plantAtlas.getSpriteFrame('ico_'+_Species);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
