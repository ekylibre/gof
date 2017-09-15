const UIPopupBase = require('./UIPopupBase');
const CGame = require('../Game');
const RscPreload = require('RscPreload');
const UIEnv = require('./UIEnv');
const i18n = require('LanguageData');

var game = new CGame();
        
/**
 * Score croprotation UI controller
 * @class
 * @name UIScore_croprotation
 */
var UIScore_croprotation = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIScore_croprotation'
    },

    properties: 
    {
        scoreText:
        {
            default: null,
            type: cc.Label
        },

        itemPrefab: {
            default: null,
            type: cc.Prefab
        },

        scrollView:
        {
            default: null,
            type: cc.ScrollView
        }
    },

    statics:
    {
        instance: null,
    },

    // use this for initialization
    onLoad: function () {

        UIScore_croprotation.instance = this;
        UIEnv.score_croprotation = this;
        this.initPopup();
    },

    show: function() 
    {
        UIEnv.parcel.hide();
        UIEnv.speciesSelect.hide();
        UIEnv.questInfo.hide();
        this.showPopup();
    },

    onShow: function()
    {
       
    },

    setResults: function(_results) 
    {
        var content = this.scrollView.content;
        content.removeAllChildren(true);

        for (var i=0; i<_results.length; i++)
        {
            var prefab = cc.instantiate(this.itemPrefab);
            
            var result = _results[i];
            var lbl = prefab.getChildByName("ParcelleName").getComponent(cc.Label);
            if(lbl)
            {
                lbl.string = result.parcelName;
            }

            var icon = prefab.getChildByName("icon_note").getComponent(cc.Sprite);
            if(icon)
            {
                icon.spriteFrame = RscPreload.instance.noteIconsAtlas.getSpriteFrame('note'+result.note);
            }

            prefab.setParent(content);
        }
    },

    setScoreText: function(_text)
    {
        this.scoreText.string = _text;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) 
    {
    },

    onBtNext: function()
    {
        location.pathname = '/dashboard';        
        this.hide();
    }

});