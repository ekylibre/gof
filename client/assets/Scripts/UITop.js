import CGame from 'Game';
import CGamePhase from 'GamePhase';

const game = new CGame();


cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/UITop'
    },
    properties: {
        dateLabel:
        {
            default: null,
            type: cc.Label
        },
        moneyLabel:
        {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
    },

    start: function()
    {
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (game.gamePhase != null)
        {
            this.dateLabel.string = game.gamePhase.title+' '+game.gamePhase.getDateString();
            this.moneyLabel.string = game.gamePhase.money;
        }
    },
});