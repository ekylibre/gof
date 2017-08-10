require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ApiClient":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'a5aaaraT9pJs4mh90pQOvW8', 'ApiClient');
// Scripts/ApiClient.js

'use strict';

/**
 * @param {String} _EndPoint: API url
 */
function ApiClient(_EndPoint) {
    this.endPoint = _EndPoint;

    var elem = document.getElementById('GameCanvas');
    var at = elem.getAttribute('gof-access-token') || localStorage.getItem('gof-access-token');

    if (at) {
        this.accessToken = at;
    }
}

function params(payload) {
    if (!payload) {
        return '';
    }
    var p = '';
    var keys = Object.keys(payload);
    for (var i = 0; i < keys.length; ++i) {
        if (i > 0) {
            p += '&';
        }
        p += keys[i] + '=' + encodeURIComponent(payload[keys[i]]);
    }
    return p.length > 0 ? p : null;
}

function get(client, path, query, callback) {
    return buildRequest(client, 'GET', path, query, callback);
}

function post(client, path, callback) {
    var req = buildRequest(client, 'POST', path, null, callback);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    return req;
}

function buildRequest(client, method, path, query, callback) {
    var req = new XMLHttpRequest();
    var qs = params(query);
    var p = client.endPoint + path + (qs.length ? '?' + qs : '');
    req.open(method, p, true);

    if (client.accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + client.accessToken);
    }

    req.onreadystatechange = function (event) {
        if (req.readyState != 4) {
            return;
        }

        var json = null;
        try {
            json = JSON.parse(req.responseText);
        } catch (e) {}

        if (req.status !== 200) {
            if (callback) {
                callback(json, null, client);
                return;
            }
        }
        if (callback) {
            callback(null, json, client);
        }
    };
    return req;
}

/**
 * Check if user is logged in
 * @method checkAuth
 * @param callback: the callback which will be fired when we got a response
  */
ApiClient.prototype.checkAuth = function (callback) {
    var req = get(this, '/auth/check', null, callback);
    req.send(null);
};

/**
 * Login
 * @method login
 * @param email: the email of the user
 * @param password: the password in clear 
 * @param callback: the callback which will be fired when we got a response
  */
ApiClient.prototype.login = function (email, password, callback) {

    var req = post(this, '/auth/login', function (error, response, client) {
        if (response) {
            client.accessToken = response.payload.accessToken;
        }

        callback(error, response, client);
    });
    var p = params({
        email: email,
        password: password
    });
    req.send(p);
};

/**
 * @method: getPlant
 * @param id: the mongoId of the plant
 * @callback: the callback triggered with the response or error
 */
ApiClient.prototype.getPlant = function (id, callback) {
    var req = get(this, '/plants/' + encodeURIComponent(id), null, callback);
    req.send();
};

/**
 * @method getPlants
 * @param options: object of query string parameters, each field of the Plant schema could be used
 * @param callback: the callback triggered with the response or error
 */
ApiClient.prototype.getPlants = function (options, callback) {
    var req = get(this, '/plants', options, callback);
    req.send();
};

/**
 * @method getScenarios
 * @param uid: The name of the scenario or null/undefined if you want to get the list of scenarios
 * @param callback: the callback triggered with the response or error
 */
ApiClient.prototype.getScenarios = function (uid, callback) {
    var req = null;
    if (uid) {
        req = get(this, '/scenarios/' + encodeURIComponent(uid), null, callback);
    } else {
        req = get(this, '/scenarios', null, callback);
    }
    req.send();
};

module.exports = ApiClient;

cc._RF.pop();
},{}],1:[function(require,module,exports){
'use strict';

module.exports = Object.freeze({
    CultureModeEnum : {
        NORMAL : 'normal',
        BIO: 'bio',
        PERMACULTURE: 'permaculture'
    },

});
},{}],"Farm":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'a0071wrzthDjJMdvjOEmTUS', 'Farm');
// Scripts/Farm.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CParcel = require('Parcel');
var CGamePhase = require('GamePhase');

/**
 * The farm
 * @class CFarm
 * 
 * @property {String}               name: farm name
 * @property {Array:cc.CParcel}     parcels: array of parcels
 * @property {number}               totalSurface: total surface of parcels (hectare)
 * @property {number}               surfacePerTile: surface per tile (for parcels)
 * @property {Array:strings}        possibleSpecies: list of possible plant species
 * @property {number}               money: current money
 * @property {number}               year: current year delta [0, ?]
 * @property {number}               month: current month [0, 11]
 * @property {number}               week: current week in month [0,3]
 */

var CFarm = function () {
    /**
     * @constructor
     * @param {String} _Name name of farm
     * @param {number} _Surface total parcels surface (hectare)
     */
    function CFarm(_Name, _Surface) {
        _classCallCheck(this, CFarm);

        this.name = _Name;

        if (_Surface === undefined) {
            this.totalSurface = 0;
        } else {
            this.totalSurface = _Surface;
        }

        this.surfacePerTile = 1;

        this.parcels = [];
        this.possibleSpecies = [];
        this.money = 0;

        this.year = 0;
        this.month = 0;
        this.week = 0;
    }

    /**
     * Adds a parcel to the farm
     * @method addParcel
     * @param {CParcel} _Parcel 
     */


    _createClass(CFarm, [{
        key: 'addParcel',
        value: function addParcel(_Parcel) {
            this.parcels.push(_Parcel);
        }

        /**
         * @method findParcelAt
         * @param {cc.Vec2} _Pos: position of tile in map
         * @return {CParcel} or null
         */

    }, {
        key: 'findParcelAt',
        value: function findParcelAt(_Pos) {
            for (var i = 0; i < this.parcels.length; i++) {
                var parcel = this.parcels[i];
                if (parcel.hasTile(_Pos)) {
                    return parcel;
                }
            }

            return null;
        }

        /**
         * @method findParcelAdjacent
         * @param {cc.Vec2} _Pos: position of tile in map
         * @return {CParcel} or null
         */

    }, {
        key: 'findParcelAdjacent',
        value: function findParcelAdjacent(_Pos) {
            for (var i = 0; i < this.parcels.length; i++) {
                var parcel = this.parcels[i];
                if (parcel.isAdjacent(_Pos)) {
                    return parcel;
                }
            }

            return null;
        }

        /**
         * Finds a parcel with specified UID
         * @method findParcelUID
         * @param {String} _UID parcel unique identifier
         * @returns {CParcel} the parcel, or null
         */

    }, {
        key: 'findParcelUID',
        value: function findParcelUID(_UID) {
            if (_UID !== undefined) {
                var parcel = this.parcels.find(function (p) {
                    return p.uid == _UID;
                });
                if (parcel !== undefined) {
                    return parcel;
                }
                // for (var i=0; i<this.parcels.length; i++)
                // {
                //     var parcel = this.parcels[i];
                //     if (parcel.uid === _UID)
                //     {
                //         return parcel;
                //     }
                // }
            }

            return null;
        }
    }]);

    return CFarm;
}();

exports.default = CFarm;
module.exports = exports['default'];

cc._RF.pop();
},{"GamePhase":"GamePhase","Parcel":"Parcel"}],"GameParcel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0f957aWFChBMZjyNBE3iwfh', 'GameParcel');
// Scripts/GameParcel.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a 'parcel' 
 * @class
 * @property {string} uid: unique identifier
 * @property {Object} solution: the next plants that shoud be planted
 * @property {array} history: what has been growing on this parcel year by year
 */

var CGameParcel = function CGameParcel() {
  _classCallCheck(this, CGameParcel);
};

exports.default = CGameParcel;
module.exports = exports["default"];

