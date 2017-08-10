const UIPopupBase = require('./UIPopupBase');
const CGame = require('../Game');
const UIEnv = require('./UIEnv');
const i18n = require('LanguageData');

var game = new CGame();
        
/**
 * Score UI controller
 * @class
 * @name UIScore
 */
var UIScore = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIScore'
    },

    properties: 
    {
        drawingZone:
        {
            default: null,
            type: cc.Node
        },

        scoreText:
        {
            default: null,
            type: cc.Label
        }
    },

    statics:
    {
        instance: null,
    },

    // use this for initialization
    onLoad: function () {

        UIScore.instance = this;
        UIEnv.score = this;
        this.initPopup();

        //Add a Graphics component to draw custom shapes
        this.spider = this.drawingZone.addComponent(cc.Graphics);

        //this.showPopup();
        //this.setScore(Math.random(), Math.random(), Math.random(), Math.random(), Math.random());
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

    //each score should be between [0;1]
    setScore: function(_financial, _rule, _quality, _ecological, _human, _text)
    {
        this.scoreText.string = _text;

        var g = this.spider;
        var center = new cc.Vec2(-151, -66);
        var directions = [
            new cc.Vec2(0, 1),
            new cc.Vec2(150, 42),
            new cc.Vec2(84, -124),
            new cc.Vec2(-84, -124),
            new cc.Vec2(-150, 42)
        ];

        for(var i=0;i<directions.length;++i)
        {
            directions[i] = directions[i].normalize();
        }

        var score = [
            _financial,
            _rule,
            _quality,
            _ecological,
            _human
        ];

        g.clear();
        g.fillColor = new cc.Color(167, 247, 192, 160);
        g.strokeColor = new cc.Color(142, 162, 105, 160);
        g.lineWidth = 6;

        var start = null;
        for(var i=0;i<directions.length;++i)
        {
            //calculate coordinate of point according to score
            var d = directions[i];
            var l = d.mul(160 * score[i]);
            var p = center.add(l);

            if(!i)
            {
                g.moveTo(p.x, p.y);
                start = p;
            }
            else
            {
                g.lineTo(p.x, p.y);
            }
        }
        g.lineTo(start.x, start.y);
        g.stroke();
        g.fill();
        this.drawingZone.opacity = 127;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) 
    {
    },

    onBtNext: function()
    {
        this.hide();
    }

});