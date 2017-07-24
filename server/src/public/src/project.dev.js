require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"GameOld":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e96b9XpCs5O8ZjBqjLv8KA+', 'GameOld');
// Scripts\GameOld.js

'use strict';

// Game singleton
//

var i18n = require('LanguageData');

var DEBUG = true;

// Game configuration when DEBUG is true
var ConfigDebug = {
    LANGUAGE_DEFAULT: 'fr',
    SERVER: 'http://gof.julien.dev:3000/'
};

// Game configuration
var ConfigMaster = {
    LANGUAGE_DEFAULT: 'fr',
    SERVER: 'http://gof.julien.dev:3000/'
};

// Game "singleton"
var Game = function () {
    var instance;

    function createInstance() {
        var g = new Object('Game');

        g.isDebug = DEBUG;
        g.initialized = '';

        if (DEBUG) {
            g.config = ConfigDebug;
        } else {
            g.config = ConfigMaster;
        }

        g.init = function () {
            this.initialized = 'Game singleton initialized!';
        };

        i18n.init('fr');

        return g;
    }

    return {
        getInstance: function getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}();

module.exports = Game;

cc._RF.pop();
},{"LanguageData":"LanguageData"}],"GamePhase":[function(require,module,exports){
"use strict";
cc._RF.push(module, '3ac1bWprMFKCozrFNz9biyB', 'GamePhase');
// Scripts\GamePhase.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// GamePhase class ("scenario")

var i18n = require('LanguageData');

var CGamePhase = function () {
    function CGamePhase() {
        _classCallCheck(this, CGamePhase);

        this.id = 'assollement';
        this.score = 0;
        this.date = null;
        this.money = 50000;
        this._startYear = 0;

        var now = new Date(Date.now());
        this._startYear = now.getFullYear();
        this.date = new Date(this._startYear, 7, 20);
    }

    _createClass(CGamePhase, [{
        key: 'getDateString',
        value: function getDateString() {
            var y = this.date.getFullYear();
            var m = this.date.getMonth() + 1;
            var d = this.date.getDate();

            return d.toLocaleString("fr", { minimumIntegerDigits: 2 }) + '/' + m.toLocaleString("fr", { minimumIntegerDigits: 2 }) + '/' + y;
        }
    }, {
        key: 'title',
        get: function get() {
            return i18n.t(this.id);
        }
    }]);

    return CGamePhase;
}();

exports.default = CGamePhase;
module.exports = exports['default'];

cc._RF.pop();
},{"LanguageData":"LanguageData"}],"Game":[function(require,module,exports){
"use strict";
cc._RF.push(module, '37f159UDU9GBpEOdPYC0xWt', 'Game');
// Scripts\Game.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Game "singleton" implementation
// How to use:
//      import CGame from 'Game';
//      const game = new CGame();   // the constructor always returns the same instance
//
// the singleton also initializes i18n
// TODO: check language provided by the environment

var _GamePhase = require('GamePhase');

var _GamePhase2 = _interopRequireDefault(_GamePhase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = require('LanguageData');

var DEBUG = true;

// Game configuration when DEBUG is true
var ConfigDebug = {
    LANGUAGE_DEFAULT: 'fr',
    SERVICES_URL: 'http://gof.julien.dev:3000/'
};

// Game configuration
var ConfigMaster = {
    LANGUAGE_DEFAULT: 'fr',
    SERVICES_URL: 'http://gof.julien.dev:3000/'
};

var instance = null;

// Game "singleton" class

var CGame = function () {
    //true if game is running with the debug configuration
    function CGame() {
        _classCallCheck(this, CGame);

        this.isDebug = DEBUG;
        this.config = null;
        this.initialized = '';
        this.gamePhase = null;

        if (instance) {
            return instance;
        }

        instance = this;

        if (DEBUG) {
            this.config = ConfigDebug;
        } else {
            this.config = ConfigMaster;
        }

        this.gamePhase = new _GamePhase2.default();

        i18n.init(this.config.LANGUAGE_DEFAULT);
    }

    //contains some constants


    _createClass(CGame, [{
        key: 'init',
        value: function init() {
            // used for debug
            this.initialized = 'Game singleton initialized';
        }
    }]);

    return CGame;
}();

exports.default = CGame;
module.exports = exports['default'];

cc._RF.pop();
},{"GamePhase":"GamePhase","LanguageData":"LanguageData"}],"LanguageData":[function(require,module,exports){
"use strict";
cc._RF.push(module, '61de062n4dJ7ZM9/Xdumozn', 'LanguageData');
// ..\i18n-plugin\LanguageData.js

'use strict';

var Polyglot = require('polyglot.min');

var polyInst = null;
if (!window.i18n) window.i18n = { languages: {}, curLang: '' };

if (CC_EDITOR) {
    Editor.Profile.load('profile://project/i18n.json', function (err, profile) {
        window.i18n.curLang = profile['default_language'];
        if (polyInst) {
            data = loadLanguageData(window.i18n.curLang);
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
// Scripts\LocalizedLabelExt.js

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
            this.label.string = i18n.t(this.dataID);
        } else {
            cc.warn('Missing text id: ' + this.dataID);
        }
    }
});

cc._RF.pop();
},{"LanguageData":"LanguageData"}],"LocalizedLabel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '744dcs4DCdNprNhG0xwq6FK', 'LocalizedLabel');
// ..\i18n-plugin\LocalizedLabel.js

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
// ..\i18n-plugin\LocalizedSprite.js

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
// Scripts\MapCtrl.js

'use strict';

// MapCtrl component

// Add this on the TiledMap to manage touch events
// Call scrollEvent(null, 0) to disable touch (e.g.: when scrolling map)


//import CGame from 'Game';
//const game = new CGame();

var UIOffice = require('UIOffice');
var UIDebug = require('UIDebug');

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap,
        menu: 'gof/MapCtrl'
    },

    properties: {
        // the ScrollView containing the map
        mapScrollView: {
            default: null,
            type: cc.ScrollView
        },

        // starting ScrollView offset
        startOffset: {
            default: new cc.Vec2(0, 0)
        },

        // a debug prefab
        debugLabelPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var _this = this;

        // Setting touch events
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            _this._isScrolling = false;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (_this._isScrolling) {
                // scrollview is scrolling, ignore touch
                return;
            }

            var touch = event.touch;
            var tiledMap = _this._tiledMap; //this.node.getComponent('cc.TiledMap');
            if (tiledMap) {
                var mapSize = tiledMap.getMapSize();
                var layers = tiledMap.allLayers();

                // convert touch position to node position (i.e. map position)
                var loc = tiledMap.node.convertToNodeSpace(touch.getLocation());

                UIDebug.touchLog = '' + touch.getLocationX() + ',' + touch.getLocationY() + ' => ' + loc;

                var groups = tiledMap.getObjectGroups();
                for (var i = groups.length - 1; i >= 0; i--) {
                    var group = groups[i];
                    var objs = group.getObjects();

                    for (var j = 0; j < objs.length; j++) {
                        var obj = objs[j];

                        var rect = new cc.rect(obj.sgNode.x - obj.sgNode.width / 2, obj.sgNode.y, obj.sgNode.width, obj.sgNode.height);

                        if (rect.contains(loc)) {
                            UIDebug.log('Clicked on object ' + obj.name);

                            UIOffice.instance.show();
                            return;
                        }
                    }
                }

                for (var i = layers.length - 1; i >= 0; i--) {
                    var layer = layers[i];

                    var TILE_WIDTH_HALF = layer.getMapTileSize().width;
                    var TILE_HEIGHT_HALF = layer.getMapTileSize().height;

                    var tw = layer.getMapTileSize().width;
                    var th = layer.getMapTileSize().height;
                    var mw = layer.getLayerSize().width;
                    var mh = layer.getLayerSize().height;

                    var x = loc.x * 1;
                    var y = loc.y * 1;

                    var isox = Math.floor(mh - y / th + x / tw - mw / 2);
                    var isoy = Math.floor(mh - y / th - x / tw + mw / 2);

                    // true only if the coords is with in the map
                    if (isox < mapSize.width && isoy < mapSize.height) {
                        var tile = layer.getTileAt(cc.v2(isox, isoy));
                        if (tile) {
                            // a tile is clicked!
                            var tileGid = layer.getTileGIDAt(cc.v2(isox, isoy));
                            UIDebug.log('Clicked on layer ' + layer.getLayerName() + ' tile at ' + isox + ',' + isoy + ' GID=' + tileGid);
                            return;
                        }
                    }
                }
            }
        }, this.node);
    },

    start: function start(err) {
        if (err) return;

        // Scroll map to starting offset
        this.mapScrollView.scrollToOffset(this.startOffset);

        // Get tileMap component
        this._tiledMap = this.node.getComponent('cc.TiledMap');

        // display debug info on map "objects"
        if (this._tiledMap) {
            var groups = this._tiledMap.getObjectGroups();
            for (var i = groups.length - 1; i >= 0; i--) {
                var group = groups[i];
                var objs = group.getObjects();

                for (var j = 0; j < objs.length; j++) {
                    var obj = objs[j];

                    var pos = this.node.convertToWorldSpace(new cc.Vec2(obj.sgNode.x, obj.sgNode.y));

                    var dbg = cc.instantiate(this.debugLabelPrefab);

                    dbg.setPosition(pos);
                    dbg.setParent(this.node);

                    var label = dbg.getComponentInChildren(cc.Label);

                    label.string = obj.name + ': ' + Math.floor(obj.sgNode.x) + ',' + Math.floor(obj.sgNode.y);
                }
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // ScrollView callback, so we know when its scrolling
    scrollEvent: function scrollEvent(sender, event) {
        if (event < 9) {
            this._isScrolling = true;
        } else {
            this._isScrolling = false;
        }
    }
});

cc._RF.pop();
},{"UIDebug":"UIDebug","UIOffice":"UIOffice"}],"SpriteFrameSet":[function(require,module,exports){
"use strict";
cc._RF.push(module, '97019Q80jpE2Yfz4zbuCZBq', 'SpriteFrameSet');
// ..\i18n-plugin\SpriteFrameSet.js

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
// Scripts\Startup.js

'use strict';

var _Game = require('Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Startup component, used to initialize the game
//
// Must be started before every other "GoF" components

var i18n = require('LanguageData');

var game = new _Game2.default();

cc.Class({
    extends: cc.Component,
    editor: {
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
    onLoad: function onLoad() {
        //Game.getInstance().init();
        game.init();
    }

});

cc._RF.pop();
},{"Game":"Game","LanguageData":"LanguageData"}],"UIDebug":[function(require,module,exports){
"use strict";
cc._RF.push(module, '18ea2AjTFtAb7SJWmEwfDmn', 'UIDebug');
// Scripts\UIDebug.js

'use strict';

var _Game = require('Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game = new _Game2.default();

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
            var l = UIDebug._log.length;
            if (l == 5) {
                l = 4;
            }
            for (var i = l; i > 0; i--) {
                UIDebug._log[i] = UIDebug._log[i - 1];
            }

            UIDebug._log[0] = line;
        },
        touchLog: ''
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (UIDebug.instance != null) {
            cc.error('UIDebug instance already loaded');
        }
        UIDebug.instance = this;
        UIDebug.log(game.initialized + '\n isDebug=' + game.isDebug + '\n' + game.config.SERVICES_URL);
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
            }
        }
    }
});

