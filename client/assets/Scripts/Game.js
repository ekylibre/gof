// Game singleton
//

const i18n = require('LanguageData');

const Game = (function ()
{
    var instance;
    var initialized;
 
    function createInstance()
    {
        var object = new Object("Game");

        object.initialized='';
        object.init=init;

        i18n.init('fr');

        return object;
    }

    function init()
    {
        //used for testing purposes
        this.initialized = 'Game singleton is initialized!';
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
