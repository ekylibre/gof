// Startup component, used to initialize the game
//
// Must be started before every other "GoF" components

const i18n = require('LanguageData');
const ApiClient = require('./ApiClient');

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
        this.whenLoggedIn();

        // var endpoint = '/api';
        // var isPreview = location.hostname == 'localhost' && location.port != 3000;
        // if(isPreview) {
        //     endpoint = 'http://gof.julien.dev:3000/api';
        // }
        
        // var self = this;
        // var client = new ApiClient(endpoint);
        // client.checkAuth(
        //     (error, response, c) => {
        //         if(error) {
        //             if(isPreview) {
        //                 var email = prompt('email');
        //                 var password = prompt('password');

        //                 c.login(email, password, 
        //                     (error, response, c) => {
        //                         if(!error) {
        //                             document.cookie = "access_token="+response.payload.accessToken;
        //                             localStorage.setItem("gof-access-token", response.payload.accessToken);
                                    
        //                             whenLoggedIn(client);
        //                         }
        //                 });
        //             } else {
        //                 console.log('going /');
        //                 return;
        //                 //return location.replace('/');
        //             }
        //         }
        //         self.whenLoggedIn(client);
        //     }
        // );
        
    },


    whenLoggedIn: function(client)
    {
        game.api = client;
        game.pullDatabase();
        

        // client.getPlants({cultureMode: 'normal', __v:0}, 
        //     (error, response, client) => {
        //         console.log("client.getPlants response");
        //         console.log(response);

        //         console.log("client.getPlants ERROR");
        //         console.log(error);
        // });

        // client.getPlant('598041ce31dc2c27ecfd7d2a', 
        //     (error, response, client) => {
        //         console.log("client.getPlant response");
        //         console.log(response);

        //         console.log("client.getPlant ERROR");
        //         console.log(error);
        // });
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