cc._RF.pop();
},{"Game":"Game"}],"UIOffice":[function(require,module,exports){
"use strict";
cc._RF.push(module, '6a190mC+6ZOA5vlgY1st6XK', 'UIOffice');
// Scripts\UIOffice.js

'use strict';

var _UIPopupBase = require('UIPopupBase');

var _UIPopupBase2 = _interopRequireDefault(_UIPopupBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UIOffice = cc.Class({
    extends: _UIPopupBase2.default,
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
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {

        UIOffice.instance = this;
        this.init();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBtClose: function onBtClose() {
        this.hide();
    }

});

cc._RF.pop();
},{"UIPopupBase":"UIPopupBase"}],"UIPopupBase":[function(require,module,exports){
"use strict";
cc._RF.push(module, '26b02/CIaZOIqLKQKleyE5X', 'UIPopupBase');
// Scripts\UIPopupBase.js

'use strict';

// UIPopupBase is a base class to make a popup appear from a side
//

// Direction from the popup will appear
var FromMode = cc.Enum({
    //@property LEFT
    LEFT: 0,
    //@property RIGHT
    RIGHT: 1,
    //@property TOP
    TOP: 2,
    //@property BOTTOM
    BOTTOM: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        From: {
            default: FromMode.LEFT,
            type: FromMode
        }
    },

    init: function init() {
        this._hidden = false;
        this._defaultX = this.node.x;
        this._defaultY = this.node.y;
        this._size = this.node.getContentSize();

        this.hide(true);
    },

    show: function show() {
        if (this._hidden) {
            this.node.stopAllActions();

            this.node.runAction(cc.moveTo(0.2, cc.p(this._defaultX, this._defaultY)));
            this._hidden = false;
        }
    },

    hide: function hide() {
        var instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!this._hidden) {
            this.node.stopAllActions();

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
                this.node.runAction(cc.moveTo(0.2, to));
            } else {
                this.node.x = to.x;
                this.node.y = to.y;
            }
            this._hidden = true;
        }
    }
});

cc._RF.pop();
},{}],"UITop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5d170x4gqNGn6wYSkUsy2s+', 'UITop');
// Scripts\UITop.js

