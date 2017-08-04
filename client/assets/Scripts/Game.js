// Game "singleton" implementation
// How to use:
//      const CGame = require('Game');
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

const CGamePhase = require('./GamePhase');
const CFarm = require('Farm');
const CPlant = require('Plant');
const i18n = require('LanguageData');
const SharedConsts = require('../../../common/constants');
const ApiClient = require('ApiClient');
const UIDebug = require('UIDebug');

const DEBUG = true;

// Game configuration when DEBUG is true
var ConfigDebug =
{
    LANGUAGE_DEFAULT: 'fr',
    MAP_ZOOM_MAX: 1.7,
    MAP_ZOOM_MIN: 0.1
};

// Game configuration
var ConfigMaster=
{
    LANGUAGE_DEFAULT: 'fr',
    MAP_ZOOM_MAX: 1,
    MAP_ZOOM_MIN: 0.4
};

let instance = null;

/**
 * The Game singleton
 * @class
 * @property {Boolean}      isDebug: true if the game is in 'debug' mode
 * @property {Dictionary}   config: current game config
 * @property {CFarm}        farm: the farm
 * @property {CGamePhase}   phase: active game 'phase'
 * @property {Array:CPlant}        plants: list of known plants
 * @property {ApiClient}    api
 */
export default class CGame
{
    /**
     * @private
     * @type {CGamePhase}
     */
    _currPhase = null;


    constructor()
    {
        if (instance)
        {
            return instance;
        }

        instance = this;

        this.isReady = false;
        this.isDebug=DEBUG;
        this.constants = SharedConsts;

        if (DEBUG)
        {
            this.config = ConfigDebug;
        }
        else
        {
            this.config = ConfigMaster;
        }

        i18n.init(this.config.LANGUAGE_DEFAULT);

        this.farm = new CFarm();

        this.plants = [];
    }

    get phase()
    {
        return this._currPhase;
    }

    set phase(_Phase)
    {
        if (_Phase !== undefined && _Phase !== null)
        {
            if (this._currPhase !== null && this._currPhase.uid == _Phase.uid)
            {
                // same phase
                return;
            }

            this.farm.month = _Phase.startMonth;
            this.farm.week = _Phase.startWeek;

            if (this._currPhase === null)
            {
                // First phase
                // Give money
                this.farm.money = _Phase.startMoney;

                // Setup parcels history
                for (var i=0; i<_Phase.parcels.length; i++)
                {
                    var setup = _Phase.parcels[i];
                    var parcel = this.farm.findParcelUID(setup.uid);
                    if (parcel != null)
                    {
                        parcel.rotationHistory = setup.history;
                    }
                    else
                    {
                        cc.error('Could not find parcel uid '+setup.uid);
                    }
                }
            }
            else
            {
                // Add year difference if needed
                /**
                 * @todo also change parcels history
                 */
                this.farm.year += _Phase.startYearDiff;
            }

            this._currPhase = _Phase;
        }
        else
        {
            this._currPhase = null;            
        }
    }

    findPlant(_Species)
    {        
        if (_Species !== undefined && _Species != null)
        {
            var plant = this.plants.find((el) => {return el.species == _Species});
            if (plant !== undefined)
            {
                return plant;
            }
            // for (var i=0; i<this.plants.length; i++)
            // {
            //     if (this.plants[i].species == _Species)
            //     {
            //         return this.plants[i];
            //     }
            // }
        }

        return null;
    }

