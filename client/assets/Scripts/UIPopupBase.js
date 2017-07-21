// UIPopupBase is a base class to make a popup appear from a side
//

// Direction from the popup will appear
var FromMode = cc.Enum(
    {
        //@property LEFT
        LEFT:0,
        //@property RIGHT
        RIGHT:1,
        //@property TOP
        TOP:2,
        //@property BOTTOM
        BOTTOM:3
    }
);

cc.Class({
    extends: cc.Component,

    properties:
    {
        From:
        {
            default: FromMode.LEFT,
            type: FromMode
        }        
    },


    init: function () {
        this._hidden = false;
        this._defaultX = this.node.x;
        this._defaultY = this.node.y;
        this._size = this.node.getContentSize();

        this.hide(true);
    },

    show: function()
    {
        if (this._hidden)
        {
            this.node.stopAllActions();

            this.node.runAction(cc.moveTo(0.2, cc.p(this._defaultX, this._defaultY)));
            this._hidden = false;
        }
    },

    hide: function(instant=false)
    {
        if (!this._hidden)
        {
            this.node.stopAllActions();

            var cvw = cc.Canvas.instance.node.width;
            var cvh = cc.Canvas.instance.node.height;

            var to = new cc.Vec2(this._defaultX, this._defaultY);
            switch (this.From)
            {
                case FromMode.LEFT:
                    to.x = -cvw;
                    break;
                case FromMode.RIGHT:
                    to.x = cvw;
                    break;
                case FromMode.TOP:
                    to.y = cvh;
                    break;
                case FromMode.BOTTOM:
                    to.y = -cvh;
                    break;
                default:
                    cc.error('Invalid from value: '+this.From);
                    to.x = -cvw;
                    break;
            }

            if (!instant)
            {
                this.node.runAction(cc.moveTo(0.2, to));
            }
            else
            {
                this.node.x = to.x;
                this.node.y = to.y;
            }
            this._hidden = true;           
        }
    },
});