cc._RF.pop();
},{}],"GamePhase":[function(require,module,exports){
"use strict";
cc._RF.push(module, '3ac1bWprMFKCozrFNz9biyB', 'GamePhase');
// Scripts/GamePhase.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// GamePhase class ("scenario")

/**
 * Represents a 'phase' of the game (scenario or part of a scenario)
 * @class
 * @property {string} uid: unique identifier
 * @property {number} startMoney: money given if 1st phase
 * @property {number} startMonth: starting month
 * @property {number} startWeek: starting week in month
 * @property {number} startYearDiff: interval of year if not 1st phase
 * @property {number} perfectScore: score received for doing a perfect phase
 * @property {number} maxPrevisions: maximum number of rotation previsions per parcel
 * @property {array:string} plantExcludes: array of uid of plants to exclude during this phase
 * @property {array:CGameParcel}  parcels: parcels setup data
 */
var CGamePhase = function CGamePhase() {
    _classCallCheck(this, CGamePhase);

    this.uid = 'assolement';
    this.startMoney = 50000;
    this.startMonth = 7;
    this.startWeek = 3;
    this.introTextId = null;
    this.objctiveTextId = null;
    this.startYearDiff = 0;
    this.perfectScore = 0;
    this.maxPrevisions = 1;
    this.endCondition = 'false';
    this.completionStr = '';
    this.plantExcludes = [];
    this.parcels = [{
        uid: 'parcel1',
        history: [{
            species: 'ble',
            culture: 'bio'
        }, {
            species: 'orge',
            culture: 'normal'
        }]
    }];
};

exports.default = CGamePhase;
module.exports = exports['default'];

cc._RF.pop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RF.push(module, '37f159UDU9GBpEOdPYC0xWt', 'Game');
// Scripts/Game.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Game "singleton" implementation
// How to use:
//      const CGame = require('Game');
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

var CGamePhase = require('./GamePhase');
var CGameParcel = require('./GameParcel');
var CFarm = require('./Farm');
var CPlant = require('./Plant');
var i18n = require('LanguageData');
var SharedConsts = require('../../../common/constants');
var ApiClient = require('./ApiClient');
var UIDebug = require('./UI/UIDebug');
var UIEnv = require('./UI/UIEnv');

var DEBUG = false;

// Game configuration when DEBUG is true
var ConfigDebug = {
    LANGUAGE_DEFAULT: 'fr',
    MAP_ZOOM_MAX: 1.7,
    MAP_ZOOM_MIN: 0.1
};

// Game configuration
var ConfigMaster = {
    LANGUAGE_DEFAULT: 'fr',
    MAP_ZOOM_MAX: 1,
    MAP_ZOOM_MIN: 0.4
};

var instance = null;

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
var CGame = (_temp = _class = function () {

    /**
     * @private
     * @type {CGamePhase}
     */

    /**
     * Game state enum
     * @enum
     */
    function CGame() {
        _classCallCheck(this, CGame);

        this.state = CGame.State.INVALID;
        this._currPhase = null;
        this._startYear = 0;

        if (instance) {
            return instance;
        }

        instance = this;

        this.isDebug = DEBUG;
        this.constants = SharedConsts;

        if (DEBUG) {
            this.config = ConfigDebug;
        } else {
            this.config = ConfigMaster;
        }

        i18n.init(this.config.LANGUAGE_DEFAULT);

        this.farm = new CFarm();

        var now = new Date(Date.now());
        this.farm.year = now.getFullYear();

        this.plants = [];
    }

    /**
     * @private
     * @type {Number}
     */


    /**
     * @type {CGame.State}
     */


    _createClass(CGame, [{
        key: 'findPlant',


        /**
         * Returns plant data of specified species
         * @param {String} _Species
         * @return {CPlant} the data, or null
         */
        value: function findPlant(_Species) {
            if (_Species !== undefined && _Species != null) {
                var plant = this.plants.find(function (el) {
                    return el.species == _Species;
                });
                if (plant !== undefined) {
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

    }, {
        key: 'pullDatabase',
        value: function pullDatabase() {
            if (!this.api) {
                cc.error('Please setup CGame.api');
                return;
            }

            this.api.getPlants(null, function (error, json, c) {
                if (error) {
                    UIEnv.message.show(i18n.t('error_connection_failed') + '\n\n(' + error + ')', i18n.t('error'), {
                        buttons: 'none'
                    });
                    UIDebug.log('Error: Failed to get plants:' + error);
                    return;
                }

                if (json && Array.isArray(json)) {
                    UIDebug.log('Pulled plants: ' + json.length);
                    for (var i = 0; i < json.length; i++) {
                        var jsonPlant = json[i];
                        /*if (jsonPlant.species == 'pasture')
                        {
                            jsonPlant.species = 'fallow';
                        }*/
                        var plant = instance.findPlant(jsonPlant.species);
                        if (plant != null) {
                            plant.updatePrices(jsonPlant);
                        } else {
                            plant = new CPlant(jsonPlant);
                            if (plant._valid) {
                                instance.plants.push(plant);
                            }
                        }
                    }

                    instance.state = CGame.State.READY;
                } else {
                    UIEnv.message.show(i18n.t('error_connection_failed'), i18n.t('error'), {
                        buttons: 'none'
                    });
                    UIDebug.log('Error: Invalid response for getPlants: ' + json);
                }
            });
        }

        /**
         * Starts current phase
         */

    }, {
        key: 'phaseStart',
        value: function phaseStart() {
            if (this.state == CGame.State.PHASE_READY) {
                this.state = CGame.State.PHASE_RUN;
            } else {
                cc.error('Invalid state to start a phase: ' + Object.keys()[this.state + 1]);
            }
        }

        /**
         * Ends current phase
         */

    }, {
        key: 'phaseFinish',
        value: function phaseFinish() {}
        //TODO


        /**
         * true if current phase ending conditions are done
         * @return {Boolean}
         */

    }, {
        key: 'phaseCanFinish',
        value: function phaseCanFinish() {
            return eval(this._currPhase.endCondition) === true ? true : false;
        }

        /**
         * returns the "completion" string of current phase
         * @return {String}
         */

    }, {
        key: 'phaseGetCompletionStr',
        value: function phaseGetCompletionStr() {
            return eval(this._currPhase.completionStr);
        }

        /**
         * returns the "introduction" string of current phase
         * @return {String}
         */

    }, {
        key: 'phaseGetIntroText',
        value: function phaseGetIntroText() {
            return i18n.t(this._currPhase.introTextId);
        }

        /**
         * returns the "objective" string of current phase
         * @return {String}
         */

    }, {
        key: 'phaseGetObjectiveText',
        value: function phaseGetObjectiveText() {
            return i18n.t(this._currPhase.objectiveTextId);
        }

        /**
         * Loads a new phase
         * @param {String} uid phase unique indentifier
         * @param {Function} callback function to call when the phase is loaded
         * @async
         */

    }, {
        key: 'loadPhase',
        value: function loadPhase(uid, callback) {
            var _this = this;

            this.state = CGame.State.PHASE_LOAD;

            this.api.getScenarios(uid, function (error, json) {
                if (error) {
                    callback(new Error('Error: Failed to get scenario with uid:' + uid + ' ' + error));
                    return;
                }

                if (json.scenario.start.farm.parcels.length > _this.farm.parcels.length) {
                    callback(new Error('Error: the scenario ' + uid + ' contains more parcels than the current gfx farm'));
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

                if (uid === 'croprotation') {
                    phase.maxPrevisions = 1;
                } else {
                    phase.maxPrevisions = 0;
                }

                phase.parcels = new Array();
                for (var i = 0; i < json.scenario.start.farm.parcels.length; ++i) {
                    var sParcel = json.scenario.start.farm.parcels[i];
                    //TODO get parcel from name ?
                    var parcel = new CGameParcel();
                    parcel.uid = sParcel.uid;
                    parcel.solution = sParcel.data.solution;

                    parcel.history = new Array();
                    for (var j = 0; j < sParcel.data.rotationHistory.length; ++j) {
                        parcel.history.push(sParcel.data.rotationHistory[j]);
                    }

                    phase.parcels.push(parcel);
                }

                _this.phase = phase;
                callback(null);
            });
        }

        // DEBUG: creates random rotation history

    }, {
        key: 'createRandomPhase',
        value: function createRandomPhase() {
            this.phase = new CGamePhase();

            for (var p = 0; p < this.farm.parcels.length; p++) {
                var parcel = this.farm.parcels[p];
                parcel.rotationHistory = [];
                for (var h = 0; h < 5; h++) {
                    var id = Math.floor(cc.random0To1() * this.plants.length);
                    if (id == this.plants.length) id--;
                    var plant = this.plants[id];

                    var culture = SharedConsts.CultureModeEnum.NORMAL;
                    id = Math.floor(cc.random0To1() * 3);
                    if (id == 1) {
                        culture = SharedConsts.CultureModeEnum.BIO;
                    }
                    if (id == 2) {
                        culture = SharedConsts.CultureModeEnum.PERMACULTURE;
                    }

                    parcel.rotationHistory.push({
                        'species': plant.species,
                        'culture': culture
                    });
                }
            }
        }
    }, {
        key: 'phase',
        get: function get() {
            return this._currPhase;
        },
        set: function set(_Phase) {
            if (_Phase !== undefined && _Phase !== null) {
                if (this._currPhase !== null && this._currPhase.uid == _Phase.uid) {
                    // same phase
                    return;
                }

                this.farm.month = _Phase.startMonth;
                this.farm.week = _Phase.startWeek;

                if (this._currPhase === null) {
                    // First phase
                    // Give money
                    this.farm.money = _Phase.startMoney;
                    this.farm.plantExcludes = _Phase.plantExcludes;

                    // Setup parcels history
                    for (var i = 0; i < _Phase.parcels.length; i++) {
                        var setup = _Phase.parcels[i];
                        var parcel = this.farm.findParcelUID(setup.uid);
                        if (parcel != null) {
                            parcel.rotationHistory = setup.history;
                            parcel.solution = setup.solution;
                        } else {
                            cc.error('Could not find parcel uid ' + setup.uid);
                        }
                    }
                } else {
                    // Add year difference if needed
                    /**
                     * @todo also change parcels history
                     */
                    this.farm.year += _Phase.startYearDiff;
                }

                this._currPhase = _Phase;
                this.state = CGame.State.PHASE_READY;
            } else {
                this._currPhase = null;
                if (this.state != CGame.State.INVALID) {
                    this.state = CGame.State.READY;
                }
            }
        }
    }]);

    return CGame;
}(), _class.State = {
    INVALID: -1,
    READY: 0,
    PHASE_SELECT: 10,
    PHASE_LOAD: 11,
    PHASE_READY: 12,
    PHASE_RUN: 13,
    PHASE_SCORE: 14
}, _temp);
exports.default = CGame;
module.exports = exports['default'];

cc._RF.pop();
},{"../../../common/constants":1,"./ApiClient":"ApiClient","./Farm":"Farm","./GameParcel":"GameParcel","./GamePhase":"GamePhase","./Plant":"Plant","./UI/UIDebug":"UIDebug","./UI/UIEnv":"UIEnv","LanguageData":"LanguageData"}],"LanguageData":[function(require,module,exports){
"use strict";
cc._RF.push(module, '61de062n4dJ7ZM9/Xdumozn', 'LanguageData');
// LanguageData.js

'use strict';

var Polyglot = require('polyglot.min');

var polyInst = null;
if (!window.i18n) window.i18n = { languages: {}, curLang: '' };

if (CC_EDITOR) {
    Editor.Profile.load('profile://project/i18n.json', function (err, profile) {
        window.i18n.curLang = profile['default_language'];
        if (polyInst) {
            var data = loadLanguageData(window.i18n.curLang);
            initPolyglot(data);
        }
    });
}

function loadLanguageData(language) {
    return window.i18n.languages[language];
}

function initPolyglot(data) {
    if (data) {
        if (polyInst) {
            polyInst.replace(data);
        } else {
            polyInst = new Polyglot({ phrases: data, allowMissing: true });
        }
    }
}

module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init: function init(language) {
        if (language && language === window.i18n.curLang) {
            return;
        }
        var data = null;
        if (!language) {
            data = loadLanguageData(window.i18n.curLang);
        } else {
            data = loadLanguageData(language);
            window.i18n.curLang = language;
        }
        initPolyglot(data);
    },

    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     *
     * var myText = i18n.t('MY_TEXT_KEY');
     *
     * // if your data source is defined as
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t: function t(key, opt) {
        if (polyInst) {
            return polyInst.t(key, opt);
        }
    },


    inst: polyInst,

    updateSceneRenderers: function updateSceneRenderers() {
        // very costly iterations
        var rootNodes = cc.director.getScene().children;
        // walk all nodes with localize label and update
        var allLocalizedLabels = [];
        for (var i = 0; i < rootNodes.length; ++i) {
            var labels = rootNodes[i].getComponentsInChildren('LocalizedLabel');
            Array.prototype.push.apply(allLocalizedLabels, labels);
        }
        for (var _i = 0; _i < allLocalizedLabels.length; ++_i) {
            var label = allLocalizedLabels[_i];
            label.updateLabel();
        }
        // walk all nodes with localize sprite and update
        var allLocalizedSprites = [];
        for (var _i2 = 0; _i2 < rootNodes.length; ++_i2) {
            var sprites = rootNodes[_i2].getComponentsInChildren('LocalizedSprite');
            Array.prototype.push.apply(allLocalizedSprites, sprites);
        }
        for (var _i3 = 0; _i3 < allLocalizedSprites.length; ++_i3) {
            var sprite = allLocalizedSprites[_i3];
            sprite.updateSprite(window.i18n.curLang);
        }
    }
};

cc._RF.pop();
},{"polyglot.min":"polyglot.min"}],"LocalizedLabelExt":[function(require,module,exports){
"use strict";
cc._RF.push(module, '7eb01WD8EJDeZNKJNi9e5fa', 'LocalizedLabelExt');
// Scripts/UI/LocalizedLabelExt.js

'use strict';

// Used to automatically set the localized text of a "Label" or "RichText" component

// Modified from extension i18n/LocalizedLabel

var i18n = require('LanguageData');

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        menu: 'i18n/LocalizedTextExt'
    },

    properties: {
        dataID: {
            get: function get() {
                return this._dataID;
            },
            set: function set(val) {
                if (this._dataID !== val) {
                    this._dataID = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }
        },
        _dataID: '',

        forceUppercase: {
            get: function get() {
                return this._forceUppercase;
            },
            set: function set(val) {
                if (this._forceUppercase !== val) {
                    this._forceUppercase = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }
        },
        _forceUppercase: false
    },

    onLoad: function onLoad() {
        if (CC_EDITOR) {
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }
        if (!i18n.inst) {
            i18n.init();
        }
        // cc.log('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
        this.fetchRender();
    },
    fetchRender: function fetchRender() {
        var label = this.getComponent(cc.Label);
        if (!label) {
            label = this.getComponent(cc.RichText);
        }
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        }
    },
    updateLabel: function updateLabel() {
        if (!this.label) {
            cc.error('Failed to update localized text!');
            return;
        }
        var localizedString = i18n.t(this.dataID);
        if (localizedString) {
            if (this.forceUppercase) {
                localizedString = localizedString.toUpperCase();
            }
            this.label.string = localizedString;
        } else {
            cc.warn('Missing text id: ' + this.dataID);
        }
    }
});

cc._RF.pop();
},{"LanguageData":"LanguageData"}],"LocalizedLabel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '744dcs4DCdNprNhG0xwq6FK', 'LocalizedLabel');
// LocalizedLabel.js

'use strict';

var i18n = require('LanguageData');

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        menu: 'i18n/LocalizedLabel'
    },

    properties: {
        dataID: {
            get: function get() {
                return this._dataID;
            },
            set: function set(val) {
                if (this._dataID !== val) {
                    this._dataID = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }
        },
        _dataID: ''
    },

    onLoad: function onLoad() {
        if (CC_EDITOR) {
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }
        if (!i18n.inst) {
            i18n.init();
        }
        // cc.log('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
        this.fetchRender();
    },
    fetchRender: function fetchRender() {
        var label = this.getComponent(cc.Label);
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        }
    },
    updateLabel: function updateLabel() {
        if (!this.label) {
            cc.error('Failed to update localized label, label component is invalid!');
            return;
        }
        var localizedString = i18n.t(this.dataID);
        if (localizedString) {
            this.label.string = i18n.t(this.dataID);
        }
    }
});

cc._RF.pop();
},{"LanguageData":"LanguageData"}],"LocalizedSprite":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f34ac2GGiVOBbG6XlfvgYP4', 'LocalizedSprite');
// LocalizedSprite.js

'use strict';

var SpriteFrameSet = require('SpriteFrameSet');

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        inspector: 'packages://i18n/inspector/localized-sprite.js',
        menu: 'i18n/LocalizedSprite'
    },

    properties: {
        spriteFrameSet: {
            default: [],
            type: SpriteFrameSet
        }
    },

    onLoad: function onLoad() {
        this.fetchRender();
    },
    fetchRender: function fetchRender() {
        var sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.i18n.curLang);
            return;
        }
    },
    getSpriteFrameByLang: function getSpriteFrameByLang(lang) {
        for (var i = 0; i < this.spriteFrameSet.length; ++i) {
            if (this.spriteFrameSet[i].language === lang) {
                return this.spriteFrameSet[i].spriteFrame;
            }
        }
    },
    updateSprite: function updateSprite(language) {
        if (!this.sprite) {
            cc.error('Failed to update localized sprite, sprite component is invalid!');
            return;
        }

        var spriteFrame = this.getSpriteFrameByLang(language);

        if (!spriteFrame && this.spriteFrameSet[0]) {
            spriteFrame = this.spriteFrameSet[0].spriteFrame;
        }

        this.sprite.spriteFrame = spriteFrame;
    }
});

cc._RF.pop();
},{"SpriteFrameSet":"SpriteFrameSet"}],"MapCtrl":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e2e73B/wgFOW6TFModC0XXp', 'MapCtrl');
// Scripts/MapCtrl.js

'use strict';

//
// MapCtrl component
// Manages the map scrolling, UI, etc...
//
// *Add this on the ScrollView containing the TiledMaps*
//
// *Then in the ScrollView component, add a ScrollEvent pointing to*:
//      MapCtrl::scrollEvent(null, 0)
// (to disable touch when scrolling map)
//
// *All TiledMaps and layers must have the same size & tile size*
// 


var CGame = require('./Game');
var CGamePhase = require('./GamePhase');
var CFarm = require('./Farm');
var CParcel = require('./Parcel');
var UIParcelButton = require('./UI/UIParcelButton');

var UIEnv = require('./UI/UIEnv');
var UIOffice = require('./UI/UIOffice');
var UIDebug = require('./UI/UIDebug');

var i18n = require('LanguageData');

var game = new CGame();

/**
 * Manages the map scrolling, UI, etc...
 * @class
 * @name MapCtrl
 */
