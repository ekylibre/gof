import CGame from 'Game';
const game = new CGame();

cc.Class({
    extends: cc.Component,

    properties: {
        debugLabel:
        {
            default: null,
            type: cc.Label
        },
        touchLabel:
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
    onLoad: function ()
    {
    },

    start: function(err)
    {
    },

    update: function(dt)
    {
        if (this.debugLabel != null)
        {
            if (game.debugLog != null)
            {
                this.debugLabel.string = game.debugLog;
            }
            else
            {
                this.debugLabel.string = game.initialized+'\n isDebug='+game.isDebug+'\n'+game.config.SERVICES_URL;                            
            }
        }
        if (this.touchLabel != null)
        {
            this.touchLabel.string = game.touchLog;
        }
    },
});
