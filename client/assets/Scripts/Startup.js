// Startup component, used to initialize the game
//
// Must be started before every other "GoF" components

const i18n = require('LanguageData');
const ApiClient = require('./ApiClient');

const CGame = require('./Game');
const game = new CGame();

const UIDebug = require('./UI/UIDebug');
const UIEnv = require('./UI/UIEnv');

cc.Class({
    extends: cc.Component,
    editor:
    {
        menu: 'gof/Startup'
    },

    properties: {

    },

    // use this for initialization
    onLoad: function ()
    {
        // Cocos Creator 1.6.x issue:
        // If you get Error 3300 and Error 3400, please check in CocosCreator folder:
        // /resources/engine/misc.js
        // Search for misc.imagePool.resize(0); and remove the test conditionning it
        // Then rebuild the engine (type "npm install" in the command line if needed, then type "gulp")
        // Note: a patch has been submitted to Cocos Creator github
        
        UIDebug.log('CC='+cc.ENGINE_VERSION+' Sys='+cc.sys.os+' Browser='+cc.sys.browserType)


        // Select REST API endpoint
        var endpoint = '/api';
        var isPreview = location.hostname == 'localhost' && location.port != 3000;
        if(isPreview) {
            endpoint = 'http://gof.shinypix.dev:3000/api'; 
            //endpoint = 'http://gof.julien.dev:3000/api';
            //endpoint = 'http://localhost:3000/api';
        }

        UIDebug.log('API endpoint: '+endpoint);
        
        var self = this;
        var client = new ApiClient(endpoint);
        client.checkAuth(
            (error, response, c) => {
                if(error) {
                    if(isPreview) {
                        var email = prompt('email');
                        var password = prompt('password');

                        c.login(email, password, 
                            (error, response, c) => {
                                if(!error) {
                                    localStorage.setItem("gof-access-token", response.payload.accessToken);                                    
                                    self.whenLoggedIn(client);
                                }
                                else
                                {
                                    UIEnv.message.show(
                                        i18n.t('error_connection_failed'),
                                        'Login failed!',
                                        {
                                            onOk: function() {location.reload();}
                                        }
                                    );                                    
                                    UIDebug.log('Error: Login failed!');
                                    cc.error('Login failed');
                                }
                        });
                    } else {
                        UIEnv.message.show(
                            i18n.t('error_auth_missing'),
                            i18n.t('error'),
                            {
                                onOk: function() {location.pathname = '/auth/login';}
                            }
                        );                        
                        UIDebug.log('Error: you are not logged in!');
                        return;
                    }
                }
                else
                {
                    self.whenLoggedIn(client);
                }
            }
        );
        
    },

    start: function()
    {
        if (UIDebug.instance != null)
        {
            UIDebug.instance.node.active = game.isDebug;            
        }
        /*
        var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.PROPORTION_TO_FRAME, cc.ContentStrategy.EXACT_FIT);
        cc.view.setDesignResolutionSize(1280, 720, policy);
        cc.view.resizeWithBrowserSize(false); //required for Chrome
        */
    },

    whenLoggedIn: function(client)
    {
        //cc.log('Logged-in!')
        game.api = client;
        //game.api.channelId = undefined;
        //game.api.channelId = '59b170f05e8d9e38f0f399b8';
        game.pullDatabase();       

    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
