import CGame from 'Game';

const game = new CGame();

var UIDebug = cc.Class({
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

        mapScrollView:
        {
            default: null,
            type: cc.ScrollView
        },
    },

    statics:
    {
        instance: null,
        _log: [],
        log: function(line)
        {
            // var l = UIDebug._log.length;
            // if (l == 5)
            // {
            //     l = 4;
            // }
            // for (var i=l; i>0; i--)
            // {
            //     UIDebug._log[i] = UIDebug._log[i-1];
            // }

            // UIDebug._log[0]=line;
            UIDebug._log.unshift(line);
            if (UIDebug._log.length>5)
            {
                UIDebug._log.pop();
            }
        },
        touchLog: '',
    },

    // use this for initialization
    onLoad: function ()
    {
        if (UIDebug.instance != null)
        {
            cc.error('UIDebug instance already loaded');
        }
        UIDebug.instance = this;

        if (game.isDebug)
        {
            UIDebug.log('isDebug='+game.isDebug+'\n'+game.config.SERVICES_URL);
        }
        else
        {
            this.debugLabel.string = '';
            this.touchLabel.string = '';

        }
    },

    start: function(err)
    {
    },

    update: function(dt)
    {
        if (game.isDebug)
        {
            if (this.debugLabel != null)
            {
                this.debugLabel.string = '';
                for (var i=0; i<UIDebug._log.length; i++)
                {
                    this.debugLabel.string += UIDebug._log[i] + '\n';
                }
            }

            if (this.touchLabel != null)
            {
                this.touchLabel.string = UIDebug.touchLog;

                if (this.mapScrollView != null)
                {
                    this.touchLabel.string += ' scrollOffset='+this.mapScrollView.getScrollOffset();
                    this.touchLabel.string += ' zoom='+this.mapScrollView.content.scaleX;
                }
            }

        }
    },
});
