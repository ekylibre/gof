// Startup component, used to initialize the game
//
// Must be started before every other "GoF" components

const i18n = require('LanguageData');

import CGame from 'Game';
const game = new CGame();


cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/Startup'
    },

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function ()
    {
        
        /*
        var endpoint = '/api';
        if(cc.sys.isBrowser && location.hostname === 'localhost' && location.port !== 3000) {
            endpoint = 'http://gof.julien.dev:3000/api';
        }
        
        var client = new ApiClient(endpoint);
        client.login('julien.castets@shinypix.com', 'alacon',
            (error, response, c) => {
                if(!error) {
                    c.checkAuth(
                        (error, response) => {
                            if(error) {
                                if(cc.sys.isBrowser && location.hostname === 'localhost' && location.port !== 3000) {
                                    //location.replace('http://gof.julien.dev:3000');
                                } else {
                                    //location.replace('/');
                                }

                                return console.log(error);
                            }
                            console.log(response);
                        }
                    );
                }
            }
        );
        */
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