var MapCtrl = cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.ScrollView,
        menu: 'gof/MapCtrl'
    },

    properties: {

        /**
         * @property Layer to place the UI
         */
        mapUILayer: {
            default: null,
            type: cc.Node,
            displayName: 'UI layer'
        },

        /**
         * @property Starting scrollview position
         */
        startOffset: {
            default: new cc.Vec2(0, 0),
            displayName: 'Scroll starting pos'
        },

        /**
         * @property List of TiledMaps containing parcels ground
         */
        mapParcels: {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Parcels maps'
        },

        /**
         * @property List of TiledMaps containing the sprouts
         */
        mapSprouts: {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Sprouts maps'
        },

        // List of objects TiledMaps
        mapObjects: {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Objects maps'
        },

        /**
         * @property List of valid parcel tiles gid
         */
        parcelsGID: {
            default: [],
            type: [cc.Integer],
            displayName: 'Parcels GID'
        },

        /**
         * @property Prefab used to display a button over a parcel
         */
        parcelButtonPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: 'Prefab Parcels button'
        },

        // a debug prefab
        debugLabelPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    statics: {
        /**
         * @property {MapCtrl} instance current instance
         * @static
         */
        instance: null
    },

    /**
     * The ScrollView component
     */
    _mapScrollView: null,

    /**
     * The base tiledmap used as reference
     */
    _refMap: null,

    /**
     * First layer of the _refMap, used as reference
     */
    _refLayer: null,

    /**
     * Size of map in pixels
     */
    _refSize: null,

    // use this for initialization
    onLoad: function onLoad() {
        if (MapCtrl.instance == null) {
            MapCtrl.instance = this;
        } else {
            cc.error('An instance of MapCtrl already exists');
        }

        this._mapScrollView = this.getComponent(cc.ScrollView);
        this._mapStartSize = this._mapScrollView.content.getContentSize();

        // Setting touch events       
        this.initTouch();
    },

    start: function start(err) {
        if (err) return;

        // Scroll map to starting offset
        this._mapScrollView.scrollToOffset(this.startOffset);

        this.findParcels();

        if (game.isDebug) {
            this.addDebugInfo();
        }
    },

    /**
     * Updates the game state
     */
    update: function update(dt) {
        switch (game.state) {
            case CGame.State.READY:
                // CGame is ready, lets load a phase
                game.loadPhase('croprotation', function (error) {
                    if (error) {
                        UIEnv.message.show(i18n.t('error_connection_failed') + '\n\n(' + error + ')', i18n.t('error'), {
                            buttons: 'none'
                        });
                        UIDebug.log(error);
                        return;
                    }
                    UIDebug.log('Phase started: ' + game.phase.uid);
                });
                break;

            case CGame.State.PHASE_READY:
                // The phase is ready to start, display objective
                UIEnv.questIntro.show();
                break;
        }
    },

    /**
     * Checks if the view is going too far outside the map
     * (if yes, scroll back to a suitable position)
     */
    checkMapBorders: function checkMapBorders() {
        // Get center of screen
        var center = cc.v2(this._mapScrollView.node.width / 2, this._mapScrollView.node.height / 2);

        // convert to map space
        center = this._refMap.node.convertToNodeSpace(center);

        // convert to tile coordinate
        center = this.pixelToTile(center, true);

        // check if corresponding tile coordinate is out of range
        var margin = 1;
        var mapSize = this._refMap.getMapSize();
        var delta = 0;
        if (center.x < -margin) {
            delta = -center.x + margin;
            center.x = -margin;
        }
        if (center.x >= mapSize.width + margin) {
            delta += center.x - (mapSize.width + margin);
            center.x = mapSize.width + margin - 1;
        }
        if (center.y < -margin) {
            delta += -center.y + margin;
            center.y = -margin;
        }
        if (center.y >= mapSize.height + margin) {
            delta += center.y - (mapSize.height + margin);
            center.y = mapSize.height + margin - 1;
        }

        if (delta > 0) {
            // convert tile coordinates to pixel
            center = this.tileToPixel(center);

            // convert pixel position to scrollview "scroll offset"
            center = this.pixelToScroll(center);

            // move to center of screen
            center.x -= this._mapScrollView.node.width / 2;
            center.y -= this._mapScrollView.node.height / 2;

            // scroll
            this._mapScrollView.scrollToOffset(center, delta * 0.1);
        }
    },

    /**
     * Initializes touch events
     * @method
     */
    initTouch: function initTouch() {
        var _this = this;

        // Check map content
        if (this.mapParcels && this.mapParcels.length > 0) {
            this._refMap = this.mapParcels[0];
            this._refLayer = this._refMap.allLayers()[0];
        } else if (this.mapSprouts && this.mapSprouts.length > 0) {
            this._refMap = this.mapSprouts[0];
            this._refLayer = this._refMap.allLayers()[0];
        } else {
            cc.error('At least one parcel or sprout TiledMap is required');
            return;
        }

        // Compute full map size in pixels
        var mapSize = this._refMap.getMapSize();
        var tileSize = this._refMap.getTileSize();
        this._refSize = cc.v2(mapSize.width * tileSize.width, mapSize.height * tileSize.height);

        // Replace the _onMouseWheel callback from the ScrollView
        this._mapScrollView._onMouseWheel = function (event, captureListeners) {
            var speed = 0.05;
            if (event.getScrollY() < 0) {
                speed = -speed;
            }
            var scale = this.content.scaleX + speed;
            if (scale < game.config.MAP_ZOOM_MIN) {
                scale = game.config.MAP_ZOOM_MIN;
            }
            if (scale > game.config.MAP_ZOOM_MAX) {
                scale = game.config.MAP_ZOOM_MAX;
            }

            this.content.scaleX = scale;
            this.content.scaleY = scale;

            this.content.width = MapCtrl.instance._refSize.x * scale;
            this.content.height = MapCtrl.instance._refSize.y * scale;

            this._stopPropagationIfTargetIsMe(event);

            MapCtrl.instance.checkMapBorders();
        };

        // Register touch events
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            _this._scrollLen = 0;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            _this._scrollLen += cc.pLength(event.touch.getDelta());
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (_this._scrollLen > 2) {
                // scrollview is scrolling, ignore touch
                _this._scrollLen = 0;
                MapCtrl.instance.checkMapBorders();
                return;
            }
        });

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (_this._scrollLen > 2) {
                // scrollview is scrolling, ignore touch
                _this._scrollLen = 0;
                MapCtrl.instance.checkMapBorders();
                return;
            }

            // get "local" position
            var touch = event.touch;

            var loc = _this._refMap.node.convertToNodeSpace(touch.getLocation());
            UIDebug.touchLog = '' + touch.getLocationX() + ',' + touch.getLocationY() + ' => ' + loc;

            // var center = this.pixelToScroll(loc);
            // center.x -= (this._mapScrollView.node.width / 2);
            // center.y -= (this._mapScrollView.node.height / 2);
            // this._mapScrollView.scrollToOffset(center);

            if (_this.mapObjects && _this.mapObjects.length > 0) {
                for (var i = 0; i < _this.mapObjects.length; i++) {
                    if (_this.touchOnMap(_this.mapObjects[i], loc)) {
                        return;
                    }
                }
            }

            if (_this.mapSprouts && _this.mapSprouts.length > 0) {
                for (var i = 0; i < _this.mapSprouts.length; i++) {
                    if (_this.touchOnMap(_this.mapSprouts[i], loc)) {
                        return;
                    }
                }
            }

            if (_this.mapParcels && _this.mapParcels.length > 0) {
                for (var i = 0; i < _this.mapParcels.length; i++) {
                    if (_this.touchOnMap(_this.mapParcels[i], loc)) {
                        return;
                    }
                }
            }
        }, this.node);
    },

    /**
     *  Checks if there's something on map at specified 'pixel' position
     * @method
     * @param {cc.TiledMap} _Map the TiledMap to look into
     * @param {cc.Vec2}     _Pos the position in the map in pixels
     * @return {Boolean}
     */
    touchOnMap: function touchOnMap(_Map, _Pos) {
        var layers = _Map.allLayers();

        var tilePos = this.pixelToTile(_Pos);
        if (tilePos == null) {
            // not on map
            return false;
        }

        // Parse objectsgroups
        var groups = _Map.getObjectGroups();
        for (var i = groups.length - 1; i >= 0; i--) {
            var group = groups[i];
            var objs = group.getObjects();

            for (var j = 0; j < objs.length; j++) {
                var obj = objs[j];

                var margin = 0.15;
                var w = obj.sgNode.width * (1 - margin * 2);
                var halfw = w / 2;
                var ydelta = obj.sgNode.height * margin;
                var h = obj.sgNode.height * (1 - margin * 2);
                var rect = cc.rect(obj.sgNode.x - halfw, obj.sgNode.y + ydelta, w, h);

                if (rect.contains(_Pos)) {
                    if (game.isDebug) {
                        UIDebug.log('Clicked on object ' + obj.name);
                    }

                    UIOffice.instance.show();
                    return true;
                }
            }
        }

        // Parse tiles layers
        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i];

            var tileGid = layer.getTileGIDAt(tilePos);
            if (tileGid != 0) {
                if (game.isDebug) {
                    var debug = 'Clicked on layer ' + layer.getLayerName() + ' tile(' + tilePos.x + ',' + tilePos.y + ') GID=' + tileGid;
                    var parcel = game.farm.findParcelAt(tilePos);
                    if (parcel != null) {
                        debug += ' Parcel: ' + parcel.name;
                    }

                    UIDebug.log(debug);
                }
                return true;
            }
        }

        return false;
    },

    /**
     * Converts a pixel position in map to tile coordinates
     * @param {cc.Vec2} _Pos: pixel position in map
     * @param {Boolean} _NoLimit: don't check on maps limits (i.e. always returns a position)
     * @return {cc.Vec2} tile coordinates (or null if out of map)
     */
    pixelToTile: function pixelToTile(_Pos) {
        var _NoLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var mapSize = this._refMap.getMapSize();

        var tw = this._refLayer.getMapTileSize().width;
        var th = this._refLayer.getMapTileSize().height;
        var mw = this._refLayer.getLayerSize().width;
        var mh = this._refLayer.getLayerSize().height;

        var x = _Pos.x * 1;
        var y = _Pos.y * 1;

        var isox = Math.floor(mh - y / th + x / tw - mw / 2);
        var isoy = Math.floor(mh - y / th - x / tw + mw / 2);

        // true only if the coords are within the map
        if (_NoLimit || isox >= 0 && isoy >= 0 && isox < mapSize.width && isoy < mapSize.height) {
            return cc.v2(isox, isoy);
        }

        return null;
    },

    /**
     * Converts a map pixel position to a scroll offset (for the scrollview)
     * @param {cc.Vec2} _Pos: pixel position in map
     * @return {cc.Vec2}
     */
    pixelToScroll: function pixelToScroll(_Pos) {
        var scale = this._mapScrollView.content.scaleX;
        return cc.v2(_Pos.x * scale, (this._refSize.y - _Pos.y) * scale);
    },

    /**
     * Converts a tile position to a map pixel position
     * @param {cc.Vec2} _Pos: tile coordinates
     * @return {cc.Vec2}
     */
    tileToPixel: function tileToPixel(_Pos) {
        var pos = this._refLayer.getPositionAt(_Pos);
        // var size = this._refMap.getTileSize();
        // pos.x+= size.width / 2;
        // pos.y+= size.height / 2;
        return pos;
    },

    /**
     * Converts a tile position to a 'UI Layer' position
     * @method
     * @param {cc.Vec2} _Pos position of tile in map
     * @return {cc.Vec2}
     */
    tileToUI: function tileToUI(_Pos) {
        var ts = this._refMap.getTileSize();
        var pos = this._refLayer.getPositionAt(_Pos);
        pos.x += ts.width * 0.5;
        pos.y += ts.height * 0.5;
        return this.mapToUI(pos);
    },

    /**
     * Converts a pixel position in the map to a 'UI Layer' position
     * @method
     * @param {cc.Vec2} _Pos pixel position in map
     * @return {cc.Vec2}
     */
    mapToUI: function mapToUI(_Pos) {
        return cc.v2(_Pos.x - this.mapUILayer.width * 0.5, _Pos.y - this.mapUILayer.height * 0.5);
    },

    /**
     * Parses the parcels map to create CParcel objects
     * @method
     */
    findParcels: function findParcels() {
        if (this.mapParcels && this.parcelsGID && this.parcelsGID.length > 0) {
            var totalTiles = 0;
            for (var i = 0; i < this.mapParcels.length; i++) {
                var mapSize = this.mapParcels[i].getMapSize();

                for (var j = 0; j < this.mapParcels[i].allLayers().length; j++) {
                    var layer = this.mapParcels[i].allLayers()[j];
                    for (var y = 0; y < mapSize.height; y++) {
                        for (var x = 0; x < mapSize.width; x++) {
                            if (this.parcelsGID.includes(layer.getTileGIDAt(x, y))) {
                                var pos = new cc.Vec2(x, y);
                                var parcel = game.farm.findParcelAdjacent(pos);
                                if (parcel != null && parcel.tiledLayer == layer) {
                                    // adjacent parcel found, add tile to it
                                    parcel.addTile(pos);
                                } else {
                                    // create a new parcel
                                    var uid = 'parcel' + (game.farm.parcels.length + 1);
                                    var name = i18n.t('parcel') + ' ' + String(game.farm.parcels.length + 1);
                                    parcel = new CParcel(uid, name, layer);
                                    parcel.addTile(pos);
                                    game.farm.addParcel(parcel);
                                }

                                totalTiles++;
                                //DEBUG
                                //layer.setTileGID(0, x, y);
                            }
                        }
                    }
                }

                // Compute the surface in Ha of a tile
                cc.log('TODO: setup the total surface from a metadata in the map?');
                game.farm.totalSurface = 55;
                game.farm.surfacePerTile = game.farm.totalSurface / totalTiles;
            }
        }

        // Compute parcels surface depending on total farm surface
        // and display info button over each one
        if (game.farm.parcels.length > 0) {
            for (var k = 0; k < game.farm.parcels.length; k++) {
                var parcel = game.farm.parcels[k];

                // surface in Ha
                parcel.surface = Math.ceil(parcel.surface * game.farm.surfacePerTile * 100) / 100;

                var btPrefab = cc.instantiate(this.parcelButtonPrefab);
                var bt = btPrefab.getComponent(UIParcelButton);
                bt.parcel = parcel;
                btPrefab.setParent(this.mapUILayer);
                btPrefab.setPosition(this.tileToUI(parcel.rect.center));

                //DEBUG
                //parcel.rotationPrevision.push({species: 'carrot', culture: 'normal'});
            }
        } else {
            cc.error('No parcels found! Please check you filled the mapParcel and parcelGID arrays');
        }
    },

    addDebugInfo: function addDebugInfo() {
        // Display info labels on top of map objects
        if (this.mapObjects) {
            for (var k = 0; k < this.mapObjects.length; k++) {
                var groups = this.mapObjects[k].getObjectGroups();
                for (var i = groups.length - 1; i >= 0; i--) {
                    var group = groups[i];
                    var objs = group.getObjects();

                    for (var j = 0; j < objs.length; j++) {
                        var obj = objs[j];
                        var sgPos = cc.v2(obj.sgNode.x, obj.sgNode.y);

                        var dbg = cc.instantiate(this.debugLabelPrefab);
                        dbg.setParent(this.mapUILayer);
                        dbg.setPosition(this.mapToUI(sgPos));

                        var label = dbg.getComponentInChildren(cc.Label);

                        label.string = obj.name + ': ' + Math.floor(obj.sgNode.x) + ',' + Math.floor(obj.sgNode.y);
                    }
                }
            }
        }

        // cc.log('NbParcels='+game.farm.parcels.length);
        // for (var k=0; k<game.farm.parcels.length; k++)
        // {
        //     var parcel = game.farm.parcels[k];
        //     cc.log(parcel.name+': '+parcel.tiles.length);

        //     // show label at center
        //     var dbg = cc.instantiate(this.debugLabelPrefab);
        //     dbg.setParent(this.mapUILayer);
        //     dbg.setPosition(this.tileToUI(parcel.rect.center));

        //     var label = dbg.getComponentInChildren(cc.Label);         

        //     label.string = parcel.name+' s='+parcel.surface+' (c='+parcel.rect.center.x+','+parcel.rect.center.y+')';
        // }
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {

    // },


    __Debug: function __Debug() {

        // DEBUG
        // _ccsg.TMXLayer.prototype.getTileAt = function(pos, y)
        // {
        //     if (void 0 === pos) {
        //         throw new Error("_ccsg.TMXLayer.getTileAt(): pos should be non-null");
        //     }
        //     var x = pos;
        //     if (void 0 === y) {
        //         x = pos.x;
        //         y = pos.y;
        //     }
        //     if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
        //         throw new Error("_ccsg.TMXLayer.getTileAt(): invalid position");
        //     }
        //     if (!this.tiles) {
        //         cc.logID(7204);
        //         return null;
        //     }
        //     var tile = null, gid = this.getTileGIDAt(x, y);
        //     if (0 === gid) {
        //         return tile;
        //     }
        //     var z = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        //     tile = this._spriteTiles[z];
        //     if (!tile) {
        //         var rect = this._texGrids[gid];
        //         var tex = this._textures[rect.texId];
        //         tile = new _ccsg.Sprite(tex, rect);
        //         tile.setPosition(this.getPositionAt(x, y));
        //         var vertexZ = this._vertexZForPos(x, y);
        //         tile.setVertexZ(vertexZ);
        //         tile.setAnchorPoint(0, 0);
        //         tile.setOpacity(this._opacity);
        //         //this.addChild(tile, vertexZ, z);
        //     }
        //     return tile;
        // };


    }

});