'use strict';

var _Game = require('Game');

var _Game2 = _interopRequireDefault(_Game);

var _GamePhase = require('GamePhase');

var _GamePhase2 = _interopRequireDefault(_GamePhase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game = new _Game2.default();

cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gof/UITop'
    },
    properties: {
        dateLabel: {
            default: null,
            type: cc.Label
        },
        moneyLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    start: function start() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (game.gamePhase != null) {
            this.dateLabel.string = game.gamePhase.title + ' ' + game.gamePhase.getDateString();
            this.moneyLabel.string = game.gamePhase.money;
        }
    }
});

cc._RF.pop();
},{"Game":"Game","GamePhase":"GamePhase"}],"fr":[function(require,module,exports){
"use strict";
cc._RF.push(module, '686d3MfJx1GtoGUwTQcNuPP', 'fr');
// resources\i18n\fr.js

"use strict";

if (!window.i18n) window.i18n = {};if (!window.i18n.languages) window.i18n.languages = {};
window.i18n.languages.fr = {
	"game_title": "Game of Farms",
	"assollement": "Assollement"
};

cc._RF.pop();
},{}],"polyglot.min":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e26fd9yy65A4q3/JkpVnFYg', 'polyglot.min');
// ..\i18n-plugin\polyglot.min.js

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
},{}]},{},["LanguageData","LocalizedLabel","LocalizedSprite","SpriteFrameSet","polyglot.min","Game","GameOld","GamePhase","LocalizedLabelExt","MapCtrl","Startup","UIDebug","UIOffice","UIPopupBase","UITop","fr"]);
