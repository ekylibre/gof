
const CGame = require('../Game');
const UIDebug = require('./UIDebug');
const SharedConsts = require('../common/constants');

var game = new CGame();

cc.Class({
    extends: cc.Component,

    properties:
    {
        bgPopup:
        {
            default: null,
            type: cc.Node
        }

    },

    onLoad: function()
    {
        this.bgPopup.active = false;

        if (game.isDebug)
        {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    onDestroy: function()
    {
        if (game.isDebug)
        {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    onKeyDown: function(event)
    {
        switch(event.keyCode)
        {
            case cc.KEY.c:
                this.bgPopup.active ^= true;
                break;
            case cc.KEY.escape:
                this.onBtClose();
                break;
        }
    },

    onBtRandomRotation: function()
    {
        if (game.farm.parcels.length>0)
        {
            for (var k=0; k<game.farm.parcels.length; k++)
            {
                var parcel = game.farm.parcels[k];
                if (parcel.rotationPrevision.length === 0)
                {
                    var id = Math.floor(cc.random0To1() * game.plants.length);
                    if (id == game.plants.length) id--;
                    var plant = game.plants[id];

                    var culture = SharedConsts.CultureModeEnum.NORMAL;
                    id = Math.floor(cc.random0To1()*3);
                    if (id == 1)
                    {
                        culture = SharedConsts.CultureModeEnum.BIO;
                    }
                    if (id == 2)
                    {
                        culture = SharedConsts.CultureModeEnum.REASONED;
                    }
                    
                    parcel.rotationPrevision.push(
                    {
                        species: plant.species,
                        culture: culture
                    });
                    
                }
            }                
        }

        this.onBtClose();
    },

    onBtClearRotation: function()
    {
        if (game.farm.parcels.length>0)
        {
            for (var k=0; k<game.farm.parcels.length; k++)
            {
                var parcel = game.farm.parcels[k];
                if (parcel.rotationPrevision.length > 0)
                {
                    parcel.rotationPrevision = [];
                }
            }                
        }

        this.onBtClose();        
    },

    onBtClose: function()
    {
        this.bgPopup.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