module.exports = MapCtrl;

cc._RF.pop();
},{"./Farm":"Farm","./Game":"Game","./GamePhase":"GamePhase","./Parcel":"Parcel","./UI/UIDebug":"UIDebug","./UI/UIEnv":"UIEnv","./UI/UIOffice":"UIOffice","./UI/UIParcelButton":"UIParcelButton","LanguageData":"LanguageData"}],"Parcel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '65708Jw+k5C1oyCvtOGSAar', 'Parcel');
// Scripts/Parcel.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parcel state enum
 * @enum ParcelState
 */
var ParcelState = cc.Enum({
    EMPTY: 0,
    FALLOW: 1, // en jachère
    PLOWED: 2, // labourée
    SEEDS: 4,
    GROWING: 5,
    READY: 6
});

/**
 * A parcel from the map
 * @class CParcel
 * @property {String}           uid: unique identifier
 * @property {String}           name: parcel name
 * @property {cc.TiledLayer}    tiledLayer: TiledLayer containing the parcel
 * @property {Array:cc.Vec2}    tiles: array of tiles positions
 * @property {cc.Rect}          rect: rectangle containg the parcel
 * @property {ParcelState}      state: current parcel state
 * @property {number}           surface: surface area of parcel (hectare)
 * @property {Array:{species, culture}}            rotationHistory: history of crop rotation (most recent first)
 * @property {Array:{species, culture}}            rotationPrevision: previsions of crop rotation (next one is first)
 */

var CParcel = function () {

    /**
     * @constructor
     * @param {string} _UID: parcel unique identifier
     * @param {string} _Name: parcel name
     * @param {cc.TiledLayer} _TiledLayer: layer containing the parcel
     */
    function CParcel(_UID, _Name, _TiledLayer) {
        _classCallCheck(this, CParcel);

        this.uid = _UID;

        if (_Name === undefined) {
            this.name = '';
        } else {
            this.name = _Name;
        }
        this.tiledLayer = _TiledLayer;
        this.tiles = [];
        this.rect = cc.rect();
        this.state = ParcelState.EMPTY;
        this.surface = 0;

        this.rotationHistory = [];
        this.rotationPrevision = [];
        this.solution = null;
    }

    /**
     * Checks if given tile exists in the parcel
     * @method hasTile
     * @param {cc.Vec2} _Pos: position of tile in map
     * @return {Boolean}
     */


    _createClass(CParcel, [{
        key: 'hasTile',
        value: function hasTile(_Pos) {
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].x === _Pos.x && this.tiles[i].y === _Pos.y) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Checks if given tile is adjacent to one in the parcel
         * @method isAdjacent
         * @param {cc.Vec2} _Pos: position of tile in map
         * @return {Boolean}
         */

    }, {
        key: 'isAdjacent',
        value: function isAdjacent(_Pos) {
            for (var i = 0; i < this.tiles.length; i++) {
                var pos1 = this.tiles[i];
                if (Math.abs(pos1.x - _Pos.x) == 1 && Math.abs(pos1.y - _Pos.y) == 0) {
                    return true;
                }

                if (Math.abs(pos1.y - _Pos.y) == 1 && Math.abs(pos1.x - _Pos.x) == 0) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Add a tile to the parcel (without any check)
         * @method addTile
         * @param {cc.Vec2} _Pos: position of tile in map
         */

    }, {
        key: 'addTile',
        value: function addTile(_Pos) {
            // Add tile to the array
            this.tiles.push(_Pos);

            if (this.rect.width == 0) {
                this.rect.x = _Pos.x;
                this.rect.y = _Pos.y;
                this.rect.width = 1;
                this.rect.height = 1;
            }

            // Updates rectangle
            if (this.rect.x > _Pos.x) {
                this.rect.x = _Pos.x;
            }
            if (this.rect.xMax < _Pos.x) {
                this.rect.width = _Pos.x - this.rect.x;
            }
            if (this.rect.y > _Pos.y) {
                this.rect.y = _Pos.y;
            }
            if (this.rect.yMax < _Pos.y) {
                this.rect.height = _Pos.y - this.rect.y;
            }

            this.surface++;
        }
    }]);

    return CParcel;
}();

exports.default = CParcel;
module.exports = exports['default'];

cc._RF.pop();
},{}],"Plant":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5c449arTcdBdrBCkvQ3zcI7', 'Plant');
// Scripts/Plant.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SharedConsts = require('../../../common/constants');

/**
 * Represents a plant species available in the game
 * @class
 * @property {String} species plant species
 * @property {Dictionary(key: CultureModeEnum, value: number)} dbId entry id in database for each culture modes
 * @property {Dictionary(key: CultureModeEnum, value: number)} buyPrices price of seeds for a culture mode and per hectare
 * @property {Dictionary(key: CultureModeEnum, value: number)} sellPrices selling price of a ton of product
 */

var CPlant = function () {
    /**
     * @constructor
     * @param {String} _JSON JSon representing a plant from the database
     */
    function CPlant(_JSON) {
        _classCallCheck(this, CPlant);

        this._valid = true;

        this.dbId = {};
        this.buyPrices = {};
        this.sellPrices = {};

        this.tiledGID = [];

        if (_JSON !== undefined) {
            this.species = _JSON.species;

            this.updatePrices(_JSON);
        }

        if (this.species === undefined) {
            this.valid = false;
            cc.error('Invalid plant JSon: ' + _JSON);
        }
    }

    _createClass(CPlant, [{
        key: 'updatePrices',
        value: function updatePrices(_JSON) {
            if (_JSON.cultureMode !== undefined && _JSON.pricePerHectare !== undefined) {
                var mode = this._CultureMode(_JSON.cultureMode);
                if (this.dbId[mode] && this.dbId[mode] != _JSON._id) {
                    cc.warn('Conflict on plant: ' + this.species + ' / mode: ' + mode);
                }

                this.dbId[mode] = _JSON._id;

                this.buyPrices[mode] = _JSON.pricePerHectare;

                this.sellPrices[mode] = _JSON.pricePerHectare * 10;
            }
        }
    }, {
        key: '_CultureMode',
        value: function _CultureMode(_Mode) {
            var mode = _Mode;
            if (mode != SharedConsts.CultureModeEnum.NORMAL && mode != SharedConsts.CultureModeEnum.BIO && mode != SharedConsts.CultureModeEnum.PERMACULTURE) {
                cc.error('Invalid culture mode: ' + _Mode);
                mode = SharedConsts.CultureModeEnum.NORMAL;
            }

            return mode;
        }
    }, {
        key: 'getBuyPrice',
        value: function getBuyPrice(_Mode) {
            return this.buyPrices[this._CultureMode(_Mode)];
        }
    }, {
        key: 'getSellPrice',
        value: function getSellPrice(_Mode) {
            return this.sellPrices[this._CultureMode(_Mode)];
        }
    }, {
        key: 'isFallow',
        get: function get() {
            return this.species === 'fallow' || this.species === 'pasture';
        }
    }]);

    return CPlant;
}();

exports.default = CPlant;
module.exports = exports['default'];

cc._RF.pop();
},{"../../../common/constants":1}],"RscPreload":[function(require,module,exports){
"use strict";
cc._RF.push(module, '65250CXe7xM6InnrNr1oCQh', 'RscPreload');
// Scripts/RscPreload.js

'use strict';

/**
 * Component used to reference some resources used at runtime
 * @class
 * @name RscPreload
 */
var RscPreload = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/RscPreload'
    },

    properties: {
        /**
         * Atlas containing the "plants" icons
         */
        plantIconsAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        /**
         * Atlas containing the "plants" disabled icons
         */
        plantDisIconsAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        /**
         * Atlas of icon note
         */

        noteIconsAtlas: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    statics: {
        instance: null,

        _plantIconId: {
            'corn': 'mais',
            'wheat': 'ble',
            'durum_wheat': 'ble',
            'soft_wheat': 'ble',
            'carrot': 'carotte',
            'sunflower': 'tournesol',
            'barley': 'orge',
            'oat': 'avoine',
            'rye': 'seigle',
            'buckwheat': 'sarrasin',
            'pea': 'pois',
            'beetroot': 'betterave',
            'field_bean': 'feverole',
            'soy': 'soja',

            'pasture': 'prairies',
            'fallow': 'prairies'
        },

        getPlantIcon: function getPlantIcon(_species, _disabled) {
            if (RscPreload.instance === null) {
                cc.error('RscPreload not loaded');
                return null;
            }

            var id = RscPreload._plantIconId[_species];
            if (id === undefined) {
                id = _species;
            }

            if (_disabled) {
                return RscPreload.instance.plantDisIconsAtlas.getSpriteFrame('ico_' + id);
            } else {
                return RscPreload.instance.plantIconsAtlas.getSpriteFrame('ico_' + id);
            }
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (RscPreload.instance != null) {
            cc.error('An instance of RscPreload already exists');
        }

        RscPreload.instance = this;
    }

});

module.exports = RscPreload;

cc._RF.pop();
},{}],"SpriteFrameSet":[function(require,module,exports){
"use strict";
cc._RF.push(module, '97019Q80jpE2Yfz4zbuCZBq', 'SpriteFrameSet');
// SpriteFrameSet.js

'use strict';

var SpriteFrameSet = cc.Class({
    name: 'SpriteFrameSet',
    properties: {
        language: '',
        spriteFrame: cc.SpriteFrame
    }
});

module.exports = SpriteFrameSet;

cc._RF.pop();
},{}],"Startup":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ae2f9bQf21IhJYFeGxAPR6E', 'Startup');
// Scripts/Startup.js

'use strict';

