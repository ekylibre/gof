import CGame from 'Game';

const game = new CGame();

cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UIDebug'
    },

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
    },

    // use this for initialization
    onLoad: function ()
    {
        this.debugLabel.string = game.initialized+'\n isDebug='+game.isDebug+'\n'+game.config.SERVICES_URL;                            
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
        }
        if (this.touchLabel != null)
        {
            this.touchLabel.string = game.touchLog;
        }
    },
});
