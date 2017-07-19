import CGame from 'Game';
const game = new CGame();

cc.Class({
    extends: cc.Component,

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

    // use this for initialization
    onLoad: function ()
    {
        let label = this.getComponent(cc.Label);
        //let game = UserStore;
        label.string = game.initialized+'\n isDebug='+game.isDebug+'\n'+game.config.SERVICES_URL;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