// Startup component, used to initialize the game
//
// Must be started before every other "GoF" components

var i18n = require('LanguageData');
var ApiClient = require('./ApiClient');

var CGame = require('./Game');
var game = new CGame();

var UIDebug = require('./UI/UIDebug');
var UIEnv = require('./UI/UIEnv');

cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/Startup'
    },

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        // Select REST API endpoint
        var endpoint = '/api';
        var isPreview = location.hostname == 'localhost' && location.port != 3000;
        if (isPreview) {
            endpoint = 'http://gof.shinypix.dev:3000/api';
            //endpoint = 'http://gof.julien.dev:3000/api';
            //endpoint = 'http://localhost:3000/api';
        }

        UIDebug.log('API endpoint: ' + endpoint);

        var self = this;
        var client = new ApiClient(endpoint);
        client.checkAuth(function (error, response, c) {
            if (error) {
                if (isPreview) {
                    var email = prompt('email');
                    var password = prompt('password');

                    c.login(email, password, function (error, response, c) {
                        if (!error) {
                            localStorage.setItem("gof-access-token", response.payload.accessToken);
                            self.whenLoggedIn(client);
                        } else {
                            UIEnv.message.show(i18n.t('error_connection_failed'), 'Login failed!', {
                                onOk: function onOk() {
                                    location.reload();
                                }
                            });
                            UIDebug.log('Error: Login failed!');
                            cc.error('Login failed');
                        }
                    });
                } else {
                    UIEnv.message.show(i18n.t('error_auth_missing'), i18n.t('error'), {
                        onOk: function onOk() {
                            location.pathname = '/auth/login';
                        }
                    });
                    UIDebug.log('Error: you are not logged in!');
                    return;
                }
            } else {
                self.whenLoggedIn(client);
            }
        });
    },

    start: function start() {
        if (UIDebug.instance != null) {
            UIDebug.instance.node.active = game.isDebug;
        }

        var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.PROPORTION_TO_FRAME, cc.ContentStrategy.EXACT_FIT);
        cc.view.setDesignResolutionSize(1280, 720, policy);
        cc.view.resizeWithBrowserSize(false); //required for Chrome
    },

    whenLoggedIn: function whenLoggedIn(client) {
        //cc.log('Logged-in!')
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

cc._RF.pop();
},{"./ApiClient":"ApiClient","./Game":"Game","./UI/UIDebug":"UIDebug","./UI/UIEnv":"UIEnv","LanguageData":"LanguageData"}],"UICheat":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ee4e2PdBRtJFKhTZAymanIB', 'UICheat');
// Scripts/UI/UICheat.js

'use strict';

var CGame = require('../Game');
var UIDebug = require('./UIDebug');
var SharedConsts = require('../../../../common/constants');

var game = new CGame();

cc.Class({
    extends: cc.Component,

    properties: {
        bgPopup: {
            default: null,
            type: cc.Node
        }

    },

    onLoad: function onLoad() {
        this.bgPopup.active = false;

        if (game.isDebug) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    onDestroy: function onDestroy() {
        if (game.isDebug) {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.c:
                this.bgPopup.active ^= true;
                break;
            case cc.KEY.escape:
                this.onBtClose();
                break;
        }
    },

    onBtRandomRotation: function onBtRandomRotation() {
        if (game.farm.parcels.length > 0) {
            for (var k = 0; k < game.farm.parcels.length; k++) {
                var parcel = game.farm.parcels[k];
                if (parcel.rotationPrevision.length === 0) {
                    var id = Math.floor(cc.random0To1() * game.plants.length);
                    if (id == game.plants.length) id--;
                    var plant = game.plants[id];

                    var culture = SharedConsts.CultureModeEnum.NORMAL;
                    id = Math.floor(cc.random0To1() * 3);
                    if (id == 1) {
                        culture = SharedConsts.CultureModeEnum.BIO;
                    }
                    if (id == 2) {
                        culture = SharedConsts.CultureModeEnum.PERMACULTURE;
                    }

                    parcel.rotationPrevision.push({
                        species: plant.species,
                        culture: culture
                    });
                }
            }
        }

        this.onBtClose();
    },

    onBtClearRotation: function onBtClearRotation() {
        if (game.farm.parcels.length > 0) {
            for (var k = 0; k < game.farm.parcels.length; k++) {
                var parcel = game.farm.parcels[k];
                if (parcel.rotationPrevision.length > 0) {
                    parcel.rotationPrevision = [];
                }
            }
        }

        this.onBtClose();
    },

    onBtClose: function onBtClose() {
        this.bgPopup.active = false;
    }

});

cc._RF.pop();
},{"../../../../common/constants":1,"../Game":"Game","./UIDebug":"UIDebug"}],"UIDebug":[function(require,module,exports){
"use strict";
cc._RF.push(module, '18ea2AjTFtAb7SJWmEwfDmn', 'UIDebug');
// Scripts/UI/UIDebug.js

'use strict';

var UIDebug = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UIDebug'
    },

    properties: {
        debugLabel: {
            default: null,
            type: cc.Label
        },
        touchLabel: {
            default: null,
            type: cc.Label
        },

        mapScrollView: {
            default: null,
            type: cc.ScrollView
        }
    },

    statics: {
        instance: null,
        _log: [],
        log: function log(line) {
            UIDebug._log.unshift(line);
            if (UIDebug._log.length > 5) {
                UIDebug._log.pop();
            }
        },
        touchLog: ''
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (UIDebug.instance != null) {
            cc.error('UIDebug instance already loaded');
        }
        UIDebug.instance = this;

        this.debugLabel.string = '';
        this.touchLabel.string = '';
    },

    start: function start(err) {},

    update: function update(dt) {
        if (this.debugLabel != null) {
            this.debugLabel.string = '';
            for (var i = 0; i < UIDebug._log.length; i++) {
                this.debugLabel.string += UIDebug._log[i] + '\n';
            }
        }

        if (this.touchLabel != null) {
            this.touchLabel.string = UIDebug.touchLog;

            if (this.mapScrollView != null) {
                this.touchLabel.string += ' scrollOffset=' + this.mapScrollView.getScrollOffset();
                this.touchLabel.string += ' zoom=' + this.mapScrollView.content.scaleX;
            }
        }
    }
});

module.exports = UIDebug;

cc._RF.pop();
},{}],"UIEnv":[function(require,module,exports){
"use strict";
cc._RF.push(module, '6d70dhzfZNFH7Qp5lDKoDB3', 'UIEnv');
// Scripts/UI/UIEnv.js

"use strict";

/**
 * Instances of existing UI
 */
var UIEnv = {
  /**
   * @property {UIMessage} message: UIMessage instance
   */
  message: null,

  /**
   * @property {UIOffice} office: UIOffice instance
   */
  office: null,

  /**
   * @property {UIParcel} parcel: UIParcel instance
   */
  parcel: null,

  /**
   * @property {UISpeciesSelPopup} parcel: UISpeciesSelPopup instance
   */
  speciesSelect: null,

  /**
   * @property {UIQuestInfo} questInfo: UIQuestInfo instance
   */
  questInfo: null,

  /**
   * @property {UIQuestMenu} questMenu: UIQuestMenu instance
   */
  questMenu: null,

  /**
   * @property {UIScore} score: UIScore instance
   */
  score: null,

  /**
   * @property {UIScore_assolement} score_croprotation: UIScore_assolement instance
   */
  score_croprotation: null,

  /**
  * @property {UIQuestIntro} questintro: UIQuestIntro instance
  */
  questIntro: null

};

module.exports = UIEnv;

cc._RF.pop();
},{}],"UIMessage":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd4cf2XJ/iVOPJMeqHGyaeP+', 'UIMessage');
// Scripts/UI/UIMessage.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var UIEnv = require('./UIEnv');
var i18n = require('LanguageData');

/**
 * UI controller to display a modal message popup
 * @name UIMessage
 * @class
 */
var UIMessage = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIMessage'
    },

    properties: {
        bgLock: {
            default: null,
            type: cc.Node
        },

        lbTitle: {
            default: null,
            type: cc.Label
        },

        lbMessage: {
            default: null,
            type: cc.Label
        },

        btOk: {
            default: null,
            type: cc.Button
        },

        _lbOk: {
            default: null,
            type: cc.Label,
            visible: false
        },

        btYes: {
            default: null,
            type: cc.Button
        },

        _lbYes: {
            default: null,
            type: cc.Label,
            visible: false
        },

        btNo: {
            default: null,
            type: cc.Button
        },

        _lbNo: {
            default: null,
            type: cc.Label,
            visible: false
        }
    },

    statics: {
        YES_NO: {
            buttons: 'yes_no'
        },
        OK_CANCEL: {
            buttons: 'ok_cancel'
        }
    },

    _messagesOptions: null,

    // use this for initialization
    onLoad: function onLoad() {
        UIEnv.message = this;
        this.initPopup();

        this._lbOk = this.btOk.node.getComponentInChildren(cc.Label);
        this._lbYes = this.btYes.node.getComponentInChildren(cc.Label);
        this._lbNo = this.btNo.node.getComponentInChildren(cc.Label);

        this._lbOk.string = i18n.t('ok').toUpperCase();
    },

    /**
     * Shows the specified message
     * Existing options:
     *  - buttons: {String}         'yes_no', 'ok_cancel', 'ok', 'none' (default: 'ok')
     *  - onOk: {Function}          called when user press the ok or yes button
     *  - onCancel: {Function}      called when user press the no button
     *  - self: {Object}            passed as parameter to the callbacks onOk and onCancel
     * @param {String} _Text: the message
     * @param {String} _Title: the title
     * @param {Object} _Options: options dictionary
     * @example show('My text', 'My title', {buttons: 'yes_no', onOk: function() {cc.log('YES pressed');}, onCancel: function(){cc.log('NO pressed');}})
     */
    show: function show(_Text, _Title, _Options) {
        if (_Title === undefined || _Title === null || _Title == '') {
            _Title = i18n.t('message').toUpperCase();
        }

        this.lbMessage.string = _Text;
        this.lbTitle.string = _Title;

        if (_Options != undefined) {
            this._messagesOptions = _Options;
        } else {
            this._messagesOptions = null;
        }

        this.bgLock.active = true;

        if (this._messagesOptions != null) {
            this.btOk.node.active = this._messagesOptions.buttons == undefined || this._messagesOptions.buttons == 'ok';
            this.btYes.node.active = this._messagesOptions.buttons == 'yes_no' || this._messagesOptions.buttons == 'ok_cancel';
            this.btNo.node.active = this.btYes.node.active;
            this._lbYes.string = this._messagesOptions.buttons == 'yes_no' ? i18n.t('yes').toUpperCase() : i18n.t('ok').toUpperCase();
            this._lbNo.string = this._messagesOptions.buttons == 'yes_no' ? i18n.t('no').toUpperCase() : i18n.t('cancel').toUpperCase();
        } else {
            this.btOk.node.active = true;
            this.btYes.node.active = false;
            this.btNo.node.active = false;
        }

        this.showPopup();
    },

    hide: function hide() {
        this.bgLock.active = false;
        this.hidePopup();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBtOk: function onBtOk() {
        if (this._messagesOptions.onOk !== undefined) {
            this._messagesOptions.onOk(this._messagesOptions.self);
        }
        this.hide();
    },
    onBtYes: function onBtYes() {
        if (this._messagesOptions.onOk !== undefined) {
            this._messagesOptions.onOk(this._messagesOptions.self);
        }
        this.hide();
    },
    onBtNo: function onBtNo() {
        if (this._messagesOptions.onCancel !== undefined) {
            this._messagesOptions.onCancel(this._messagesOptions.self);
        }
        this.hide();
    }
});

module.exports = UIMessage;

cc._RF.pop();
},{"./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase","LanguageData":"LanguageData"}],"UIOffice":[function(require,module,exports){
"use strict";
cc._RF.push(module, '6a190mC+6ZOA5vlgY1st6XK', 'UIOffice');
// Scripts/UI/UIOffice.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var CGame = require('../Game');
var UIEnv = require('./UIEnv');

var i18n = require('LanguageData');

var UIOffice = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIOffice'
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

        farmName: {
            default: null,
            type: cc.Label
        },

        totalSurface: {
            default: null,
            type: cc.Label
        },

        nbParcels: {
            default: null,
            type: cc.Label
        }
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {

        UIOffice.instance = this;
        UIEnv.office = this;
        this.initPopup();
    },

    show: function show() {
        UIEnv.parcel.hide();
        UIEnv.speciesSelect.hide();
        this.showPopup();
    },

    onShow: function onShow() {
        var game = new CGame();
        var name = game.farm.name;
        if (name === undefined) {
            name = i18n.t('farm_default_name').toUpperCase();
        }

        this.farmName.string = name;
        this.totalSurface.string = i18n.t('surface_hectare', { 'val': game.farm.totalSurface });
        this.nbParcels.string = game.farm.parcels.length.toString();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },

    onBtClose: function onBtClose() {
        this.hide();
    }

});

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase","LanguageData":"LanguageData"}],"UIParcelButton":[function(require,module,exports){
"use strict";
cc._RF.push(module, '1eeb4QRRqVC67SdkLrVyELP', 'UIParcelButton');
// Scripts/UI/UIParcelButton.js

'use strict';

var CParcel = require('../Parcel');
var UIParcel = require('./UIParcel');
var RscPreload = require('../RscPreload');

/**
 * Displays the parcel name and open its menu when clicked
 * @class
 * @name UIParcelButton
 */
cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UIParcelButton'
    },

    properties: {

        parcelName: {
            default: null,
            type: cc.Label
        },

        parcelSpecies: {
            default: null,
            type: cc.Sprite
        },

        /**
         * @property {CParcel} parcel The target parcel
         */
        parcel: {
            visible: false,
            get: function get() {
                return this._parcel;
            },
            set: function set(_value) {
                this._parcel = _value;
                if (this._parcel != null && this.parcelName != null) {
                    this.parcelName.string = this._parcel.name;
                }
            },
            type: CParcel
        }

    },

    /**
     * @private
     */
    _parcel: null,

    /**
     * @private
     */
    _species: null,

    // use this for initialization
    onLoad: function onLoad() {
        this.parcelSpecies.node.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this._parcel != null) {
            var species = null;

            if (this._parcel.rotationPrevision.length > 0) {
                species = this._parcel.rotationPrevision[0].species;
            }

            if (species != this._species) {
                if (species != null) {
                    this.parcelSpecies.node.active = true;
                    this.parcelSpecies.spriteFrame = RscPreload.getPlantIcon(species);
                } else {
                    this.parcelSpecies.node.active = false;
                }

                this._species = species;
            }
        }
    },

    onButtonClick: function onButtonClick() {
        UIParcel.instance.parcel = this.parcel;
        UIParcel.instance.show();
    }
});

cc._RF.pop();
},{"../Parcel":"Parcel","../RscPreload":"RscPreload","./UIParcel":"UIParcel"}],"UIParcelHistoryItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e26d4zHk5xHfoZ0d5p3J3O6', 'UIParcelHistoryItem');
// Scripts/UI/UIParcelHistoryItem.js

'use strict';

var CParcel = require('../Parcel');
var CPlant = require('../Plant');
var RscPreload = require('../RscPreload');

//const UISpeciesSelPopup = require('UISpeciesSelPopup');
var UIEnv = require('./UIEnv');

var i18n = require('LanguageData');

var UIParcelHistoryItem = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UIParcelHistoryItem'
    },

    properties: {
        iconSpecies: {
            default: null,
            type: cc.Sprite
        },

        lbSpecies: {
            default: null,
            type: cc.Label
        },

        lbCulture: {
            default: null,
            type: cc.Label
        },

        lbYear: {
            default: null,
            type: cc.Label
        },

        btAdd: {
            default: null,
            type: cc.Button
        },

        btEdit: {
            default: null,
            type: cc.Button
        },

        /**
         * @property {CParcel} parcel: current parcel
         */
        parcel: {
            default: null,
            visible: false,
            type: CParcel
        },

        year: {
            default: 0,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    /**
     * @method init Initialize the item
     * @param {CParcel} _Parcel: current parcel
     * @param {Number} _Year: year
     * @param {String: species, String: culture} _Data: the culture data
     * @param {Boolean} _CanEdit: can the culture be edited
     */
    initCulture: function initCulture(_Parcel, _Year, _Data, _CanEdit) {
        this.parcel = _Parcel;
        this.year = _Year;

        var y;
        if (_Year < 0) {
            y = _Year.toString();
        } else {
            y = '+' + _Year.toString();
        }
        this.lbYear.string = i18n.t('parcel_history_year', { 'val': y });

        if (_Data === undefined || _Data === null) {
            // "Add" mode
            this.lbSpecies.string = i18n.t('new').toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = false;
            this.btAdd.node.active = true;
            this.btEdit.node.active = false;
        } else if (_Data.species === 'fallow' || _Data.species === 'pasture') {
            // Fallow
            this.lbSpecies.string = i18n.t('fallow').toUpperCase();
            this.lbCulture.string = '';
            this.iconSpecies.node.active = true;
            this.iconSpecies.spriteFrame = RscPreload.getPlantIcon('fallow');
            this.btAdd.node.active = false;
            this.btEdit.node.active = _CanEdit;
        } else {
            // Existing plant
            this.lbSpecies.string = i18n.t('plant_' + _Data.species).toUpperCase();

            if (_Data.culture !== undefined) {
                this.lbCulture.string = i18n.t('culture_' + _Data.culture).toUpperCase();
            } else {
                this.lbCulture.string = i18n.t('culture_normal').toUpperCase();
            }

            this.iconSpecies.node.active = true;
            this.iconSpecies.spriteFrame = RscPreload.getPlantIcon(_Data.species);
            this.btAdd.node.active = false;
            this.btEdit.node.active = _CanEdit;
        }
    },

    onBtAdd: function onBtAdd() {
        UIEnv.speciesSelect.show(this.parcel, this.year);
    }

});

module.exports = UIParcelHistoryItem;

cc._RF.pop();
},{"../Parcel":"Parcel","../Plant":"Plant","../RscPreload":"RscPreload","./UIEnv":"UIEnv","LanguageData":"LanguageData"}],"UIParcel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5ed45J19xFADpo251R2d6oz', 'UIParcel');
// Scripts/UI/UIParcel.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var CParcel = require('../Parcel');
var UIParcelHistoryItem = require('./UIParcelHistoryItem');
var CGame = require('../Game');
var UIEnv = require('./UIEnv');

var i18n = require('LanguageData');

var game = new CGame();

/**
 * Parcel UI controller
 * @class
 * @name UIParcel
 */
var UIParcel = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIParcel'
    },

    properties: {
        parcelName: {
            default: null,
            type: cc.Label
        },

        parcelGroundType: {
            default: null,
            type: cc.Label
        },

        parcelSurface: {
            default: null,
            type: cc.Label
        },

        historyScrollView: {
            default: null,
            type: cc.ScrollView
        },

        previsionScrollView: {
            default: null,
            type: cc.ScrollView
        },

        plantPrefab: {
            default: null,
            type: cc.Prefab
        },

        /**
         * @property {CParcel} parcel The target parcel
         */
        parcel: {
            visible: false,
            get: function get() {
                return this._parcel;
            },
            set: function set(_value) {
                this._parcel = _value;
                if (this._parcel != null && this.parcelName != null) {}
                if (!this._hidden) {
                    this.onShow();
                }
            },
            type: CParcel
        }
    },

    statics: {
        instance: null
    },

    /**
     * The target parcel
     * @private
     */
    _parcel: null,

    // use this for initialization
    onLoad: function onLoad() {
        UIParcel.instance = this;
        this.initPopup();

        UIEnv.parcel = this;
    },

    show: function show() {
        UIEnv.office.hide();
        this.showPopup();
    },

    onShow: function onShow() {
        //historyScrollView.scrollToOffset(cc.v2(,0));
        var histContent = this.historyScrollView.content;
        histContent.removeAllChildren(true);
        var prevContent = this.previsionScrollView.content;
        prevContent.removeAllChildren(true);

        if (this._parcel != null) {
            this.parcelName.string = this._parcel.name;
            this.parcelGroundType.string = i18n.t('terrain_type_clay').toUpperCase();

            this.parcelSurface.string = i18n.t('surface_hectare', {
                'val': this._parcel.surface.toString()
            });

            // rotation history
            for (var i = this._parcel.rotationHistory.length - 1; i >= 0; i--) {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(histContent);

                var h = hPrefab.getComponent(UIParcelHistoryItem);
                h.initCulture(this._parcel, -(i + 1), this._parcel.rotationHistory[i], false);
            }

            // rotation previsions
            this.updateRotationPrevisions();

            this.historyScrollView.scrollToRight();
            this.previsionScrollView.scrollToLeft();
        }
    },

    updateRotationPrevisions: function updateRotationPrevisions() {
        var prevContent = this.previsionScrollView.content;
        prevContent.removeAllChildren(true);

        // previsions
        for (var i = 0; i < this._parcel.rotationPrevision.length; i++) {
            var hPrefab = cc.instantiate(this.plantPrefab);
            hPrefab.setParent(prevContent);

            var h = hPrefab.getComponent(UIParcelHistoryItem);
            h.initCulture(this._parcel, i, this._parcel.rotationPrevision[i], true);
        }

        this.addEmptyPrevision();
    },

    addEmptyPrevision: function addEmptyPrevision() {
        if (game.phase != null) {
            if (this._parcel.rotationPrevision.length < game.phase.maxPrevisions) {
                var hPrefab = cc.instantiate(this.plantPrefab);
                hPrefab.setParent(this.previsionScrollView.content);

                var h = hPrefab.getComponent(UIParcelHistoryItem);
                h.initCulture(this._parcel, this._parcel.rotationPrevision.length);
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBtClose: function onBtClose() {
        this.hide();
    }
});

module.exports = UIParcel;

cc._RF.pop();
},{"../Game":"Game","../Parcel":"Parcel","./UIEnv":"UIEnv","./UIParcelHistoryItem":"UIParcelHistoryItem","./UIPopupBase":"UIPopupBase","LanguageData":"LanguageData"}],"UIPopupBase":[function(require,module,exports){
"use strict";
cc._RF.push(module, '26b02/CIaZOIqLKQKleyE5X', 'UIPopupBase');
// Scripts/UI/UIPopupBase.js

'use strict';

// UIPopupBase is a base class to make a popup appear from a side
//
// Don't forget to call initPopup in your 'onLoad' method

/**
 * Side from where the popup will appear
 * @enum
 */
var FromMode = cc.Enum({
    //@property LEFT
    LEFT: 0,
    //@property RIGHT
    RIGHT: 1,
    //@property TOP
    TOP: 2,
    //@property BOTTOM
    BOTTOM: 3,
    //@property NONE: no animation
    NONE: 4
});

var UIPopupBase = cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * @property {cc.Node} Popup the popup content
         */
        Popup: {
            default: null,
            type: cc.Node
        },

        /**
         * @property {FromMode} From the side to appear from / to go hide to
         */
        From: {
            default: FromMode.LEFT,
            type: FromMode
        },

        isShown: {
            visible: false,
            get: function get() {
                return !this._hidden;
            }
        }

    },

    _hidden: false,

    /**
     * @method initPopup must be called from onLoad
     */
    initPopup: function initPopup() {

        if (this.Popup == null) {
            this.Popup = this.node;
        }

        this._hidden = false;
        this._defaultX = this.Popup.x;
        this._defaultY = this.Popup.y;
        this._size = this.Popup.getContentSize();

        this.hide(true);
    },

    /**
     * @method showPopup to open the popup
     * calls this.onShow callback if present
     */
    showPopup: function showPopup() {
        if (this._hidden) {
            this.Popup.stopAllActions();

            if (!this.Popup.active) {
                this.Popup.active = true;
            }

            if (this.From != FromMode.NONE) {
                this.Popup.runAction(cc.moveTo(0.2, cc.p(this._defaultX, this._defaultY)));
            }

            this._hidden = false;

            if (this.onShow !== undefined) {
                this.onShow();
            }
        }
    },

    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hidePopup: function hidePopup(instant) {
        if (!this._hidden) {
            this.Popup.stopAllActions();

            if (this.From != FromMode.NONE) {
                var cvw = cc.Canvas.instance.node.width;
                var cvh = cc.Canvas.instance.node.height;

                var to = new cc.Vec2(this._defaultX, this._defaultY);
                switch (this.From) {
                    case FromMode.LEFT:
                        to.x = -cvw;
                        break;
                    case FromMode.RIGHT:
                        to.x = cvw;
                        break;
                    case FromMode.TOP:
                        to.y = cvh;
                        break;
                    case FromMode.BOTTOM:
                        to.y = -cvh;
                        break;
                    default:
                        cc.error('Invalid from value: ' + this.From);
                        to.x = -cvw;
                        break;
                }

                if (!instant) {
                    this.Popup.runAction(cc.moveTo(0.2, to));
                } else {
                    this.Popup.x = to.x;
                    this.Popup.y = to.y;
                }
            } else {
                this.Popup.active = false;
            }

            this._hidden = true;

            if (this.onHide !== undefined) {
                this.onHide();
            }
        }
    },

    /**
     * @method show to open the popup
     * calls this.onShow callback if present
     */
    show: function show() {
        this.showPopup();
    },

    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hide: function hide() {
        var instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        this.hidePopup(instant);
    }
});

cc._RF.pop();
},{}],"UIQuestInfo":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'fe209aGUCRMrqhIU/Rt+APS', 'UIQuestInfo');
// Scripts/UI/UIQuestInfo.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var UIEnv = require('./UIEnv');
var CGame = require('../Game');

var game = new CGame();

/**
 * UI controller of the "quest" popup
 * @class
 * @name UIQuestInfo
 */
var UIQuestInfo = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIQuestInfo'
    },

    properties: {
        /**
         * the label containing the objective description
         */
        lbDescription: {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        lbCompletion: {
            default: null,
            type: cc.Label
        },

        /**
         * the label containing the objective completion
         */
        btValidate: {
            default: null,
            type: cc.Button
        }
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        UIQuestInfo.instance = this;
        UIEnv.questInfo = this;
        this.initPopup();
    },

    onShow: function onShow() {
        if (game.phase != null) {
            this.lbDescription.string = game.phaseGetObjectiveText();
            this.lbCompletion.string = game.phaseGetCompletionStr();

            this.btValidate.interactable = game.phaseCanFinish();
        }
    },

    onBtValidate: function onBtValidate() {
        if (game.phaseCanFinish()) {
            //this score only apply to scenario croprotation
            var score = 0;
            var scorePart = game.phase.perfectScore / game.farm.parcels.length;
            var results = [];

            for (var i = 0; i < game.farm.parcels.length; ++i) {
                var parcel = game.farm.parcels[i];
                var solution = parcel.solution;
                var playerChoice = parcel.rotationPrevision[0];
                var result = { parcelName: parcel.name, note: 4 };

                if (solution.perfects.indexOf(playerChoice.species) > -1) {
                    //perfect score
                    result.note = 1;
                    score += scorePart;
                } else if (solution.acceptables.indexOf(playerChoice.species) > -1) {
                    //good one
                    result.note = 2;
                    score += scorePart * 0.8;
                } else if (solution.bads.indexOf(playerChoice.species) > -1) {
                    //not that bad, but can be better
                    result.note = 3;
                    score -= scorePart * 0.4;
                }
                results.push(result);
                //every other answer is bad 0.
            }

            score = Math.round(score);
            var normalizedScore = score / game.phase.perfectScore;
            //clamp if needed
            if (normalizedScore > 1) {
                normalizedScore = 1;
            }

            UIEnv.score_croprotation.setResults(results);
            UIEnv.score_croprotation.setScoreText(Math.round(normalizedScore * 20) + " / 20");
            UIEnv.score_croprotation.show();
        }
    },

    onBtClose: function onBtClose() {
        this.hide();
    }

});

