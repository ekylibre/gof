import CGame from 'Game';
import CFarm from 'Farm';
//import CGamePhase from 'GamePhase';

const game = new CGame();

const i18n = require('LanguageData');

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
            type: cc.RichText
        },
        moneyLabel:
        {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        this.moneyLabel.string = '';
        this.dateLabel.string = '';
    },

    start: function()
    {
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (game.phase != null)
        {
            var farm = game.farm;
            this.moneyLabel.string = game.farm.money;
            
            var month = i18n.t('month_'+(farm.month+1));

            this.dateLabel.string = i18n.t(
                'date_value',
                {
                    'year': farm.year,
                    'month': month, //(farm.month+1).toLocaleString(game.config.LANGUAGE_DEFAULT, {minimumIntegerDigits: 2}),
                    'week': (farm.week+1)
                }
            );
        }
    },
});