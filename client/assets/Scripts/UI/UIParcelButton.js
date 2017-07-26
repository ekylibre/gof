import CParcel from 'Parcel'

const UIParcel = require('UIParcel')

/**
 * Displays the parcel name and open its menu when clicked
 * @class
 * @name UIParcelButton
 */
cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIParcelButton'
    },

    properties: {

        parcelName:
        {
            default: null,
            type: cc.Label,
        },

        /**
         * @property {CParcel} parcel The target parcel
         */
        parcel:
        {
            visible: false,
            get: function()
            {
                return this._parcel;
            },
            set: function(_value)
            {
                this._parcel = _value;
                if (this._parcel != null && this.parcelName != null)
                {
                    this.parcelName.string = this._parcel.name;
                }
            },
            type: CParcel
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

    /**
     * @private
     */
    _parcel: null,

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onButtonClick: function()
    {
        UIParcel.instance.parcel = this.parcel;
        UIParcel.instance.show();
    }
});