module.exports = UIQuestInfo;

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase"}],"UIQuestIntro":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'a2ec7ttv5JG+pgS8fICxmUc', 'UIQuestIntro');
// Scripts/UI/UIQuestIntro.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var UIEnv = require('./UIEnv');
var CGame = require('../Game');

var game = new CGame();

/**
 * UI controller for the mission introduction popup
 * @name UIQuestIntro
 * @class
 */
var UIQuestIntro = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UIQuestIntro'
    },

    properties: {
        /**
         * Back button locking the inputs
         */
        bgLock: {
            default: null,
            type: cc.Node
        },

        /**
         * The popup
         */
        popup: {
            default: null,
            type: cc.Node
        },

        /**
         * the label containing the objective description
         */
        lbDescription: {
            default: null,
            type: cc.Label
        },

        /**
         * Is the popup hidden?
         */
        _hidden: {
            default: true,
            visible: false
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        UIEnv.questIntro = this;
        this.bgLock.active = false;

        this._from = this.From;
        this._hidden = true;
        this._defaultX = this.popup.x;
        this._defaultY = this.popup.y;
        this.popup.active = false;
    },

    show: function show() {
        if (game.phase != null) {
            this.lbDescription.string = game.phaseGetIntroText();
        }
        this.bgLock.active = true;
        this.popup.active = true;
        this.popup.x = this._defaultX;
        this.popup.y = this._defaultY;
        this._hidden = false;
    },

    hide: function hide() {
        this.bgLock.active = false;
        this.hidePopup();
    },

    /**
     * @method hide to close the popup
     * @param {Boolean} instant true to close the popup immediately (default is false)
     * calls this.onHide callback if present
     */
    hidePopup: function hidePopup(instant) {
        if (!this._hidden) {
            this.popup.stopAllActions();

            var cvw = cc.Canvas.instance.node.width;
            var cvh = cc.Canvas.instance.node.height;

            var to = new cc.Vec2(this._defaultX, this._defaultY);
            to.y = cvh;

            if (!instant) {
                this.popup.runAction(cc.moveTo(0.2, to));
            } else {
                this.popup.x = to.x;
                this.popup.y = to.y;
            }

            this._hidden = true;
        }
    },

    onBtStart: function onBtStart() {
        game.phaseStart();
        this.hide();
    }

});

module.exports = UIQuestIntro;

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase"}],"UIQuestMenu":[function(require,module,exports){
"use strict";
cc._RF.push(module, '7d7c3/wn7ZCuLYYti4yjtS7', 'UIQuestMenu');
// Scripts/UI/UIQuestMenu.js

'use strict';

var CGame = require('../Game');
var UIEnv = require('./UIEnv');

var game = new CGame();

/**
 * The "quest" menu controller
 * @class
 * @name UIQuestMenu
 */
var UIQuestMenu = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UIQuestMenu'
    },

    properties: {

        /**
         * The main button
         */
        btOpen: {
            default: null,
            type: cc.Button
        },

        /**
         * Main button highlight
         */
        highlight: {
            default: null,
            type: cc.Node
        },

        /**
         * Main button highlight anim component
         * @private
         */
        _hlAnim: {
            default: null,
            type: cc.Animation,
            visible: false
        },

        /**
         * Main button particles (growing after the hl)
         */
        fxParticles: {
            default: null,
            type: cc.ParticleSystem
        },

        /**
         * True if button is currently animated
         * @private
         */
        _isAnimated: {
            default: false,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        UIEnv.questMenu = this;
        this._hlAnim = this.highlight.getComponent(cc.Animation);
        this.highlight.active = false;
        this.fxParticles.stopSystem();
        this._isAnimated = false;
        this.btOpen.interactable = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (game.state < CGame.State.PHASE_RUN) {
            return;
        }

        this.btOpen.interactable = game.state < CGame.State.PHASE_SCORE && UIEnv.questInfo != null && !UIEnv.questInfo.isShown;

        var animate = this.btOpen.interactable && game.phaseCanFinish();
        if (animate != this._isAnimated) {
            if (animate) {
                this.highlight.active = true;
                this._hlAnim.play();
                this.fxParticles.resetSystem();
            } else {
                this._hlAnim.stop();
                this.fxParticles.stopSystem();
                this.highlight.active = false;
            }

            this._isAnimated = animate;
        }
    },

    onBtOpen: function onBtOpen() {
        UIEnv.questInfo.show();
    }
});

module.exports = UIQuestMenu;

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv"}],"UIScore_croprotation":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'b6098hR08JLhqWX764cWMcE', 'UIScore_croprotation');
// Scripts/UI/UIScore_croprotation.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var CGame = require('../Game');
var RscPreload = require('RscPreload');
var UIEnv = require('./UIEnv');
var i18n = require('LanguageData');

var game = new CGame();

/**
 * Score croprotation UI controller
 * @class
 * @name UIScore_croprotation
 */
var UIScore_croprotation = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIScore_croprotation'
    },

    properties: {
        scoreText: {
            default: null,
            type: cc.Label
        },

        itemPrefab: {
            default: null,
            type: cc.Prefab
        },

        scrollView: {
            default: null,
            type: cc.ScrollView
        }
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {

        UIScore_croprotation.instance = this;
        UIEnv.score_croprotation = this;
        this.initPopup();
    },

    show: function show() {
        UIEnv.parcel.hide();
        UIEnv.speciesSelect.hide();
        UIEnv.questInfo.hide();
        this.showPopup();
    },

    onShow: function onShow() {},

    setResults: function setResults(_results) {
        var content = this.scrollView.content;
        content.removeAllChildren(true);

        for (var i = 0; i < _results.length; i++) {
            var prefab = cc.instantiate(this.itemPrefab);

            var result = _results[i];
            var lbl = prefab.getChildByName("ParcelleName").getComponent(cc.Label);
            if (lbl) {
                lbl.string = result.parcelName;
            }

            var icon = prefab.getChildByName("icon_note").getComponent(cc.Sprite);
            if (icon) {
                icon.spriteFrame = RscPreload.instance.noteIconsAtlas.getSpriteFrame('note' + result.note);
            }

            prefab.setParent(content);
        }
    },

    setScoreText: function setScoreText(_text) {
        this.scoreText.string = _text;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {},

    onBtNext: function onBtNext() {
        this.hide();
    }

});

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase","LanguageData":"LanguageData","RscPreload":"RscPreload"}],"UIScore":[function(require,module,exports){
"use strict";
cc._RF.push(module, '3ac5eIDVhJJ/ofpayCfR0NL', 'UIScore');
// Scripts/UI/UIScore.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var CGame = require('../Game');
var UIEnv = require('./UIEnv');
var i18n = require('LanguageData');

var game = new CGame();

/**
 * Score UI controller
 * @class
 * @name UIScore
 */
var UIScore = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UIScore'
    },

    properties: {
        drawingZone: {
            default: null,
            type: cc.Node
        },

        scoreText: {
            default: null,
            type: cc.Label
        }
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {

        UIScore.instance = this;
        UIEnv.score = this;
        this.initPopup();

        //Add a Graphics component to draw custom shapes
        this.spider = this.drawingZone.addComponent(cc.Graphics);

        //this.showPopup();
        //this.setScore(Math.random(), Math.random(), Math.random(), Math.random(), Math.random());
    },

    show: function show() {
        UIEnv.parcel.hide();
        UIEnv.speciesSelect.hide();
        UIEnv.questInfo.hide();
        this.showPopup();
    },

    onShow: function onShow() {},

    //each score should be between [0;1]
    setScore: function setScore(_financial, _rule, _quality, _ecological, _human, _text) {
        this.scoreText.string = _text;

        var g = this.spider;
        var center = new cc.Vec2(-151, -66);
        var directions = [new cc.Vec2(0, 1), new cc.Vec2(150, 42), new cc.Vec2(84, -124), new cc.Vec2(-84, -124), new cc.Vec2(-150, 42)];

        for (var i = 0; i < directions.length; ++i) {
            directions[i] = directions[i].normalize();
        }

        var score = [_financial, _rule, _quality, _ecological, _human];

        g.clear();
        g.fillColor = new cc.Color(167, 247, 192, 160);
        g.strokeColor = new cc.Color(142, 162, 105, 160);
        g.lineWidth = 6;

        var start = null;
        for (var i = 0; i < directions.length; ++i) {
            //calculate coordinate of point according to score
            var d = directions[i];
            var l = d.mul(160 * score[i]);
            var p = center.add(l);

            if (!i) {
                g.moveTo(p.x, p.y);
                start = p;
            } else {
                g.lineTo(p.x, p.y);
            }
        }
        g.lineTo(start.x, start.y);
        g.stroke();
        g.fill();
        this.drawingZone.opacity = 127;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {},

    onBtNext: function onBtNext() {
        this.hide();
    }

});

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase","LanguageData":"LanguageData"}],"UISpeciesSelItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'aaef9bEqX5BcJFGX/hbg8UC', 'UISpeciesSelItem');
// Scripts/UI/UISpeciesSelItem.js

'use strict';

var i18n = require('LanguageData');
var CPlant = require('Plant');
var RscPreload = require('RscPreload');
var SharedConsts = require('../../../../common/constants');

var UISpeciesSelItem = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UISpeciesSelItem'
    },

    properties: {
        /**
         * Species name label
         */
        speciesName: {
            default: null,
            type: cc.Label
        },

        /**
         * Species variety label (currently unused)
         */
        speciesVariety: {
            default: null,
            type: cc.Label
        },

        /**
         * Species icon
         */
        speciesIcon: {
            default: null,
            type: cc.Sprite
        },

        /**
         * 'normal' buy price label
         */
        buyPriceNormal: {
            default: null,
            type: cc.Label
        },

        /**
         * 'normal' sell price label
         */
        sellPriceNormal: {
            default: null,
            type: cc.Label
        },

        /**
         * The 'normal' culture button
         */
        btNormal: {
            default: null,
            type: cc.Button
        },

        /**
         * 'bio' buy price label
         */
        buyPriceBio: {
            default: null,
            type: cc.Label
        },

        /**
         * 'bio' sell price label
         */
        sellPriceBio: {
            default: null,
            type: cc.Label
        },

        /**
         * The 'bio' culture button
         */
        btBio: {
            default: null,
            type: cc.Button
        },

        /**
         * 'permaculture' buy price label
         */
        buyPricePerma: {
            default: null,
            type: cc.Label
        },

        /**
         * 'permaculture' sell price label
         */
        sellPricePerma: {
            default: null,
            type: cc.Label
        },

        /**
         * The 'permaculture' culture button
         */
        btPerma: {
            default: null,
            type: cc.Button
        },

        /**
         * Add button (aka validate button)
         */
        btAdd: {
            default: null,
            type: cc.Button
        },

        /**
         * The highlight if item is currently selected 
         */
        hlSelected: {
            default: null,
            type: cc.Node
        },

        /**
         * true if item currently selected
         */
        isSelected: {
            visible: false,
            get: function get() {
                return this._isSelected;
            },
            set: function set(val) {
                if (this._isSelected !== val) {
                    this._isSelected = val;

                    if (val && this.selectionCallback !== null) {
                        this.selectionCallback(this);
                    }

                    this._selectionChanged = true;
                }
            }
        },

        /**
         * the plant
         */
        plant: {
            visible: false,
            get: function get() {
                return this._plant;
            },
            set: function set(val) {
                this._plant = val;
                this._plantChanged = true;
            }
        },

        /**
         * Selected culture mode
         */
        cultureMode: {
            visible: false,
            get: function get() {
                return this._cultureMode;
            },
            set: function set(val) {
                this._cultureMode = val;
                this._cultureChanged = true;
            }
        },

        _cultureMode: {
            default: SharedConsts.CultureModeEnum.NORMAL,
            visible: false
        },

        /**
         * Callback when item is selected
         * @param {UISpeciesSelItem} data: the selected item
         */
        selectionCallback: {
            visible: false,
            default: null,
            type: Object
        },

        /**
         * Callback when item is validated
         * @param {String: species, String: culture} data: the selected species & culture mode
         */
        validationCallback: {
            visible: false,
            default: null,
            type: Object
        }

    },

    _plant: null,
    _plantChanged: false,

    _cultureChanged: false,

    _isSelected: false,
    _selectionChanged: false,

    // use this for initialization
    onLoad: function onLoad() {
        this.speciesVariety.string = '';
        this.hlSelected.active = false;
    },

    updateUI: function updateUI() {
        if (this._plant != null) {
            if (this._plantChanged) {
                if (this._plant.isFallow) {
                    this.speciesName.string = i18n.t('fallow').toUpperCase();
                    this.speciesIcon.spriteFrame = RscPreload.instance.plantIconsAtlas.getSpriteFrame('ico_prairies');
                } else {
                    // Existing plant
                    this.speciesName.string = i18n.t('plant_' + this._plant.species).toUpperCase();
                    this.speciesIcon.spriteFrame = RscPreload.getPlantIcon(this._plant.species);
                }

                this._plantChanged = false;

                // force update of the rest
                this._selectionChanged = true;
                this._cultureChanged = true;
            }

            if (this._cultureChanged) {
                if (this._plant.isFallow) {
                    this.buyPriceNormal.string = '';
                    this.buyPriceBio.string = '';
                    this.buyPricePerma.string = '';
                    this.sellPriceNormal.string = '';
                    this.sellPriceBio.string = '';
                    this.sellPricePerma.string = '';

                    this.btNormal.node.active = false;
                    this.btBio.node.active = false;
                    this.btPerma.node.active = false;
                } else {
                    this.buyPriceNormal.string = this._plant.getBuyPrice(SharedConsts.CultureModeEnum.NORMAL).toString();
                    this.buyPriceBio.string = this._plant.getBuyPrice(SharedConsts.CultureModeEnum.BIO).toString();
                    this.buyPricePerma.string = this._plant.getBuyPrice(SharedConsts.CultureModeEnum.PERMACULTURE).toString();
                    this.sellPriceNormal.string = this._plant.getSellPrice(SharedConsts.CultureModeEnum.NORMAL).toString();
                    this.sellPriceBio.string = this._plant.getSellPrice(SharedConsts.CultureModeEnum.BIO).toString();
                    this.sellPricePerma.string = this._plant.getSellPrice(SharedConsts.CultureModeEnum.PERMACULTURE).toString();

                    this.btNormal.interactable = this.cultureMode != SharedConsts.CultureModeEnum.NORMAL;
                    this.btBio.interactable = this.cultureMode != SharedConsts.CultureModeEnum.BIO;
                    this.btPerma.interactable = this.cultureMode != SharedConsts.CultureModeEnum.PERMACULTURE;
                }
            }

            if (this._selectionChanged) {
                this.hlSelected.active = this._isSelected;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.updateUI();
    },

    onBtCultureNormal: function onBtCultureNormal() {
        if (this._plant != null && !this._plant.isFallow) {
            //this.isSelected = true;
            this.cultureMode = SharedConsts.CultureModeEnum.NORMAL;
        }
    },

    onBtCultureBio: function onBtCultureBio() {
        if (this._plant != null && !this._plant.isFallow) {
            //this.isSelected = true;
            this.cultureMode = SharedConsts.CultureModeEnum.BIO;
        }
    },

    onBtCulturePerma: function onBtCulturePerma() {
        if (this._plant != null && !this._plant.isFallow) {
            //this.isSelected = true;
            this.cultureMode = SharedConsts.CultureModeEnum.PERMACULTURE;
        }
    },

    onBtAdd: function onBtAdd() {
        if (this._plant != null && this.validationCallback != null) {
            this.validationCallback({ species: this._plant.species, culture: this._cultureMode });
        }
    }

});

