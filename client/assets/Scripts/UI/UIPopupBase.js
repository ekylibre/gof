// UIPopupBase is a base class to make a popup appear from a side
//
// Don't forget to call initPopup in your 'onLoad' method

/**
 * Side from where the popup will appear
 * @enum
 */
var FromMode = cc.Enum({
    //@property LEFT
    LEFT:0,
    //@property RIGHT
    RIGHT:1,
    //@property TOP
    TOP:2,
    //@property BOTTOM
    BOTTOM:3,
    //@property NONE: no animation
    NONE:4,
});

var UIPopupBase = cc.Class({
    extends: cc.Component,

    properties:
    {  
        /**
         * @property {cc.Node} Popup the popup content
         */
        Popup:
        {
            default: null,
            type: cc.Node,
        },

        /**
         * @property {FromMode} From the side to appear from / to go hide to
         */
        From:
        {
            default: FromMode.LEFT,
            type: FromMode
        },

        isShown:
        {
            visible: false,
            get: function() {
                return !this._hidden;
            }
        }
            
    },

    _hidden: false,

    /**
     * @method initPopup must be called from onLoad
     */
    initPopup: function () {

        if (this.Popup == null)
        {
            this.Popup = this.node;
        }

        this._hidden = false;
        this._defaultX = this.Popup.x;
        this._defaultY = this.Popup.y;
        this._size = this.Popup.getContentSize();

        this.hide(true);
    },

    /**
     * @method showPopup to open the popup
     * calls this.onShow callback if present
     */
    showPopup: function()
    {
        if (this._hidden)
        {
            this.Popup.stopAllActions();

            if (!this.Popup.active)
            {
                this.Popup.active = true;
            }

            if (this.From != FromMode.NONE)
            {
                this.Popup.runAction(cc.moveTo(0.2, cc.p(this._defaultX, this._defaultY)));
            }

            this._hidden = false;

            if (this.onShow !== undefined)
            {
                this.onShow();
            }

        }
    },

    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hidePopup: function(instant)
    {
        if (!this._hidden)
        {
            this.Popup.stopAllActions();

            if (this.From != FromMode.NONE)
            {
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
                    this.Popup.runAction(cc.moveTo(0.2, to));
                }
                else
                {
                    this.Popup.x = to.x;
                    this.Popup.y = to.y;
                }
            }
            else
            {
                this.Popup.active = false;
            }

            this._hidden = true;

            if (this.onHide !== undefined)
            {
                this.onHide();
            }            
        }
    },

    /**
     * @method show to open the popup
     * calls this.onShow callback if present
     */
    show: function()
    {
        this.showPopup();
    },

    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hide: function(instant=false)
    {
        this.hidePopup(instant);
    },
});
