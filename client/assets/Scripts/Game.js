// Game "singleton" implementation
// How to use:
//      import CGame from 'Game';
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

import CGamePhase from 'GamePhase';
import CFarm from 'Farm';

const i18n = require('LanguageData');

const DEBUG = false;

// Game configuration when DEBUG is true
var ConfigDebug =
{
    LANGUAGE_DEFAULT: 'fr',
    SERVICES_URL: 'http://gof.julien.dev:3000/',
};

// Game configuration
var ConfigMaster=
{
    LANGUAGE_DEFAULT: 'fr',
    SERVICES_URL: 'https://game-of-farms.ekylibre.com',
};

let instance = null;

/**
 * The Game singleton
 * @class
 * @property {Boolean}      isDebug: true if the game is in 'debug' mode
 * @property {Dictionary}   config: current game config
 * @property {CFarm}        farm: the farm
 * @property {CGamePhase}   phase: active game 'phase'
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

        this.isDebug=DEBUG;

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
}

