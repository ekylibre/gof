// Game "singleton" implementation
// How to use:
//      const CGame = require('Game');
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

const CGamePhase = require('./GamePhase');
const CGameParcel = require('./GameParcel');
const CFarm = require('./Farm');
const CPlant = require('./Plant');
const i18n = require('LanguageData');
const SharedConsts = require('./constants');
const ApiClient = require('./ApiClient');
const UIDebug = require('./UI/UIDebug');
const UIEnv = require('./UI/UIEnv');

const DEBUG = false;

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
     * Game state enum
     * @enum
     */
    static State =
    {
        INVALID:        -1,
        READY:          0,
        PHASE_SELECT:   10,
        PHASE_LOAD:     11,
        PHASE_READY:    12,
        PHASE_RUN:      13,
        PHASE_SCORE:    14
    };

    /**
     * @type {CGame.State}
     */
    state = CGame.State.INVALID;

    /**
     * @private
     * @type {CGamePhase}
     */
    _currPhase = null;

    /**
     * @private
     * @type {Number}
     */
    _startYear = 0;

    constructor()
    {
        if (instance)
        {
            return instance;
        }

        instance = this;

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

        var now = new Date(Date.now());
        this.farm.year =now.getFullYear();
        
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
                this.farm.plantExcludes = _Phase.plantExcludes;

                // Setup parcels history
                for (var i=0; i<_Phase.parcels.length; i++)
                {
                    var setup = _Phase.parcels[i];
                    var parcel = this.farm.findParcelUID(setup.uid);
                    if (parcel != null)
                    {
                        parcel.rotationHistory = setup.history;
                        parcel.solution = setup.solution;
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
            this.state = CGame.State.PHASE_READY;
            
        }
        else
        {
            this._currPhase = null;
            if (this.state != CGame.State.INVALID)
            {
                this.state = CGame.State.READY;
            }
        }
    }

    /**
     * Returns plant data of specified species
     * @param {String} _Species
     * @return {CPlant} the data, or null
     */
    findPlant(_Species)
    {        
        if (_Species !== undefined && _Species != null)
        {
            var plant = this.plants.find((el) => {return el.species == _Species});
            if (plant !== undefined)
            {
                return plant;
            }
        }

        return null;
    }

    /**
     * Pull the database (plants, etc.)
     * Must be called at least once at startup-
     * CGame state is set to READY once the database is ok
     * @async
     */
    pullDatabase()
    {
        if (!this.api)
        {
            cc.error('Please setup CGame.api');
            return;
        }

        this.api.getPlants(null,
            (error, json, c) =>
            {
                if (error)
                {
                    UIEnv.message.show(
                        i18n.t('error_connection_failed') + '\n\n('+error+')',
                        i18n.t('error'),
                        {
                            buttons: 'none'
                        }
                    );                    
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

                    instance.state = CGame.State.READY;
                }
                else
                {
                    UIEnv.message.show(
                        i18n.t('error_connection_failed'),
                        i18n.t('error'),
                        {
                            buttons: 'none'
                        }
                    ); 
                    UIDebug.log('Error: Invalid response for getPlants: '+json);
                }
            });
    }

    /**
     * Starts current phase
     */
    phaseStart()
    {
        if (this.state == CGame.State.PHASE_READY)
        {
            this.state = CGame.State.PHASE_RUN;
        }
        else
        {
            cc.error('Invalid state to start a phase: '+Object.keys()[this.state+1]);
        }
    }

    /**
     * Ends current phase
     */
    phaseFinish()
    {
        //TODO
    }

    /**
     * true if current phase ending conditions are done
     * @return {Boolean}
     */
    phaseCanFinish()
    {
        return eval(this._currPhase.endCondition) === true ? true : false;
    }

    /**
     * returns the "completion" string of current phase
     * @return {String}
     */
    phaseGetCompletionStr()
    {
        return eval(this._currPhase.completionStr);
    }

    /**
     * returns the "introduction" string of current phase
     * @return {String}
     */
    phaseGetIntroText()
    {
        return i18n.t(this._currPhase.introTextId);
    }

    /**
     * returns the "objective" string of current phase
     * @return {String}
     */
    phaseGetObjectiveText()
    {
        return i18n.t(this._currPhase.objectiveTextId);
    }

    /**
     * Loads a new phase
     * @param {String} uid phase unique indentifier
     * @param {Function} callback function to call when the phase is loaded
     * @async
     */
    loadPhase(uid, callback) 
    {
        this.state = CGame.State.PHASE_LOAD;

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
                phase.introTextId = json.scenario.start.introTextId;
                phase.objectiveTextId = json.scenario.start.objectiveTextId;
                phase.perfectScore = json.scenario.start.score;
                phase.endCondition = json.scenario.end.condition;
                phase.completionStr = json.scenario.end.completionStr;
                phase.plantExcludes = json.scenario.start.farm.excludes;
                
                if(uid === 'croprotation')
                {
                    phase.maxPrevisions = 1;
                }
                else
                {
                    phase.maxPrevisions = 0;
                }

                phase.parcels = new Array();
                for(var i=0;i<json.scenario.start.farm.parcels.length;++i)
                {
                    var sParcel = json.scenario.start.farm.parcels[i];
                    //TODO get parcel from name ?
                    var parcel = new CGameParcel();
                    parcel.uid = sParcel.uid;
                    parcel.solution = sParcel.data.solution;

                    parcel.history = new Array();
                    for(var j=0;j<sParcel.data.rotationHistory.length;++j) {
                        parcel.history.push(sParcel.data.rotationHistory[j]);
                    }

                    phase.parcels.push(parcel);
                }

                this.phase = phase;
                callback(null);
            }
        );
    }

    // DEBUG: creates random rotation history
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

