

const UIPopupBase = require('./UIPopupBase');
const UIEnv = require('./UIEnv');
const CGame = require('../Game');

var game = new CGame();

/**
 * UI controller of the "quest" popup
 * @class
 * @name UIQuestInfo
 */
var UIQuestInfo = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UIQuestInfo'
    },

    properties: {
        /**
         * the label containing the objective description
         */
        lbDescription:
        {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        lbCompletion:
        {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        btValidate:
        {
            default: null,
            type: cc.Button
        }
    },

    statics:
    {
        instance: null
    },

    
    // use this for initialization
    onLoad: function () {
        UIQuestInfo.instance = this;
        UIEnv.questInfo = this;
        this.initPopup();
    },

    onShow: function()
    {
        if (game.phase != null)
        {
            this.lbDescription.string = game.phaseGetObjectiveText();
            this.lbCompletion.string = game.phaseGetCompletionStr();

            this.btValidate.interactable = game.phaseCanFinish();
        }
    },

    
    onBtValidate: function()
    {
        //cc.error('TODO: Score');
        if (game.phaseCanFinish())
        {
            //this score only apply to scenario croprotation

            var score = game.phase.perfectScore;
            var scorePart = score / game.farm.parcels.length;

            for(var i=0;i<game.farm.parcels.length;++i) 
            {
                var parcel = game.farm.parcels[i];
                var solution = parcel.solution;
                var playerChoice = parcel.rotationPrevision[0];
                if(playerChoice.species === solution.perfect) 
                {
                    //perfect score, no malus
                    continue;
                }
                if(solution.acceptables.indexOf(playerChoice.species) > -1) 
                {
                    //average malus
                    score -= (scorePart * 0.5);
                }
                else
                {
                    //maximum malus
                    score -= scorePart;
                }
            }

            score = Math.round(score);
            var normalizedScore = score / game.phase.perfectScore;

            UIEnv.score.setScore(
                normalizedScore, 
                normalizedScore, 
                normalizedScore, 
                normalizedScore,
                normalizedScore, 
                Math.round(normalizedScore * 20) + " / 20");
            UIEnv.score.show();
        }
    },

    onBtClose: function()
    {
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = UIQuestInfo;