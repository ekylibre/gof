// Game "singleton" implementation
// How to use:
//      const CGame = require('Game');
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

const CGamePhase = require('./GamePhase');
const CParcelSetup = require('./ParcelSetup');
const CFarm = require('./Farm');
const CPlant = require('./Plant');
const i18n = require('LanguageData');
const SharedConsts = require('./common/constants');
const ApiClient = require('./ApiClient');
const UIDebug = require('./UI/UIDebug');
const UIEnv = require('./UI/UIEnv');
const CUsableItem = require('./UsableItem');

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

var criticalError = function(error, details)
{
    if (!error)
    {
        return;
    }

    if (DEBUG)
    {
        var message = error.message;
        if (details)
        {
            message += '\n'+details;
        }
        UIEnv.message.show(
            message,
            i18n.t('error'),
            {
                buttons: 'none'
            }
        );
        // if (details)
        // {
        //     UIDebug.log('Error: '+error.message+' '+details);
        // }    
    }
    else
    {
        UIEnv.message.show(
            error.message,
            i18n.t('error'),
            {
                buttons: 'none'
            }
        );
    }
}

/**
 * The Game singleton
 * @class
 * @property {Boolean}      isDebug: true if the game is in 'debug' mode
 * @property {Dictionary}   config: current game config
 * @property {CFarm}        farm: the farm
 * @property {CGamePhase}   phase: active game 'phase'
 * @property {Array:CPlant}        plants: list of known plants
 * @property {Array:CUsableItem}   usableItems: list of usable items
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
        
        CHANNEL_OPEN:   10,
        PHASE_LOAD:     11,
        PHASE_READY:    12,
        PHASE_RUN:      13,
        PHASE_SCORE:    14,
        PHASE_DONE:     15
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

    /**
     * @private
     * @type {Boolean}
     */
    _saving = false;

    constructor()
    {
        if (instance)
        {
            return instance;
        }

        instance = this;

        instance.isDebug=DEBUG;
        instance.constants = SharedConsts;

        if (DEBUG)
        {
            instance.config = ConfigDebug;
        }
        else
        {
            instance.config = ConfigMaster;
        }

        i18n.init(instance.config.LANGUAGE_DEFAULT);

        instance.farm = new CFarm();

        var now = new Date(Date.now());
        instance.farm.year =now.getFullYear();
        
        instance.plants = [];
        instance.usableItems = [];
    }

    get phase()
    {
        return instance._currPhase;
    }

    set phase(_Phase)
    {
        if (_Phase !== undefined && _Phase !== null)
        {
            if (instance._currPhase !== null && instance._currPhase.uid == _Phase.uid)
            {
                // same phase
                return;
            }

            instance.farm.month = _Phase.startMonth;
            instance.farm.week = _Phase.startWeek;

            if (instance._currPhase === null)
            {
                // First phase
                // Give money
                instance.farm.money = _Phase.startMoney;
                instance.farm.plantExcludes = _Phase.plantExcludes;

                // Setup parcels history
                for (var i=0; i<_Phase.parcels.length; i++)
                {
                    var setup = _Phase.parcels[i];
                    var parcel = instance.farm.findParcelUID(setup.uid);
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
                instance.farm.year += _Phase.startYearDiff;
            }

            instance._currPhase = _Phase;
            instance.state = CGame.State.PHASE_READY;
            
        }
        else
        {
            instance._currPhase = null;
            if (instance.state != CGame.State.INVALID)
            {
                instance.state = CGame.State.READY;
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
        if (_Species)
        {
            var plant = instance.plants.find((el) => {return el.species == _Species});
            if (plant !== undefined)
            {
                return plant;
            }
        }

        return null;
    }

    findUsableItem(_Name)
    {
        if (_Name)
        {
            return instance.usableItems.find( (el) => {return el.name == _Name;} );
        }
        return null;
    }

    _pullUsableItems(fromList, index, callback)
    {
        if (index < fromList.length)
        {
            instance.api.getItems(fromList[index], null, (error, json, c) =>
            {
                if (error)
                {
                    callback(error);
                    return;
                }

                if (json && Array.isArray(json))
                {
                    UIDebug.log('Pulled '+fromList[index]+': '+json.length);
                    for (var i=0; i<json.length; i++)
                    {
                        var jsonItem = json[i];
                        var item = instance.findUsableItem(jsonItem.name)
                        if (!item)
                        {
                            item = new CUsableItem(jsonItem);
                            if (item._valid)
                            {
                                instance.usableItems.push(item);
                            }
                        }
                        else
                        {
                            cc.warn('Found duplicate usableItem: '+item.name);
                        }
                    }
                }

                instance._pullUsableItems(fromList, index+1, callback);

            });
        }
        else
        {
            callback();
        }
    }

    /**
     * Pull the database (plants, etc.)
     * Must be called at least once at startup-
     * CGame state is set to READY once the database is ok
     * @async
     */
    pullDatabase()
    {
        if (!instance.api)
        {
            cc.error('Please setup CGame.api');
            return;
        }

        instance.api.getActivities(null,
            (error, json, c) =>
            {
                if (error)
                {
                    return criticalError(error);
                }

                if (json && Array.isArray(json))
                {
                    UIDebug.log('Pulled activities: '+json.length);
                    for (var i=0; i<json.length; i++)
                    {
                        var jsonPlant = json[i];
                        var plant = instance.findPlant(jsonPlant.species);
                        if (plant != null)
                        {
                            plant.update(jsonPlant);
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

                    instance._pullUsableItems(['tools', 'equipments', 'additives'], 0, function(err) {
                        if (err)
                        {
                            criticalError(err);
                        }
                        else
                        {
                            // Everything ready, compute costs and let the game starts
                            instance._processActivities();
                            instance.state = CGame.State.READY;                           
                        }
                    });
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
                    UIDebug.log('Error: Invalid response for getActivities: '+json);
                }
            });
    }

    /**
     * @method saveChannel Save game state in channel
     */
    saveChannel(callback)
    {
        if (!instance.api || !instance.api.channelId)
        {
            return;
        }

        if (instance._saving)
        {
            if (callback)
            {
                callback();
            }
            return;
        }

        if (instance.state >= CGame.State.PHASE_READY && instance.state <= CGame.State.PHASE_SCORE)
        {
            instance._saving = true;

            var save = {};
            save.date = Date.now();
            //save.phaseId = instance.phase.uid;
            save.phaseState = instance.state;
            save.farm = instance.farm.serialize();

            var self = instance;
            instance.api.setGameData(
                JSON.stringify(save),
                (err, res, c)=>
            {
                self._saving = false;
                if (callback)
                {
                    callback();
                }
                if (err)
                {
                    UIEnv.message.show(
                        err.message,
                        i18n.t('error')
                    );
                }                       
            });
        }
    }

    /**
     * @method openChannel Starts (or restores) game from channel
     */
    openChannel()
    {
        if (!instance.api)
        {
            cc.error('Please setup CGame.api');
            return;
        }
        
        instance.state = CGame.State.CHANNEL_OPEN;
        var self = instance;
        instance.api.getGameData((err, res, c) =>
        {
            if (err)
            {
                return criticalError(err);
            }
                
            if (!res.payload.phase)
            {
                return criticalError(new Error('invalid getgamedata result', res.payload));
            }

            var phaseId = res.payload.phase;

            if (res.payload.gameData && Object.keys(res.payload.gameData).length != 0)
            {
                // Restore existing game
                UIDebug.log('Restoring existing game from channel');

                var save = res.payload.gameData;
                try
                {
                    if (typeof save == 'string')
                    {
                        save = JSON.parse(res.payload.gameData);
                    }
                    if (!save || !save.farm || !save.phaseState)
                    {
                        return criticalError(new Error('Invalid gameData'), res.payload.gameData);
                    }
    
                    self.farm.deserialize(save.farm);
                }
                catch (_e)
                {
                    return criticalError(new Error('Exception restoring gameData'), _e);
                }

                self.loadPhase(phaseId, (err) =>
                {
                    if (!err)
                    {
                        self.state = save.phaseState;
                        UIDebug.log('Restoration succeeded - going to state '+self.state);

                        if (self.state == CGame.State.PHASE_SCORE) {
                            UIEnv.questInfo.onBtValidate();
                        }
                    }
                    else
                    {
                        criticalError(err);
                    }
                });

            }
            else
            {
                //// DEBUG
                // if (self.isDebug && phaseId != 'croprotation')
                // {
                //     phaseId = 'croprotation';
                // }
                //////
                    
                // Starts from the beginning
                UIDebug.log('Starting phase from channel: '+phaseId);
                
                self.loadPhase(phaseId, criticalError);
            }

        });
        
    }

    /**
     * Starts current phase
     */
    phaseStart()
    {
        if (instance.state == CGame.State.PHASE_READY)
        {
            instance.state = CGame.State.PHASE_RUN;
        }
        else
        {
            cc.error('Invalid state to start a phase: '+Object.keys()[instance.state+1]);
        }
    }
    
    /**
     * Ends current phase
     */
    phaseFinish(_Score, _Results)
    {
        if (instance.state <= CGame.State.PHASE_SCORE)
        {
            var self = instance;
            instance.state = CGame.State.PHASE_SCORE;
            var resultString = JSON.stringify(_Results);
            instance.saveChannel(() =>
            {
                instance.api.setScore(_Score, resultString, (err, res, c)=>
                {
                    instance.state = CGame.State.PHASE_DONE;
                });
            });
        }
    }

    /**
     * true if current phase ending conditions are done
     * @return {Boolean}
     */
    phaseCanFinish()
    {
        return eval(instance._currPhase.endCondition) === true ? true : false;
    }

    /**
     * returns the "completion" string of current phase
     * @return {String}
     */
    phaseGetCompletionStr()
    {
        return eval(instance._currPhase.completionStr);
    }

    /**
     * returns the "introduction" string of current phase
     * @return {String}
     */
    phaseGetIntroText()
    {
        return i18n.t(instance._currPhase.introTextId);
    }

    /**
     * returns the "objective" string of current phase
     * @return {String}
     */
    phaseGetObjectiveText()
    {
        return i18n.t(instance._currPhase.objectiveTextId);
    }

    /**
     * Loads a new phase
     * @param {String} uid phase unique indentifier
     * @param {Function} callback function to call when the phase is loaded
     * @async
     */
    loadPhase(uid, callback) 
    {
        instance.state = CGame.State.PHASE_LOAD;

        instance.api.getScenarios(uid, 
            (error, json) => 
            {
                if(error)
                {
                    callback(new Error('Error: Failed to get scenario with uid:'+uid+'\n'+ error.message));
                    return;
                }

                if(json.scenario.start.farm.parcels.length > instance.farm.parcels.length)
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
                    var parcel = new CParcelSetup();
                    parcel.uid = sParcel.uid;
                    parcel.solution = sParcel.data.solution;

                    parcel.history = new Array();
                    for(var j=0;j<sParcel.data.rotationHistory.length;++j) {
                        parcel.history.push(sParcel.data.rotationHistory[j]);
                    }

                    phase.parcels.push(parcel);
                }

                instance.phase = phase;
                callback(null);
            }
        );
    }

    // DEBUG: creates random rotation history
    createRandomPhase()
    {
        instance.phase = new CGamePhase();

        for (var p = 0; p<instance.farm.parcels.length; p++)
        {
            var parcel = instance.farm.parcels[p];
            parcel.rotationHistory = [];
            for (var h = 0; h<5; h++)
            {
                var id = Math.floor(cc.random0To1() * instance.plants.length);
                if (id == instance.plants.length) id--;
                var plant = instance.plants[id];

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
                
                parcel.rotationHistory.push(
                {
                    'species': plant.species,
                    'culture': culture
                });
            }
        }

    }

    /**
     * Called at the end of pullDatabase to compute some costs
     */
    _processActivities()
    {
        for (var plantIndex=0; plantIndex<instance.plants.length; plantIndex++)
        {
            var plant = instance.plants[plantIndex];
            var itkKeys = Object.keys(plant.itks);
            if (itkKeys && itkKeys.length>0)
            {
                for (var itkId=0; itkId<itkKeys.length; itkId++)
                {
                    var itk = plant.itks[itkKeys[itkId]];

                    if (!itk)
                    {
                        continue;
                    }
                    
                    // TODO: take units into account
                    if (itk.sizeUnitName != 'hectare')
                    {
                        UIDebug.log('Unsupported ITK size unit: '+itk.sizeUnitName);
                    }

                    itk.unitCosts = 
                    {
                        money: 0,
                        time: 0
                    };
                    itk.unitResults = 
                    {
                        money: 0
                    };

                    var logName = '['+itk.culture.species+' '+itk.culture.mode+'] ';
    
                    for (var procId=0; procId<itk.procedures.length; procId++)
                    {
                        var procedure = itk.procedures[procId];
                        procedure.unitCosts=
                        {
                            money: 0,
                            time: 0   
                        };
                
                        if (procedure.workingGroups)
                        {
                            for (var wgId=0; wgId<procedure.workingGroups.length; wgId++)
                            {
                                var wg = procedure.workingGroups[wgId];
                                var time = 1;
                                if (wg.workingTimePerSizeUnit)
                                {
                                    time = Number(wg.workingTimePerSizeUnit);
                                    procedure.unitCosts.time += time;
                                }

                                if (wg.tools)
                                {
                                    for (var i=0; i<wg.tools.length; i++)
                                    {
                                        var usable = instance.findUsableItem(wg.tools[i].name);
                                        if (usable)
                                        {
                                            procedure.unitCosts.money += time * usable.pricePerUnit;
                                        }
                                        else
                                        {
                                            cc.warn(logName+'Missing tool datas: '+wg.tools[i].name);
                                        }
                                    }
                                }
                                if (wg.doers)
                                {
                                    for (var i=0; i<wg.doers.length; i++)
                                    {
                                        var usable = instance.findUsableItem(wg.doers[i]);
                                        if (usable)
                                        {
                                            procedure.unitCosts.money += time * usable.pricePerUnit;
                                        }
                                        else
                                        {
                                            cc.warn(logName+'Missing doers datas: '+wg.doers[i]);
                                        }
                                    }                    
                                }
                            }
                        }
                
                        if (procedure.inputs)
                        {
                            for (var inputId=0; inputId<procedure.inputs.length; inputId++)
                            {
                                var input = procedure.inputs[inputId];
                                var quantity = Number(input.quantityPerSizeUnit);
                                if (!quantity)
                                {
                                    quantity = 1;
                                }
                                var usable = instance.findUsableItem(input.name.trim());
                                if (usable)
                                {
                                    if (!input.unitPerSizeUnit)
                                    {
                                        cc.warn(logName+'Missing unitPerSizeUnit in itk input: '+input.name);
                                    }
                                    else
                                    if (usable.unit && usable.unit != input.unitPerSizeUnit)
                                    {
                                        cc.warn(logName+'Units not corresponding: input '+input.name+'='+input.unitPerSizeUnit+' / database='+usable.unit);
                                    }
                                    procedure.unitCosts.money += usable.pricePerUnit * quantity;
                                }
                                else
                                {
                                    // check if its a seed, and get price from CPlant
                                    if (input.name.indexOf('_seed')>0 || input.name.indexOf('_grain')>0)
                                    {
                                        procedure.unitCosts.money += plant.getBuyPrice(itk.culture.mode) * quantity;
                                    }
                
                                    cc.warn(logName+'Missing itk input datas: '+input.name);
                                }
                            }
                        }

                        if (procedure.outputs)
                        {
                            for (var outputId = 0; outputId<procedure.outputs.length; outputId++)
                            {
                                var output = procedure.outputs[outputId];
                                var quantity = Number(output.quantityPerSizeUnit);
                                if (!quantity)
                                {
                                    quantity = 1;
                                }

                                var usable = instance.findUsableItem(output.name);
                                if (usable)
                                {
                                    if (!output.unitPerSizeUnit || (output.unitPerSizeUnit != 'qt' &&  output.unitPerSizeUnit != 't'))
                                    {
                                        cc.warn(logName+'Missing or unsupported unitPerSizeUnit: '+output.unitPerSizeUnit+' in itk output: '+output.name);
                                    }

                                    itk.unitResults.money += usable.pricePerUnit * quantity;
                                }
                                else
                                {
                                    itk.unitResults.money += plant.getSellPrice(itk.culture.mode) * quantity;
                
                                    cc.warn(logName+'Missing itk output datas: '+output.name);
                                }

                            }
                        }

                        itk.unitCosts.money += procedure.unitCosts.money;
                        itk.unitCosts.time += procedure.unitCosts.time;                            
                    }
    
                }
            }
        }
    }
}

