// Game singleton
//

const i18n = require('LanguageData');

const DEBUG = true;

// Game configuration when DEBUG is true
var ConfigDebug =
{
    LANGUAGE_DEFAULT: 'fr',
    SERVER: 'http://gof.julien.dev:3000/',
};

// Game configuration
var ConfigMaster=
{
    LANGUAGE_DEFAULT: 'fr',
    SERVER: 'http://gof.julien.dev:3000/',
};

// Game "singleton"
const Game = (function ()
{
    var instance;
 
    function createInstance()
    {        
        var g = new Object('Game');

        g.isDebug = DEBUG;
        g.initialized='';

        if (DEBUG)
        {
            g.config = ConfigDebug;
        }
        else
        {
            g.config = ConfigMaster;
        }

        g.init=function()
        {
            this.initialized = 'Game singleton initialized!';
        };

        i18n.init('fr');

        return g;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}());

module.exports=Game;
