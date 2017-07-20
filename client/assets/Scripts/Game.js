// Game "singleton" implementation
// How to use:
//      import CGame from 'Game';
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

import CGamePhase from 'GamePhase';

const i18n = require('LanguageData');

const DEBUG = true;

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
    SERVICES_URL: 'http://gof.julien.dev:3000/',
};

let instance = null;

// Game "singleton" class
export default class CGame
{
    //true if game is running with the debug configuration
    isDebug=DEBUG;

    //contains some constants
    config=null;
  
    initialized='';

    debugLog = null;
    touchLog = '';

    gamePhase = null;

    constructor()
    {
        if (instance)
        {
            return instance;
        }

        instance = this;

        if (DEBUG)
        {
            this.config = ConfigDebug;
        }
        else
        {
            this.config = ConfigMaster;
        }

        this.gamePhase = new CGamePhase();

        i18n.init(this.config.LANGUAGE_DEFAULT);
    }

    init()
    {
        // used for debug
        this.initialized = 'Game singleton initialized';
    };
}