    pullDatabase()
    {
        // cc.loader.loadRes('plantsDb',
        //     function(err, json)
        //     {
        //         if (json && Array.isArray(json))
        //         {
        //             for (var i=0; i<json.length; i++)
        //             {
        //                 var jsonPlant = json[i];
        //                 var plant = instance.findPlant(jsonPlant.species);
        //                 if (plant != null)
        //                 {
        //                     plant.updatePrices(jsonPlant);
        //                 }
        //                 else
        //                 {
        //                     plant = new CPlant(jsonPlant);
        //                     if (plant._valid)
        //                     {
        //                         instance.plants.push(plant);
        //                     }
        //                 }
        //             }

        //             instance.isReady = true;
        //         }
        //     }
        // );

        if (!this.api)
        {
            cc.error('Please setup CGame.api');
            return;
        }

        this.api.getScenarios(null,
            (error, scenarios) => 
            {
                if(error) {
                    UIDebug.log('Error: Failed to get scenarios: '+error);
                    return;
                }

                cc.log(scenarios);

                if(scenarios && Array.isArray(scenarios)) {
                    this.api.getScenarios(scenarios[0], 
                        (error, scenario) => {
                            if(error) {
                                UIDebug.log('Error: Failed to get scenario with uid: ' + scenarios[0] + ' ' + error);
                            }
                            cc.log(scenario);
                        })
                }
            });

        this.api.getPlants(null,
            (error, json, c) =>
            {
                if (error)
                {
                    UIDebug.log('Error: Failed to get plants:'+error);
                    return;
                }

                if (json && Array.isArray(json))
                {
                    UIDebug.log('Pulled plants: '+json.length);
                    for (var i=0; i<json.length; i++)
                    {
                        var jsonPlant = json[i];
                        /*if (jsonPlant.species == 'pasture')
                        {
                            jsonPlant.species = 'fallow';
                        }*/
                        var plant = instance.findPlant(jsonPlant.species);
                        if (plant != null)
                        {
                            plant.updatePrices(jsonPlant);
                        }
                        else
                        {
                            plant = new CPlant(jsonPlant);
                            if (plant._valid)
                            {
                                instance.plants.push(plant);
                            }
                        }
                    }

                    instance.isReady = true;
                }
                else
                {
                    UIDebug.log('Error: Invalid response for getPlants: '+json);
                }
            });
    }

    phaseCanFinish()
    {
        return eval(this._currPhase.endCondition) === true ? true : false;
    }

    phaseGetCompletionStr()
    {
        return eval(this._currPhase.completionStr);
    }

    phaseGetIntroText()
    {
        return i18n.t(this._currPhase.introTextId);
    }

    loadPhase(uid, callback) 
    {
        this.api.getScenarios(uid, 
            (error, json) => 
            {
                if(error)
                {
                    callback(new Error('Error: Failed to get scenario with uid:'+uid+' '+ error));
                    return;
                }

                if(json.scenario.start.farm.parcels.length > this.farm.parcels.length)
                {
                    callback(new Error('Error: the scenario '+uid+' contains more parcels than the current gfx farm'));
                    return;
                }

                var phase = new CGamePhase();
                phase.uid = uid;
                phase.startMoney = json.scenario.start.farm.treasury;
                phase.startMonth = json.scenario.start.date.month;
                phase.startWeek = json.scenario.start.date.week;
                phase.startYearDiff = json.scenario.start.date.yearDiff;
                phase.perfectScore = json.scenario.start.score;
                phase.endCondition = json.scenario.end.condition;
                phase.completionStr = json.scenario.end.completionStr;

                if(uid === 'croprotation')
                {
                    phase.maxPrevisions = 1;
                }
                else
                {
                    phase.maxPrevisions = 0;
                }

                for(var i=0;i<json.scenario.start.farm.parcels.length;++i)
                {
                    var sParcel = json.scenario.start.farm.parcels[i];
                    //TODO get parcel from name ?
                    var parcel = this.farm.parcels[i];
                    parcel.rotationHistory = new Array();
                    sParcel.data.rotationHistory.forEach(function(element) {

                        parcel.rotationHistory.push(element);
                    }, this);
                }

                
                this.phase = phase;
                callback(null);
            }
        );
    }

    createRandomPhase()
    {
        this.phase = new CGamePhase();

        for (var p = 0; p<this.farm.parcels.length; p++)
        {
            var parcel = this.farm.parcels[p];
            parcel.rotationHistory = [];
            for (var h = 0; h<5; h++)
            {
                var id = Math.floor(cc.random0To1() * this.plants.length);
                if (id == this.plants.length) id--;
                var plant = this.plants[id];

                var culture = SharedConsts.CultureModeEnum.NORMAL;
                id = Math.floor(cc.random0To1()*3);
                if (id == 1)
                {
                    culture = SharedConsts.CultureModeEnum.BIO;
                }
                if (id == 2)
                {
                    culture = SharedConsts.CultureModeEnum.PERMACULTURE;
                }
                
                parcel.rotationHistory.push(
                {
                    'species': plant.species,
                    'culture': culture
                });
            }
        }

    }

}

