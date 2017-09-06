

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
        if (game.phaseCanFinish())
        {
            //this score only apply to scenario croprotation
            var score = 0;
            var scorePart = game.phase.perfectScore / game.farm.parcels.length;
            var results = [];

            for(var i=0;i<game.farm.parcels.length;++i) 
            {
                var parcel = game.farm.parcels[i];
                var solution = parcel.solution;
                var playerChoice = parcel.rotationPrevision[0];
                var result = {parcelName: parcel.name, note: 4};

                if(solution.perfects .indexOf(playerChoice.species) > -1) 
                {
                    //perfect score
                    result.note = 1;
                    score += scorePart;
                } 
                else if (solution.acceptables.indexOf(playerChoice.species) > -1) 
                {
                    //good one
                    result.note = 2;
                    score += (scorePart * 0.8);
                }
                else if (solution.bads.indexOf(playerChoice.species) > -1) 
                {
                    //not that bad, but can be better
                    result.note = 3;
                    score -= (scorePart * 0.4);
                }
                results.push(result);
                //every other answer is bad 0.
            }

            score = Math.round(score);
            var normalizedScore = score / game.phase.perfectScore;
            //clamp if needed
            if(normalizedScore > 1) {
                normalizedScore = 1;
            }

            UIEnv.score_croprotation.setResults(results);
            UIEnv.score_croprotation.setScoreText(Math.round(normalizedScore * 20) + " / 20");
            UIEnv.score_croprotation.show();

            game.phaseFinish(normalizedScore);
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