module.exports = UISpeciesSelItem;

cc._RF.pop();
},{"../../../../common/constants":1,"LanguageData":"LanguageData","Plant":"Plant","RscPreload":"RscPreload"}],"UISpeciesSelPopup":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'be3ddDBLZpLTbjtJ2jb+FZn', 'UISpeciesSelPopup');
// Scripts/UI/UISpeciesSelPopup.js

'use strict';

var UIPopupBase = require('./UIPopupBase');
var CGame = require('../Game');
var UISpeciesSelItem = require('./UISpeciesSelItem');
var UIEnv = require('./UIEnv');

/**
 * UI controller for UISpeciesSelPopup popup
 * @class
 * @name UISpeciesSelPopup
 */
var UISpeciesSelPopup = cc.Class({
    extends: UIPopupBase,
    editor: {
        menu: 'gof/UISpeciesSelPopup'
    },

    properties: {
        /**
         * @property {cc.Prefab} itemPrefab: the prefab used to created the items in the list
         */
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },

        /**
         * @property {cc.ScrollView} scrollView: the scrollview containing the species items
         */
        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        /**
         * @private
         * @property {CParcel} _parcel: Currently modified parcel
         */
        _parcel: {
            default: null,
            visible: false
        },

        /**
         * @property {Number} _previsionYear: Currently modified rotation prevision year
         */
        _previsionYear: {
            default: -1,
            visible: false
        }

    },

    statics: {
        /**
         * @property {UISpeciesSelPopup} instance: UISpeciesSelPopup unique instance
         * @static
         */
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (UISpeciesSelPopup.instance != null) {
            cc.error('An instance of UISpeciesSelPopup already exists');
        }
        UISpeciesSelPopup.instance = this;
        UIEnv.speciesSelect = this;

        this.initPopup();
    },

    /**
     * @method
     * @param {CParcel} _Parcel: parcel to modify
     * @param {number} _Year: prevision year to modify (or -1 if new prevision)
     */
    show: function show(_Parcel) {
        var _Year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        this._parcel = _Parcel;
        this._previsionYear = _Year;

        this.showPopup();
    },

    // called by UIPopupBase
    onShow: function onShow() {
        var game = new CGame();

        // get current selection (if any)
        var current = null;
        if (this._previsionYear >= 0 && this._previsionYear < this._parcel.rotationPrevision.length) {
            current = this._parcel.rotationPrevision[this._previsionYear];
        }

        var content = this.scrollView.content;
        content.removeAllChildren(true);

        // generates the plants items
        for (var i = 0; i < game.plants.length; i++) {
            //dont show the plant if it should be excluded
            if (game.farm.plantExcludes.indexOf(game.plants[i].species) > -1) {
                continue;
            }

            var prefab = cc.instantiate(this.itemPrefab);
            prefab.setParent(content);

            var s = prefab.getComponent('UISpeciesSelItem');
            s.plant = game.plants[i];
            s.selectionCallback = this.onItemSelection;
            s.validationCallback = this.onItemValidation;

            if (current !== null && current.species == s.plant.species) {
                // show current selection
                if (current.culture) {
                    s.cultureMode = current.culture;
                }
                s.isSelected = true;
            }
        }
    },

    // called by UIPopupBase
    onHide: function onHide() {},

    onItemSelection: function onItemSelection(_Item) {
        var items = UISpeciesSelPopup.instance.scrollView.content.children;
        for (var i = 0; i < items.length; i++) {
            var s = items[i].getComponent('UISpeciesSelItem');
            if (s.isSelected && _Item.plant !== s.plant) {
                s.isSelected = false;
            }
        }
    },

    onItemValidation: function onItemValidation(_Data) {
        var self = UISpeciesSelPopup.instance;
        if (self._previsionYear >= 0 && self._previsionYear < self._parcel.rotationPrevision.length) {
            self._parcel.rotationPrevision[self._previsionYear] = _Data;
        } else {
            self._parcel.rotationPrevision.push(_Data);
        }

        UIEnv.parcel.updateRotationPrevisions();
        self.hide();
    },

    onBtClose: function onBtClose() {
        this.hide();
    }

});

module.exports = UISpeciesSelPopup;

cc._RF.pop();
},{"../Game":"Game","./UIEnv":"UIEnv","./UIPopupBase":"UIPopupBase","./UISpeciesSelItem":"UISpeciesSelItem"}],"UITop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5d170x4gqNGn6wYSkUsy2s+', 'UITop');
// Scripts/UI/UITop.js

'use strict';

var _Game = require('Game');

var _Game2 = _interopRequireDefault(_Game);

var _Farm = require('Farm');

var _Farm2 = _interopRequireDefault(_Farm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import CGamePhase from 'GamePhase';

var game = new _Game2.default();

var i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UITop'
    },
    properties: {
        dateLabel: {
            default: null,
            type: cc.RichText
        },
        moneyLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.moneyLabel.string = '';
        this.dateLabel.string = '';
    },

    start: function start() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (game.phase != null) {
            var farm = game.farm;
            this.moneyLabel.string = game.farm.money;

            var month = i18n.t('month_' + (farm.month + 1));

            this.dateLabel.string = i18n.t('date_value', {
                'year': farm.year,
                'month': month, //(farm.month+1).toLocaleString(game.config.LANGUAGE_DEFAULT, {minimumIntegerDigits: 2}),
                'week': farm.week + 1
            });
        }
    }
});

cc._RF.pop();
},{"Farm":"Farm","Game":"Game","LanguageData":"LanguageData"}],"polyglot.min":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e26fd9yy65A4q3/JkpVnFYg', 'polyglot.min');
// polyglot.min.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//     (c) 2012 Airbnb, Inc.
//
//     polyglot.js may be freely distributed under the terms of the BSD
//     license. For all licensing information, details, and documention:
//     http://airbnb.github.com/polyglot.js
//
//
// Polyglot.js is an I18n helper library written in JavaScript, made to
// work both in the browser and in Node. It provides a simple solution for
// interpolation and pluralization, based off of Airbnb's
// experience adding I18n functionality to its Backbone.js and Node apps.
//
// Polylglot is agnostic to your translation backend. It doesn't perform any
// translation; it simply gives you a way to manage translated phrases from
// your client- or server-side JavaScript application.
//
(function (e, t) {
  typeof define == "function" && define.amd ? define([], function () {
    return t(e);
  }) : (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" ? module.exports = t(e) : e.Polyglot = t(e);
})(undefined, function (e) {
  "use strict";
  function t(e) {
    e = e || {}, this.phrases = {}, this.extend(e.phrases || {}), this.currentLocale = e.locale || "en", this.allowMissing = !!e.allowMissing, this.warn = e.warn || c;
  }function s(e) {
    var t,
        n,
        r,
        i = {};for (t in e) {
      if (e.hasOwnProperty(t)) {
        n = e[t];for (r in n) {
          i[n[r]] = t;
        }
      }
    }return i;
  }function o(e) {
    var t = /^\s+|\s+$/g;return e.replace(t, "");
  }function u(e, t, r) {
    var i, s, u;return r != null && e ? (s = e.split(n), u = s[f(t, r)] || s[0], i = o(u)) : i = e, i;
  }function a(e) {
    var t = s(i);return t[e] || t.en;
  }function f(e, t) {
    return r[a(e)](t);
  }function l(e, t) {
    for (var n in t) {
      n !== "_" && t.hasOwnProperty(n) && (e = e.replace(new RegExp("%\\{" + n + "\\}", "g"), t[n]));
    }return e;
  }function c(t) {
    e.console && e.console.warn && e.console.warn("WARNING: " + t);
  }function h(e) {
    var t = {};for (var n in e) {
      t[n] = e[n];
    }return t;
  }t.VERSION = "0.4.3", t.prototype.locale = function (e) {
    return e && (this.currentLocale = e), this.currentLocale;
  }, t.prototype.extend = function (e, t) {
    var n;for (var r in e) {
      e.hasOwnProperty(r) && (n = e[r], t && (r = t + "." + r), (typeof n === "undefined" ? "undefined" : _typeof(n)) == "object" ? this.extend(n, r) : this.phrases[r] = n);
    }
  }, t.prototype.clear = function () {
    this.phrases = {};
  }, t.prototype.replace = function (e) {
    this.clear(), this.extend(e);
  }, t.prototype.t = function (e, t) {
    var n, r;return t = t == null ? {} : t, typeof t == "number" && (t = { smart_count: t }), typeof this.phrases[e] == "string" ? n = this.phrases[e] : typeof t._ == "string" ? n = t._ : this.allowMissing ? n = e : (this.warn('Missing translation for key: "' + e + '"'), r = e), typeof n == "string" && (t = h(t), r = u(n, this.currentLocale, t.smart_count), r = l(r, t)), r;
  }, t.prototype.has = function (e) {
    return e in this.phrases;
  };var n = "||||",
      r = { chinese: function chinese(e) {
      return 0;
    }, german: function german(e) {
      return e !== 1 ? 1 : 0;
    }, french: function french(e) {
      return e > 1 ? 1 : 0;
    }, russian: function russian(e) {
      return e % 10 === 1 && e % 100 !== 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
    }, czech: function czech(e) {
      return e === 1 ? 0 : e >= 2 && e <= 4 ? 1 : 2;
    }, polish: function polish(e) {
      return e === 1 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
    }, icelandic: function icelandic(e) {
      return e % 10 !== 1 || e % 100 === 11 ? 1 : 0;
    } },
      i = { chinese: ["fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh"], german: ["da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv"], french: ["fr", "tl", "pt-br"], russian: ["hr", "ru"], czech: ["cs"], polish: ["pl"], icelandic: ["is"] };return t;
});

cc._RF.pop();
},{}]},{},["ApiClient","Farm","Game","GameParcel","GamePhase","MapCtrl","Parcel","Plant","RscPreload","Startup","LocalizedLabelExt","UICheat","UIDebug","UIEnv","UIMessage","UIOffice","UIParcel","UIParcelButton","UIParcelHistoryItem","UIPopupBase","UIQuestInfo","UIQuestIntro","UIQuestMenu","UIScore","UIScore_croprotation","UISpeciesSelItem","UISpeciesSelPopup","UITop","LanguageData","LocalizedLabel","LocalizedSprite","SpriteFrameSet","polyglot.min"]);
