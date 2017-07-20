
var UIOffice = cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIOffice'
    },
    properties: {
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

    statics:
    {
        instance: null
    },

    // use this for initialization
    onLoad: function () {
        UIOffice.instance = this;
        this.node.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
