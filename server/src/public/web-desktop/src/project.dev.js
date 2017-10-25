require = function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) {
                    return a(o, !0);
                }
                if (i) {
                    return i(o, !0);
                }
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n || e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = "function" == typeof require && require;
    for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }
    return s;
}({
    ApiClient: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "a5aaaraT9pJs4mh90pQOvW8", "ApiClient");
        "use strict";
        function ApiClient(_EndPoint) {
            this.endPoint = _EndPoint;
            var elem = document.getElementById("GameCanvas");
            var at = elem.getAttribute("gof-access-token") || localStorage.getItem("gof-access-token");
            var channel = elem.getAttribute("gof-channel-id") || localStorage.getItem("gof-channel-id");
            at && (this.accessToken = at);
            channel && (this.channelId = channel);
        }
        function params(payload) {
            if (!payload) {
                return "";
            }
            var p = "";
            var keys = Object.keys(payload);
            for (var i = 0; i < keys.length; ++i) {
                i > 0 && (p += "&");
                p += keys[i] + "=" + encodeURIComponent(payload[keys[i]]);
            }
            return p.length > 0 ? p : null;
        }
        function get(client, path, query, callback) {
            return buildRequest(client, "GET", path, query, callback);
        }
        function post(client, path, callback) {
            var req = buildRequest(client, "POST", path, null, callback);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            return req;
        }
        function buildRequest(client, method, path, query, callback) {
            var req = new XMLHttpRequest();
            var qs = params(query);
            var p = client.endPoint + path + (qs.length ? "?" + qs : "");
            req.open(method, p, true);
            client.accessToken && req.setRequestHeader("Authorization", "Bearer " + client.accessToken);
            req.onreadystatechange = function(event) {
                if (4 != req.readyState) {
                    return;
                }
                var json = null;
                try {
                    json = JSON.parse(req.responseText);
                } catch (e) {}
                if (200 !== req.status && callback) {
                    callback(json, null, client);
                    return;
                }
                callback && callback(null, json, client);
            };
            return req;
        }
        ApiClient.prototype.checkAuth = function(callback) {
            var req = get(this, "/auth/check", null, callback);
            req.send(null);
        };
        ApiClient.prototype.login = function(email, password, callback) {
            var req = post(this, "/auth/login", function(error, response, client) {
                response && (client.accessToken = response.payload.accessToken);
                callback(error, response, client);
            });
            var p = params({
                email: email,
                password: password
            });
            req.send(p);
        };
        ApiClient.prototype.getItems = function(from, options, callback) {
            var req = get(this, "/" + from, options, callback);
            req.send();
        };
        ApiClient.prototype.getItem = function(from, id, callback) {
            var req = get(this, "/" + from + "/" + encodeURIComponent(id), null, callback);
            req.send();
        };
        ApiClient.prototype.getActivity = function(id, callback) {
            var req = get(this, "/activities/" + encodeURIComponent(id), null, callback);
            req.send();
        };
        ApiClient.prototype.getActivities = function(options, callback) {
            var req = get(this, "/activities", options, callback);
            req.send();
        };
        ApiClient.prototype.getScenarios = function(uid, callback) {
            var req = null;
            req = uid ? get(this, "/scenarios/" + encodeURIComponent(uid), null, callback) : get(this, "/scenarios", null, callback);
            req.send();
        };
        ApiClient.prototype.getGameData = function(callback) {
            if (!this.channelId) {
                cc.error("Missing channel id");
                return;
            }
            var req = null;
            req = get(this, "/channel/getgamedata/" + encodeURIComponent(this.channelId), null, callback);
            req.send();
        };
        ApiClient.prototype.setGameData = function(data, callback) {
            if (!this.channelId) {
                cc.error("Missing channel id");
                return;
            }
            var req = null;
            req = post(this, "/channel/setgamedata", callback);
            var p = params({
                chanId: this.channelId,
                gameData: data
            });
            req.send(p);
        };
        ApiClient.prototype.setScore = function(score, details, callback) {
            if (!this.channelId) {
                cc.error("Missing channel id");
                return;
            }
            var req = null;
            req = post(this, "/channel/setscore", callback);
            var p = params({
                chanId: this.channelId,
                score: score,
                details: details
            });
            req.send(p);
        };
        module.exports = ApiClient;
        cc._RF.pop();
    }, {} ],
    Farm: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "a0071wrzthDjJMdvjOEmTUS", "Farm");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var CParcel = require("Parcel");
        var CFarm = function() {
            function CFarm(_Name, _Surface) {
                _classCallCheck(this, CFarm);
                this.name = _Name;
                this.totalSurface = void 0 === _Surface ? 0 : _Surface;
                this.surfacePerTile = 1;
                this.parcels = [];
                this.possibleSpecies = [];
                this.money = 0;
                this.workTime = 0;
                this.year = 0;
                this.month = 0;
                this.week = 0;
            }
            _createClass(CFarm, [ {
                key: "addParcel",
                value: function addParcel(_Parcel) {
                    this.parcels.push(_Parcel);
                }
            }, {
                key: "findParcelAt",
                value: function findParcelAt(_Pos) {
                    for (var i = 0; i < this.parcels.length; i++) {
                        var parcel = this.parcels[i];
                        if (parcel.hasTile(_Pos)) {
                            return parcel;
                        }
                    }
                    return null;
                }
            }, {
                key: "findParcelAdjacent",
                value: function findParcelAdjacent(_Pos) {
                    for (var i = 0; i < this.parcels.length; i++) {
                        var parcel = this.parcels[i];
                        if (parcel.isAdjacent(_Pos)) {
                            return parcel;
                        }
                    }
                    return null;
                }
            }, {
                key: "findParcelUID",
                value: function findParcelUID(_UID) {
                    if (void 0 !== _UID) {
                        var parcel = this.parcels.find(function(p) {
                            return p.uid == _UID;
                        });
                        if (void 0 !== parcel) {
                            return parcel;
                        }
                    }
                    return null;
                }
            }, {
                key: "serialize",
                value: function serialize() {
                    var json = {
                        parcels: [],
                        money: this.money,
                        workTime: this.workTime
                    };
                    for (var i = 0; i < this.parcels.length; i++) {
                        var parcel = this.parcels[i];
                        json.parcels.push(parcel.serialize());
                    }
                    return json;
                }
            }, {
                key: "deserialize",
                value: function deserialize(_JSon) {
                    this.money = _JSon.money;
                    this.workTime = _JSon.workTime;
                    for (var i = 0; i < _JSon.parcels.length; i++) {
                        var parcelJson = _JSon.parcels[i];
                        var parcel = this.findParcelUID(parcelJson.uid);
                        null != parcel ? parcel.deserialize(parcelJson) : cc.error("Can't find parcel UID: " + parcelJson.uid);
                    }
                }
            } ]);
            return CFarm;
        }();
        exports.default = CFarm;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {
        Parcel: "Parcel"
    } ],
    GamePhase: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "3ac1bWprMFKCozrFNz9biyB", "GamePhase");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var CGamePhase = function CGamePhase() {
            _classCallCheck(this, CGamePhase);
            this.uid = "assolement";
            this.startMoney = 5e4;
            this.startMonth = 7;
            this.startWeek = 3;
            this.introTextId = null;
            this.objctiveTextId = null;
            this.startYearDiff = 0;
            this.perfectScore = 0;
            this.maxPrevisions = 1;
            this.endCondition = "false";
            this.completionStr = "";
            this.plantExcludes = [];
            this.parcels = [ {
                uid: "parcel1",
                history: [ {
                    species: "ble",
                    culture: "bio"
                }, {
                    species: "orge",
                    culture: "normal"
                } ]
            } ];
        };
        exports.default = CGamePhase;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {} ],
    Game: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "37f159UDU9GBpEOdPYC0xWt", "Game");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _class, _temp;
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var CGamePhase = require("./GamePhase");
        var CParcelSetup = require("./ParcelSetup");
        var CFarm = require("./Farm");
        var CPlant = require("./Plant");
        var i18n = require("LanguageData");
        var SharedConsts = require("./common/constants");
        var ApiClient = require("./ApiClient");
        var UIDebug = require("./UI/UIDebug");
        var UIEnv = require("./UI/UIEnv");
        var CUsableItem = require("./UsableItem");
        var DEBUG = false;
        var ConfigDebug = {
            LANGUAGE_DEFAULT: "fr",
            MAP_ZOOM_MAX: 1.7,
            MAP_ZOOM_MIN: .1
        };
        var ConfigMaster = {
            LANGUAGE_DEFAULT: "fr",
            MAP_ZOOM_MAX: 1,
            MAP_ZOOM_MIN: .4
        };
        var instance = null;
        var criticalError = function criticalError(error, details) {
            if (!error) {
                return;
            }
            if (DEBUG) {
                var message = error.message;
                details && (message += "\n" + details);
                UIEnv.message.show(message, i18n.t("error"), {
                    buttons: "none"
                });
            } else {
                UIEnv.message.show(error.message, i18n.t("error"), {
                    buttons: "none"
                });
            }
        };
        var CGame = (_temp = _class = function() {
            function CGame() {
                _classCallCheck(this, CGame);
                this.state = CGame.State.INVALID;
                this._currPhase = null;
                this._startYear = 0;
                this._saving = false;
                if (instance) {
                    return instance;
                }
                instance = this;
                instance.isDebug = DEBUG;
                instance.constants = SharedConsts;
                instance.config = DEBUG ? ConfigDebug : ConfigMaster;
                i18n.init(instance.config.LANGUAGE_DEFAULT);
                instance.farm = new CFarm();
                var now = new Date(Date.now());
                instance.farm.year = now.getFullYear();
                instance.plants = [];
                instance.usableItems = [];
            }
            _createClass(CGame, [ {
                key: "findPlant",
                value: function findPlant(_Species) {
                    if (_Species) {
                        var plant = instance.plants.find(function(el) {
                            return el.species == _Species;
                        });
                        if (void 0 !== plant) {
                            return plant;
                        }
                    }
                    return null;
                }
            }, {
                key: "findUsableItem",
                value: function findUsableItem(_Name) {
                    if (_Name) {
                        return instance.usableItems.find(function(el) {
                            return el.name == _Name;
                        });
                    }
                    return null;
                }
            }, {
                key: "_pullUsableItems",
                value: function _pullUsableItems(fromList, index, callback) {
                    index < fromList.length ? instance.api.getItems(fromList[index], null, function(error, json, c) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        if (json && Array.isArray(json)) {
                            UIDebug.log("Pulled " + fromList[index] + ": " + json.length);
                            for (var i = 0; i < json.length; i++) {
                                var jsonItem = json[i];
                                var item = instance.findUsableItem(jsonItem.name);
                                if (item) {
                                    cc.warn("Found duplicate usableItem: " + item.name);
                                } else {
                                    item = new CUsableItem(jsonItem);
                                    item._valid && instance.usableItems.push(item);
                                }
                            }
                        }
                        instance._pullUsableItems(fromList, index + 1, callback);
                    }) : callback();
                }
            }, {
                key: "pullDatabase",
                value: function pullDatabase() {
                    if (!instance.api) {
                        cc.error("Please setup CGame.api");
                        return;
                    }
                    instance.api.getActivities(null, function(error, json, c) {
                        if (error) {
                            return criticalError(error);
                        }
                        if (json && Array.isArray(json)) {
                            UIDebug.log("Pulled activities: " + json.length);
                            for (var i = 0; i < json.length; i++) {
                                var jsonPlant = json[i];
                                var plant = instance.findPlant(jsonPlant.species);
                                if (null != plant) {
                                    plant.update(jsonPlant);
                                } else {
                                    plant = new CPlant(jsonPlant);
                                    plant._valid && instance.plants.push(plant);
                                }
                            }
                            instance._pullUsableItems([ "tools", "equipments", "additives" ], 0, function(err) {
                                if (err) {
                                    criticalError(err);
                                } else {
                                    instance._processActivities();
                                    instance.state = CGame.State.READY;
                                }
                            });
                        } else {
                            UIEnv.message.show(i18n.t("error_connection_failed"), i18n.t("error"), {
                                buttons: "none"
                            });
                            UIDebug.log("Error: Invalid response for getActivities: " + json);
                        }
                    });
                }
            }, {
                key: "saveChannel",
                value: function saveChannel(callback) {
                    if (!instance.api || !instance.api.channelId) {
                        return;
                    }
                    if (instance._saving) {
                        callback && callback();
                        return;
                    }
                    if (instance.state >= CGame.State.PHASE_READY && instance.state <= CGame.State.PHASE_SCORE) {
                        instance._saving = true;
                        var save = {};
                        save.date = Date.now();
                        save.phaseState = instance.state;
                        save.farm = instance.farm.serialize();
                        var self = instance;
                        instance.api.setGameData(JSON.stringify(save), function(err, res, c) {
                            self._saving = false;
                            callback && callback();
                            err && UIEnv.message.show(err.message, i18n.t("error"));
                        });
                    }
                }
            }, {
                key: "openChannel",
                value: function openChannel() {
                    if (!instance.api) {
                        cc.error("Please setup CGame.api");
                        return;
                    }
                    instance.state = CGame.State.CHANNEL_OPEN;
                    var self = instance;
                    instance.api.getGameData(function(err, res, c) {
                        if (err) {
                            return criticalError(err);
                        }
                        if (!res.payload.phase) {
                            return criticalError(new Error("invalid getgamedata result", res.payload));
                        }
                        var phaseId = res.payload.phase;
                        if (res.payload.gameData && 0 != Object.keys(res.payload.gameData).length) {
                            UIDebug.log("Restoring existing game from channel");
                            var save = res.payload.gameData;
                            try {
                                "string" == typeof save && (save = JSON.parse(res.payload.gameData));
                                if (!save || !save.farm || !save.phaseState) {
                                    return criticalError(new Error("Invalid gameData"), res.payload.gameData);
                                }
                                self.farm.deserialize(save.farm);
                            } catch (_e) {
                                return criticalError(new Error("Exception restoring gameData"), _e);
                            }
                            self.loadPhase(phaseId, function(err) {
                                if (err) {
                                    criticalError(err);
                                } else {
                                    self.state = save.phaseState;
                                    UIDebug.log("Restoration succeeded - going to state " + self.state);
                                    self.state == CGame.State.PHASE_SCORE && UIEnv.questInfo.onBtValidate();
                                }
                            });
                        } else {
                            UIDebug.log("Starting phase from channel: " + phaseId);
                            self.loadPhase(phaseId, criticalError);
                        }
                    });
                }
            }, {
                key: "phaseStart",
                value: function phaseStart() {
                    instance.state == CGame.State.PHASE_READY ? instance.state = CGame.State.PHASE_RUN : cc.error("Invalid state to start a phase: " + Object.keys()[instance.state + 1]);
                }
            }, {
                key: "phaseFinish",
                value: function phaseFinish(_Score, _Results) {
                    if (instance.state <= CGame.State.PHASE_SCORE) {
                        var self = instance;
                        instance.state = CGame.State.PHASE_SCORE;
                        var resultString = JSON.stringify(_Results);
                        instance.saveChannel(function() {
                            instance.api.setScore(_Score, resultString, function(err, res, c) {
                                instance.state = CGame.State.PHASE_DONE;
                            });
                        });
                    }
                }
            }, {
                key: "phaseCanFinish",
                value: function phaseCanFinish() {
                    return true === eval(instance._currPhase.endCondition);
                }
            }, {
                key: "phaseGetCompletionStr",
                value: function phaseGetCompletionStr() {
                    return eval(instance._currPhase.completionStr);
                }
            }, {
                key: "phaseGetIntroText",
                value: function phaseGetIntroText() {
                    return i18n.t(instance._currPhase.introTextId);
                }
            }, {
                key: "phaseGetObjectiveText",
                value: function phaseGetObjectiveText() {
                    return i18n.t(instance._currPhase.objectiveTextId);
                }
            }, {
                key: "loadPhase",
                value: function loadPhase(uid, callback) {
                    instance.state = CGame.State.PHASE_LOAD;
                    instance.api.getScenarios(uid, function(error, json) {
                        if (error) {
                            callback(new Error("Error: Failed to get scenario with uid:" + uid + "\n" + error.message));
                            return;
                        }
                        if (json.scenario.start.farm.parcels.length > instance.farm.parcels.length) {
                            callback(new Error("Error: the scenario " + uid + " contains more parcels than the current gfx farm"));
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
                        phase.maxPrevisions = "croprotation" === uid ? 1 : 0;
                        phase.parcels = new Array();
                        for (var i = 0; i < json.scenario.start.farm.parcels.length; ++i) {
                            var sParcel = json.scenario.start.farm.parcels[i];
                            var parcel = new CParcelSetup();
                            parcel.uid = sParcel.uid;
                            parcel.solution = sParcel.data.solution;
                            parcel.history = new Array();
                            for (var j = 0; j < sParcel.data.rotationHistory.length; ++j) {
                                parcel.history.push(sParcel.data.rotationHistory[j]);
                            }
                            phase.parcels.push(parcel);
                        }
                        instance.phase = phase;
                        callback(null);
                    });
                }
            }, {
                key: "createRandomPhase",
                value: function createRandomPhase() {
                    instance.phase = new CGamePhase();
                    for (var p = 0; p < instance.farm.parcels.length; p++) {
                        var parcel = instance.farm.parcels[p];
                        parcel.rotationHistory = [];
                        for (var h = 0; h < 5; h++) {
                            var id = Math.floor(cc.random0To1() * instance.plants.length);
                            id == instance.plants.length && id--;
                            var plant = instance.plants[id];
                            var culture = SharedConsts.CultureModeEnum.NORMAL;
                            id = Math.floor(3 * cc.random0To1());
                            1 == id && (culture = SharedConsts.CultureModeEnum.BIO);
                            2 == id && (culture = SharedConsts.CultureModeEnum.REASONED);
                            parcel.rotationHistory.push({
                                species: plant.species,
                                culture: culture
                            });
                        }
                    }
                }
            }, {
                key: "_processActivities",
                value: function _processActivities() {
                    for (var plantIndex = 0; plantIndex < instance.plants.length; plantIndex++) {
                        var plant = instance.plants[plantIndex];
                        var itkKeys = Object.keys(plant.itks);
                        if (itkKeys && itkKeys.length > 0) {
                            for (var itkId = 0; itkId < itkKeys.length; itkId++) {
                                var itk = plant.itks[itkKeys[itkId]];
                                if (!itk) {
                                    continue;
                                }
                                "hectare" != itk.sizeUnitName && UIDebug.log("Unsupported ITK size unit: " + itk.sizeUnitName);
                                itk.unitCosts = {
                                    money: 0,
                                    time: 0
                                };
                                itk.unitResults = {
                                    money: 0
                                };
                                var logName = "[" + itk.culture.species + " " + itk.culture.mode + "] ";
                                for (var procId = 0; procId < itk.procedures.length; procId++) {
                                    var procedure = itk.procedures[procId];
                                    procedure.unitCosts = {
                                        money: 0,
                                        time: 0
                                    };
                                    if (procedure.workingGroups) {
                                        for (var wgId = 0; wgId < procedure.workingGroups.length; wgId++) {
                                            var wg = procedure.workingGroups[wgId];
                                            var time = 1;
                                            if (wg.workingTimePerSizeUnit) {
                                                time = Number(wg.workingTimePerSizeUnit);
                                                procedure.unitCosts.time += time;
                                            }
                                            if (wg.tools) {
                                                for (var i = 0; i < wg.tools.length; i++) {
                                                    var usable = instance.findUsableItem(wg.tools[i].name);
                                                    usable ? procedure.unitCosts.money += time * usable.pricePerUnit : cc.warn(logName + "Missing tool datas: " + wg.tools[i].name);
                                                }
                                            }
                                            if (wg.doers) {
                                                for (var i = 0; i < wg.doers.length; i++) {
                                                    var usable = instance.findUsableItem(wg.doers[i]);
                                                    usable ? procedure.unitCosts.money += time * usable.pricePerUnit : cc.warn(logName + "Missing doers datas: " + wg.doers[i]);
                                                }
                                            }
                                        }
                                    }
                                    if (procedure.inputs) {
                                        for (var inputId = 0; inputId < procedure.inputs.length; inputId++) {
                                            var input = procedure.inputs[inputId];
                                            var quantity = Number(input.quantityPerSizeUnit);
                                            quantity || (quantity = 1);
                                            var usable = instance.findUsableItem(input.name.trim());
                                            if (usable) {
                                                input.unitPerSizeUnit ? usable.unit && usable.unit != input.unitPerSizeUnit && cc.warn(logName + "Units not corresponding: input " + input.name + "=" + input.unitPerSizeUnit + " / database=" + usable.unit) : cc.warn(logName + "Missing unitPerSizeUnit in itk input: " + input.name);
                                                procedure.unitCosts.money += usable.pricePerUnit * quantity;
                                            } else {
                                                (input.name.indexOf("_seed") > 0 || input.name.indexOf("_grain") > 0) && (procedure.unitCosts.money += plant.getBuyPrice(itk.culture.mode) * quantity);
                                                cc.warn(logName + "Missing itk input datas: " + input.name);
                                            }
                                        }
                                    }
                                    if (procedure.outputs) {
                                        for (var outputId = 0; outputId < procedure.outputs.length; outputId++) {
                                            var output = procedure.outputs[outputId];
                                            var quantity = Number(output.quantityPerSizeUnit);
                                            quantity || (quantity = 1);
                                            var usable = instance.findUsableItem(output.name);
                                            if (usable) {
                                                (!output.unitPerSizeUnit || "qt" != output.unitPerSizeUnit && "t" != output.unitPerSizeUnit) && cc.warn(logName + "Missing or unsupported unitPerSizeUnit: " + output.unitPerSizeUnit + " in itk output: " + output.name);
                                                itk.unitResults.money += usable.pricePerUnit * quantity;
                                            } else {
                                                itk.unitResults.money += plant.getSellPrice(itk.culture.mode) * quantity;
                                                cc.warn(logName + "Missing itk output datas: " + output.name);
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
            }, {
                key: "phase",
                get: function get() {
                    return instance._currPhase;
                },
                set: function set(_Phase) {
                    if (void 0 !== _Phase && null !== _Phase) {
                        if (null !== instance._currPhase && instance._currPhase.uid == _Phase.uid) {
                            return;
                        }
                        instance.farm.month = _Phase.startMonth;
                        instance.farm.week = _Phase.startWeek;
                        if (null === instance._currPhase) {
                            instance.farm.money = _Phase.startMoney;
                            instance.farm.plantExcludes = _Phase.plantExcludes;
                            for (var i = 0; i < _Phase.parcels.length; i++) {
                                var setup = _Phase.parcels[i];
                                var parcel = instance.farm.findParcelUID(setup.uid);
                                if (null != parcel) {
                                    parcel.rotationHistory = setup.history;
                                    parcel.solution = setup.solution;
                                } else {
                                    cc.error("Could not find parcel uid " + setup.uid);
                                }
                            }
                        } else {
                            instance.farm.year += _Phase.startYearDiff;
                        }
                        instance._currPhase = _Phase;
                        instance.state = CGame.State.PHASE_READY;
                    } else {
                        instance._currPhase = null;
                        instance.state != CGame.State.INVALID && (instance.state = CGame.State.READY);
                    }
                }
            } ]);
            return CGame;
        }(), _class.State = {
            INVALID: -1,
            READY: 0,
            CHANNEL_OPEN: 10,
            PHASE_LOAD: 11,
            PHASE_READY: 12,
            PHASE_RUN: 13,
            PHASE_SCORE: 14,
            PHASE_DONE: 15
        }, _temp);
        exports.default = CGame;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {
        "./ApiClient": "ApiClient",
        "./Farm": "Farm",
        "./GamePhase": "GamePhase",
        "./ParcelSetup": "ParcelSetup",
        "./Plant": "Plant",
        "./UI/UIDebug": "UIDebug",
        "./UI/UIEnv": "UIEnv",
        "./UsableItem": "UsableItem",
        "./common/constants": "constants",
        LanguageData: "LanguageData"
    } ],
    LanguageData: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "61de062n4dJ7ZM9/Xdumozn", "LanguageData");
        "use strict";
        var Polyglot = require("polyglot.min");
        var polyInst = null;
        window.i18n || (window.i18n = {
            languages: {},
            curLang: ""
        });
        function loadLanguageData(language) {
            return window.i18n.languages[language];
        }
        function initPolyglot(data) {
            data && (polyInst ? polyInst.replace(data) : polyInst = new Polyglot({
                phrases: data,
                allowMissing: true
            }));
        }
        module.exports = {
            init: function init(language) {
                if (language && language === window.i18n.curLang) {
                    return;
                }
                var data = null;
                if (language) {
                    data = loadLanguageData(language);
                    window.i18n.curLang = language;
                } else {
                    data = loadLanguageData(window.i18n.curLang);
                }
                initPolyglot(data);
            },
            t: function t(key, opt) {
                if (polyInst) {
                    return polyInst.t(key, opt);
                }
            },
            inst: polyInst,
            updateSceneRenderers: function updateSceneRenderers() {
                var rootNodes = cc.director.getScene().children;
                var allLocalizedLabels = [];
                for (var i = 0; i < rootNodes.length; ++i) {
                    var labels = rootNodes[i].getComponentsInChildren("LocalizedLabel");
                    Array.prototype.push.apply(allLocalizedLabels, labels);
                }
                for (var _i = 0; _i < allLocalizedLabels.length; ++_i) {
                    var label = allLocalizedLabels[_i];
                    label.updateLabel();
                }
                var allLocalizedSprites = [];
                for (var _i2 = 0; _i2 < rootNodes.length; ++_i2) {
                    var sprites = rootNodes[_i2].getComponentsInChildren("LocalizedSprite");
                    Array.prototype.push.apply(allLocalizedSprites, sprites);
                }
                for (var _i3 = 0; _i3 < allLocalizedSprites.length; ++_i3) {
                    var sprite = allLocalizedSprites[_i3];
                    sprite.updateSprite(window.i18n.curLang);
                }
            }
        };
        cc._RF.pop();
    }, {
        "polyglot.min": "polyglot.min"
    } ],
    LocalizedLabelExt: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "7eb01WD8EJDeZNKJNi9e5fa", "LocalizedLabelExt");
        "use strict";
        var i18n = require("LanguageData");
        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function later() {
                    timeout = null;
                    immediate || func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                callNow && func.apply(context, args);
            };
        }
        cc.Class({
            extends: cc.Component,
            editor: {
                executeInEditMode: true,
                menu: "i18n/LocalizedTextExt"
            },
            properties: {
                dataID: {
                    get: function get() {
                        return this._dataID;
                    },
                    set: function set(val) {
                        if (this._dataID !== val) {
                            this._dataID = val;
                            this.updateLabel();
                        }
                    }
                },
                _dataID: "",
                forceUppercase: {
                    get: function get() {
                        return this._forceUppercase;
                    },
                    set: function set(val) {
                        if (this._forceUppercase !== val) {
                            this._forceUppercase = val;
                            this.updateLabel();
                        }
                    }
                },
                _forceUppercase: false
            },
            onLoad: function onLoad() {
                i18n.inst || i18n.init();
                this.fetchRender();
            },
            fetchRender: function fetchRender() {
                var label = this.getComponent(cc.Label);
                label || (label = this.getComponent(cc.RichText));
                if (label) {
                    this.label = label;
                    this.updateLabel();
                    return;
                }
            },
            updateLabel: function updateLabel() {
                if (!this.label) {
                    cc.error("Failed to update localized text!");
                    return;
                }
                var localizedString = i18n.t(this.dataID);
                if (localizedString) {
                    this.forceUppercase && (localizedString = localizedString.toUpperCase());
                    this.label.string = localizedString;
                } else {
                    cc.warn("Missing text id: " + this.dataID);
                }
            }
        });
        cc._RF.pop();
    }, {
        LanguageData: "LanguageData"
    } ],
    LocalizedLabel: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "744dcs4DCdNprNhG0xwq6FK", "LocalizedLabel");
        "use strict";
        var i18n = require("LanguageData");
        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function later() {
                    timeout = null;
                    immediate || func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                callNow && func.apply(context, args);
            };
        }
        cc.Class({
            extends: cc.Component,
            editor: {
                executeInEditMode: true,
                menu: "i18n/LocalizedLabel"
            },
            properties: {
                dataID: {
                    get: function get() {
                        return this._dataID;
                    },
                    set: function set(val) {
                        if (this._dataID !== val) {
                            this._dataID = val;
                            this.updateLabel();
                        }
                    }
                },
                _dataID: ""
            },
            onLoad: function onLoad() {
                i18n.inst || i18n.init();
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
                    cc.error("Failed to update localized label, label component is invalid!");
                    return;
                }
                var localizedString = i18n.t(this.dataID);
                localizedString && (this.label.string = i18n.t(this.dataID));
            }
        });
        cc._RF.pop();
    }, {
        LanguageData: "LanguageData"
    } ],
    LocalizedSprite: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "f34ac2GGiVOBbG6XlfvgYP4", "LocalizedSprite");
        "use strict";
        var SpriteFrameSet = require("SpriteFrameSet");
        cc.Class({
            extends: cc.Component,
            editor: {
                executeInEditMode: true,
                inspector: "packages://i18n/inspector/localized-sprite.js",
                menu: "i18n/LocalizedSprite"
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
                    cc.error("Failed to update localized sprite, sprite component is invalid!");
                    return;
                }
                var spriteFrame = this.getSpriteFrameByLang(language);
                !spriteFrame && this.spriteFrameSet[0] && (spriteFrame = this.spriteFrameSet[0].spriteFrame);
                this.sprite.spriteFrame = spriteFrame;
            }
        });
        cc._RF.pop();
    }, {
        SpriteFrameSet: "SpriteFrameSet"
    } ],
    MapCtrl: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "e2e73B/wgFOW6TFModC0XXp", "MapCtrl");
        "use strict";
        var CGame = require("./Game");
        var CFarm = require("./Farm");
        var CParcel = require("./Parcel");
        var UIParcelButton = require("./UI/UIParcelButton");
        var UIEnv = require("./UI/UIEnv");
        var UIOffice = require("./UI/UIOffice");
        var UIDebug = require("./UI/UIDebug");
        var i18n = require("LanguageData");
        var game = new CGame();
        var MapCtrl = cc.Class({
            extends: cc.Component,
            editor: {
                requireComponent: cc.ScrollView,
                menu: "gof/MapCtrl"
            },
            properties: {
                mapUILayer: {
                    default: null,
                    type: cc.Node,
                    displayName: "UI layer"
                },
                startOffset: {
                    default: new cc.Vec2(0, 0),
                    displayName: "Scroll starting pos"
                },
                mapParcels: {
                    default: [],
                    type: [ cc.TiledMap ],
                    displayName: "Parcels maps"
                },
                mapSprouts: {
                    default: [],
                    type: [ cc.TiledMap ],
                    displayName: "Sprouts maps"
                },
                mapObjects: {
                    default: [],
                    type: [ cc.TiledMap ],
                    displayName: "Objects maps"
                },
                parcelsGID: {
                    default: [],
                    type: [ cc.Integer ],
                    displayName: "Parcels GID"
                },
                parcelButtonPrefab: {
                    default: null,
                    type: cc.Prefab,
                    displayName: "Prefab Parcels button"
                },
                debugLabelPrefab: {
                    default: null,
                    type: cc.Prefab
                }
            },
            statics: {
                instance: null
            },
            _mapScrollView: null,
            _refMap: null,
            _refLayer: null,
            _refSize: null,
            onLoad: function onLoad() {
                null == MapCtrl.instance ? MapCtrl.instance = this : cc.error("An instance of MapCtrl already exists");
                this._mapScrollView = this.getComponent(cc.ScrollView);
                this._mapStartSize = this._mapScrollView.content.getContentSize();
                this.initTouch();
            },
            start: function start(err) {
                if (err) {
                    return;
                }
                this._mapScrollView.scrollToOffset(this.startOffset);
                this.findParcels();
                game.isDebug && this.addDebugInfo();
            },
            update: function update(dt) {
                switch (game.state) {
                  case CGame.State.READY:
                    game.isDebug && !game.api.channelId ? game.loadPhase("croprotation", function(error) {
                        if (error) {
                            UIEnv.message.show(i18n.t("error_connection_failed") + "\n\n(" + error + ")", i18n.t("error"), {
                                buttons: "none"
                            });
                            UIDebug.log(error);
                            return;
                        }
                        UIDebug.log("Local phase started: " + game.phase.uid);
                    }) : game.openChannel();
                    break;

                  case CGame.State.PHASE_READY:
                    UIEnv.questIntro.show();
                }
            },
            checkMapBorders: function checkMapBorders() {
                var center = cc.v2(this._mapScrollView.node.width / 2, this._mapScrollView.node.height / 2);
                center = this._refMap.node.convertToNodeSpace(center);
                center = this.pixelToTile(center, true);
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
                    center = this.tileToPixel(center);
                    center = this.pixelToScroll(center);
                    center.x -= this._mapScrollView.node.width / 2;
                    center.y -= this._mapScrollView.node.height / 2;
                    this._mapScrollView.scrollToOffset(center, .1 * delta);
                }
            },
            initTouch: function initTouch() {
                var _this = this;
                if (this.mapParcels && this.mapParcels.length > 0) {
                    this._refMap = this.mapParcels[0];
                    this._refLayer = this._refMap.allLayers()[0];
                } else {
                    if (!(this.mapSprouts && this.mapSprouts.length > 0)) {
                        cc.error("At least one parcel or sprout TiledMap is required");
                        return;
                    }
                    this._refMap = this.mapSprouts[0];
                    this._refLayer = this._refMap.allLayers()[0];
                }
                var mapSize = this._refMap.getMapSize();
                var tileSize = this._refMap.getTileSize();
                this._refSize = cc.v2(mapSize.width * tileSize.width, mapSize.height * tileSize.height);
                this._mapScrollView._onMouseWheel = function(event, captureListeners) {
                    var speed = .05;
                    event.getScrollY() < 0 && (speed = -speed);
                    var scale = this.content.scaleX + speed;
                    scale < game.config.MAP_ZOOM_MIN && (scale = game.config.MAP_ZOOM_MIN);
                    scale > game.config.MAP_ZOOM_MAX && (scale = game.config.MAP_ZOOM_MAX);
                    this.content.scaleX = scale;
                    this.content.scaleY = scale;
                    this.content.width = MapCtrl.instance._refSize.x * scale;
                    this.content.height = MapCtrl.instance._refSize.y * scale;
                    this._stopPropagationIfTargetIsMe(event);
                    MapCtrl.instance.checkMapBorders();
                };
                this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
                    _this._scrollLen = 0;
                }, this.node);
                this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
                    _this._scrollLen += cc.pLength(event.touch.getDelta());
                }, this.node);
                this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
                    if (_this._scrollLen > 2) {
                        _this._scrollLen = 0;
                        MapCtrl.instance.checkMapBorders();
                        return;
                    }
                });
                this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
                    if (_this._scrollLen > 2) {
                        _this._scrollLen = 0;
                        MapCtrl.instance.checkMapBorders();
                        return;
                    }
                    var touch = event.touch;
                    var loc = _this._refMap.node.convertToNodeSpace(touch.getLocation());
                    UIDebug.touchLog = touch.getLocationX() + "," + touch.getLocationY() + " => " + loc;
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
            touchOnMap: function touchOnMap(_Map, _Pos) {
                var layers = _Map.allLayers();
                var tilePos = this.pixelToTile(_Pos);
                if (null == tilePos) {
                    return false;
                }
                var groups = _Map.getObjectGroups();
                for (var i = groups.length - 1; i >= 0; i--) {
                    var group = groups[i];
                    var objs = group.getObjects();
                    for (var j = 0; j < objs.length; j++) {
                        var obj = objs[j];
                        var margin = .15;
                        var w = obj.sgNode.width * (1 - 2 * margin);
                        var halfw = w / 2;
                        var ydelta = obj.sgNode.height * margin;
                        var h = obj.sgNode.height * (1 - 2 * margin);
                        var rect = cc.rect(obj.sgNode.x - halfw, obj.sgNode.y + ydelta, w, h);
                        if (rect.contains(_Pos)) {
                            game.isDebug && UIDebug.log("Clicked on object " + obj.name);
                            UIOffice.instance.show();
                            return true;
                        }
                    }
                }
                for (var i = layers.length - 1; i >= 0; i--) {
                    var layer = layers[i];
                    var tileGid = layer.getTileGIDAt(tilePos);
                    if (0 != tileGid) {
                        if (game.isDebug) {
                            var debug = "Clicked on layer " + layer.getLayerName() + " tile(" + tilePos.x + "," + tilePos.y + ") GID=" + tileGid;
                            var parcel = game.farm.findParcelAt(tilePos);
                            null != parcel && (debug += " Parcel: " + parcel.name);
                            UIDebug.log(debug);
                        }
                        return true;
                    }
                }
                return false;
            },
            pixelToTile: function pixelToTile(_Pos) {
                var _NoLimit = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                var mapSize = this._refMap.getMapSize();
                var tw = this._refLayer.getMapTileSize().width;
                var th = this._refLayer.getMapTileSize().height;
                var mw = this._refLayer.getLayerSize().width;
                var mh = this._refLayer.getLayerSize().height;
                var x = 1 * _Pos.x;
                var y = 1 * _Pos.y;
                var isox = Math.floor(mh - y / th + x / tw - mw / 2);
                var isoy = Math.floor(mh - y / th - x / tw + mw / 2);
                if (_NoLimit || isox >= 0 && isoy >= 0 && isox < mapSize.width && isoy < mapSize.height) {
                    return cc.v2(isox, isoy);
                }
                return null;
            },
            pixelToScroll: function pixelToScroll(_Pos) {
                var scale = this._mapScrollView.content.scaleX;
                return cc.v2(_Pos.x * scale, (this._refSize.y - _Pos.y) * scale);
            },
            tileToPixel: function tileToPixel(_Pos) {
                var pos = this._refLayer.getPositionAt(_Pos);
                return pos;
            },
            tileToUI: function tileToUI(_Pos) {
                var ts = this._refMap.getTileSize();
                var pos = this._refLayer.getPositionAt(_Pos);
                pos.x += .5 * ts.width;
                pos.y += .5 * ts.height;
                return this.mapToUI(pos);
            },
            mapToUI: function mapToUI(_Pos) {
                return cc.v2(_Pos.x - .5 * this.mapUILayer.width, _Pos.y - .5 * this.mapUILayer.height);
            },
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
                                        if (null != parcel && parcel.tiledLayer == layer) {
                                            parcel.addTile(pos);
                                        } else {
                                            var uid = "parcel" + (game.farm.parcels.length + 1);
                                            var name = i18n.t("parcel") + " " + String(game.farm.parcels.length + 1);
                                            parcel = new CParcel(uid, name, layer);
                                            parcel.addTile(pos);
                                            game.farm.addParcel(parcel);
                                        }
                                        totalTiles++;
                                    }
                                }
                            }
                        }
                        cc.log("TODO: setup the total surface from a metadata in the map?");
                        game.farm.totalSurface = 55;
                        game.farm.surfacePerTile = game.farm.totalSurface / totalTiles;
                    }
                }
                if (game.farm.parcels.length > 0) {
                    for (var k = 0; k < game.farm.parcels.length; k++) {
                        var parcel = game.farm.parcels[k];
                        parcel.surface = Math.ceil(parcel.surface * game.farm.surfacePerTile * 100) / 100;
                        var btPrefab = cc.instantiate(this.parcelButtonPrefab);
                        var bt = btPrefab.getComponent(UIParcelButton);
                        bt.parcel = parcel;
                        btPrefab.setParent(this.mapUILayer);
                        btPrefab.setPosition(this.tileToUI(parcel.rect.center));
                    }
                } else {
                    cc.error("No parcels found! Please check you filled the mapParcel and parcelGID arrays");
                }
            },
            addDebugInfo: function addDebugInfo() {
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
                                label.string = obj.name + ": " + Math.floor(obj.sgNode.x) + "," + Math.floor(obj.sgNode.y);
                            }
                        }
                    }
                }
            },
            __Debug: function __Debug() {}
        });
        module.exports = MapCtrl;
        cc._RF.pop();
    }, {
        "./Farm": "Farm",
        "./Game": "Game",
        "./Parcel": "Parcel",
        "./UI/UIDebug": "UIDebug",
        "./UI/UIEnv": "UIEnv",
        "./UI/UIOffice": "UIOffice",
        "./UI/UIParcelButton": "UIParcelButton",
        LanguageData: "LanguageData"
    } ],
    ParcelSetup: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "4984bnGpblBl65bjVb7vqIW", "ParcelSetup");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var CParcelSetup = function CParcelSetup() {
            _classCallCheck(this, CParcelSetup);
        };
        exports.default = CParcelSetup;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {} ],
    Parcel: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "65708Jw+k5C1oyCvtOGSAar", "Parcel");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var ParcelState = cc.Enum({
            EMPTY: 0,
            FALLOW: 1,
            PLOWED: 2,
            SEEDS: 4,
            GROWING: 5,
            READY: 6
        });
        var CParcel = function() {
            function CParcel(_UID, _Name, _TiledLayer) {
                _classCallCheck(this, CParcel);
                this.uid = _UID;
                this.name = void 0 === _Name ? "" : _Name;
                this.tiledLayer = _TiledLayer;
                this.tiles = [];
                this.rect = cc.rect();
                this.state = ParcelState.EMPTY;
                this.surface = 0;
                this.rotationHistory = [];
                this.rotationPrevision = [];
                this.solution = null;
            }
            _createClass(CParcel, [ {
                key: "hasTile",
                value: function hasTile(_Pos) {
                    for (var i = 0; i < this.tiles.length; i++) {
                        if (this.tiles[i].x === _Pos.x && this.tiles[i].y === _Pos.y) {
                            return true;
                        }
                    }
                    return false;
                }
            }, {
                key: "isAdjacent",
                value: function isAdjacent(_Pos) {
                    for (var i = 0; i < this.tiles.length; i++) {
                        var pos1 = this.tiles[i];
                        if (1 == Math.abs(pos1.x - _Pos.x) && 0 == Math.abs(pos1.y - _Pos.y)) {
                            return true;
                        }
                        if (1 == Math.abs(pos1.y - _Pos.y) && 0 == Math.abs(pos1.x - _Pos.x)) {
                            return true;
                        }
                    }
                    return false;
                }
            }, {
                key: "addTile",
                value: function addTile(_Pos) {
                    this.tiles.push(_Pos);
                    if (0 == this.rect.width) {
                        this.rect.x = _Pos.x;
                        this.rect.y = _Pos.y;
                        this.rect.width = 1;
                        this.rect.height = 1;
                    }
                    this.rect.x > _Pos.x && (this.rect.x = _Pos.x);
                    this.rect.xMax < _Pos.x && (this.rect.width = _Pos.x - this.rect.x);
                    this.rect.y > _Pos.y && (this.rect.y = _Pos.y);
                    this.rect.yMax < _Pos.y && (this.rect.height = _Pos.y - this.rect.y);
                    this.surface++;
                }
            }, {
                key: "serialize",
                value: function serialize() {
                    var json = {
                        uid: this.uid,
                        state: this.state,
                        rotationPrevision: this.rotationPrevision
                    };
                    return json;
                }
            }, {
                key: "deserialize",
                value: function deserialize(_JSon) {
                    if (_JSon.uid !== this.uid) {
                        cc.error("Invalid parcel json");
                        return;
                    }
                    this.state = _JSon.state;
                    this.rotationPrevision = _JSon.rotationPrevision;
                }
            } ]);
            return CParcel;
        }();
        exports.default = CParcel;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {} ],
    Plant: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "5c449arTcdBdrBCkvQ3zcI7", "Plant");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var SharedConsts = require("./common/constants");
        var CPlant = function() {
            function CPlant(_JSON) {
                _classCallCheck(this, CPlant);
                this._valid = true;
                this.dbId = {};
                this.buyPrices = {};
                this.sellPrices = {};
                this.itks = {};
                this.tiledGID = [];
                if (void 0 !== _JSON) {
                    this.species = _JSON.species;
                    this.update(_JSON);
                }
                if (void 0 === this.species) {
                    this._valid = false;
                    cc.error("Invalid plant JSon: " + _JSON);
                }
            }
            _createClass(CPlant, [ {
                key: "update",
                value: function update(_JSON) {
                    if (void 0 !== _JSON.cultureMode && void 0 !== _JSON.pricePerHectare) {
                        var mode = this._CultureMode(_JSON.cultureMode);
                        this.dbId[mode] && this.dbId[mode] != _JSON._id && cc.warn("Conflict on plant: " + this.species + " / mode: " + mode);
                        this.dbId[mode] = _JSON._id;
                        this.buyPrices[mode] = Number(_JSON.pricePerHectare);
                        this.sellPrices[mode] = 20 * Number(_JSON.pricePerHectare);
                        this.itks[mode] = _JSON.itk;
                    }
                }
            }, {
                key: "_CultureMode",
                value: function _CultureMode(_Mode) {
                    var mode = _Mode;
                    if (mode != SharedConsts.CultureModeEnum.NORMAL && mode != SharedConsts.CultureModeEnum.BIO && mode != SharedConsts.CultureModeEnum.REASONED) {
                        cc.error("Invalid culture mode: " + _Mode);
                        mode = SharedConsts.CultureModeEnum.NORMAL;
                    }
                    return mode;
                }
            }, {
                key: "getUnitCosts",
                value: function getUnitCosts(_Mode) {
                    var itk = getItk(_Mode);
                    if (itk) {
                        return itk.unitCosts;
                    }
                    return null;
                }
            }, {
                key: "getBuyPrice",
                value: function getBuyPrice(_Mode) {
                    return this.buyPrices[this._CultureMode(_Mode)];
                }
            }, {
                key: "getSellPrice",
                value: function getSellPrice(_Mode) {
                    return this.sellPrices[this._CultureMode(_Mode)];
                }
            }, {
                key: "getItk",
                value: function getItk(_Mode) {
                    return this.itks[this._CultureMode(_Mode)];
                }
            }, {
                key: "getOutputs",
                value: function getOutputs(_Mode) {
                    var outputs = [];
                    var itk = this.getItk(_Mode);
                    if (itk && itk.procedures) {
                        for (var i = 0; i < itk.procedures.length; i++) {
                            itk.procedures[i].outputs && (outputs = outputs.concat(itk.procedures[i].outputs));
                        }
                    }
                    return outputs;
                }
            }, {
                key: "isFallow",
                get: function get() {
                    return this.species.indexOf("fallow") >= 0 || "pasture" === this.species;
                }
            } ]);
            return CPlant;
        }();
        exports.default = CPlant;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {
        "./common/constants": "constants"
    } ],
    RscPreload: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "65250CXe7xM6InnrNr1oCQh", "RscPreload");
        "use strict";
        var RscPreload = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/RscPreload"
            },
            properties: {
                plantIconsAtlas: {
                    default: null,
                    type: cc.SpriteAtlas
                },
                plantDisIconsAtlas: {
                    default: null,
                    type: cc.SpriteAtlas
                },
                noteIconsAtlas: {
                    default: null,
                    type: cc.SpriteAtlas
                }
            },
            statics: {
                instance: null,
                _defaultPlantIcon: "ico_generique",
                _plantIconId: {
                    corn: "mais",
                    wheat: "ble",
                    durum_wheat: "ble",
                    soft_wheat: "ble",
                    carrot: "carotte",
                    sunflower: "tournesol",
                    barley: "orge",
                    oat: "avoine",
                    rye: "seigle",
                    buckwheat: "sarrasin",
                    pea: "pois",
                    beetroot: "betterave",
                    field_bean: "feverole",
                    soy: "soja",
                    pasture: "prairie",
                    flower_fallow: "jachere_fleurie",
                    fallow: "jachere"
                },
                getPlantIcon: function getPlantIcon(_species, _disabled) {
                    if (null === RscPreload.instance) {
                        cc.error("RscPreload not loaded");
                        return null;
                    }
                    var id = RscPreload._plantIconId[_species];
                    void 0 === id && (id = _species);
                    var spr = null;
                    spr = _disabled ? RscPreload.instance.plantDisIconsAtlas.getSpriteFrame("ico_" + id) : RscPreload.instance.plantIconsAtlas.getSpriteFrame("ico_" + id);
                    if (!spr) {
                        cc.warn("Icon not found for species: " + _species);
                        spr = _disabled ? RscPreload.instance.plantDisIconsAtlas.getSpriteFrame(this._defaultPlantIcon) : RscPreload.instance.plantIconsAtlas.getSpriteFrame(this._defaultPlantIcon);
                    }
                    return spr;
                }
            },
            onLoad: function onLoad() {
                null != RscPreload.instance && cc.error("An instance of RscPreload already exists");
                RscPreload.instance = this;
            }
        });
        module.exports = RscPreload;
        cc._RF.pop();
    }, {} ],
    SpriteFrameSet: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "97019Q80jpE2Yfz4zbuCZBq", "SpriteFrameSet");
        "use strict";
        var SpriteFrameSet = cc.Class({
            name: "SpriteFrameSet",
            properties: {
                language: "",
                spriteFrame: cc.SpriteFrame
            }
        });
        module.exports = SpriteFrameSet;
        cc._RF.pop();
    }, {} ],
    Startup: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "ae2f9bQf21IhJYFeGxAPR6E", "Startup");
        "use strict";
        var i18n = require("LanguageData");
        var ApiClient = require("./ApiClient");
        var CGame = require("./Game");
        var game = new CGame();
        var UIDebug = require("./UI/UIDebug");
        var UIEnv = require("./UI/UIEnv");
        cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/Startup"
            },
            properties: {},
            onLoad: function onLoad() {
                UIDebug.log("CC=" + cc.ENGINE_VERSION + " Sys=" + cc.sys.os + " Browser=" + cc.sys.browserType);
                var endpoint = "/api";
                var isPreview = "localhost" == location.hostname && 3e3 != location.port;
                isPreview && (endpoint = "http://gof.shinypix.dev:3000/api");
                UIDebug.log("API endpoint: " + endpoint);
                var self = this;
                var client = new ApiClient(endpoint);
                client.checkAuth(function(error, response, c) {
                    if (error) {
                        if (!isPreview) {
                            UIEnv.message.show(i18n.t("error_auth_missing"), i18n.t("error"), {
                                onOk: function onOk() {
                                    location.pathname = "/auth/login";
                                }
                            });
                            UIDebug.log("Error: you are not logged in!");
                            return;
                        }
                        var email = prompt("email");
                        var password = prompt("password");
                        c.login(email, password, function(error, response, c) {
                            if (error) {
                                UIEnv.message.show(i18n.t("error_connection_failed"), "Login failed!", {
                                    onOk: function onOk() {
                                        location.reload();
                                    }
                                });
                                UIDebug.log("Error: Login failed!");
                                cc.error("Login failed");
                            } else {
                                localStorage.setItem("gof-access-token", response.payload.accessToken);
                                self.whenLoggedIn(client);
                            }
                        });
                    } else {
                        self.whenLoggedIn(client);
                    }
                });
            },
            start: function start() {
                null != UIDebug.instance && (UIDebug.instance.node.active = game.isDebug);
            },
            whenLoggedIn: function whenLoggedIn(client) {
                game.api = client;
                game.pullDatabase();
            }
        });
        cc._RF.pop();
    }, {
        "./ApiClient": "ApiClient",
        "./Game": "Game",
        "./UI/UIDebug": "UIDebug",
        "./UI/UIEnv": "UIEnv",
        LanguageData: "LanguageData"
    } ],
    UIBottom: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "de0fchZ+G5HMJdsv+K9r07U", "UIBottom");
        "use strict";
        var i18n = require("LanguageData");
        var UIEnv = require("./UIEnv");
        var UIMessage = require("./UIMessage");
        var UIBottom = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIBottom"
            },
            properties: {},
            onLoad: function onLoad() {},
            onBtQuit: function onBtQuit() {
                UIEnv.message.show(i18n.t("exit_confirmation"), void 0, {
                    buttons: "yes_no",
                    onOk: function onOk() {
                        location.pathname = "/dashboard";
                    }
                });
            }
        });
        cc._RF.pop();
    }, {
        "./UIEnv": "UIEnv",
        "./UIMessage": "UIMessage",
        LanguageData: "LanguageData"
    } ],
    UICheat: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "ee4e2PdBRtJFKhTZAymanIB", "UICheat");
        "use strict";
        var CGame = require("../Game");
        var UIDebug = require("./UIDebug");
        var SharedConsts = require("../common/constants");
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
                game.isDebug && cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            },
            onDestroy: function onDestroy() {
                game.isDebug && cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            },
            onKeyDown: function onKeyDown(event) {
                switch (event.keyCode) {
                  case cc.KEY.c:
                    this.bgPopup.active ^= true;
                    break;

                  case cc.KEY.escape:
                    this.onBtClose();
                }
            },
            onBtRandomRotation: function onBtRandomRotation() {
                if (game.farm.parcels.length > 0) {
                    for (var k = 0; k < game.farm.parcels.length; k++) {
                        var parcel = game.farm.parcels[k];
                        if (0 === parcel.rotationPrevision.length) {
                            var id = Math.floor(cc.random0To1() * game.plants.length);
                            id == game.plants.length && id--;
                            var plant = game.plants[id];
                            var culture = SharedConsts.CultureModeEnum.NORMAL;
                            id = Math.floor(3 * cc.random0To1());
                            1 == id && (culture = SharedConsts.CultureModeEnum.BIO);
                            2 == id && (culture = SharedConsts.CultureModeEnum.REASONED);
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
                        parcel.rotationPrevision.length > 0 && (parcel.rotationPrevision = []);
                    }
                }
                this.onBtClose();
            },
            onBtClose: function onBtClose() {
                this.bgPopup.active = false;
            }
        });
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "../common/constants": "constants",
        "./UIDebug": "UIDebug"
    } ],
    UIDebug: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "18ea2AjTFtAb7SJWmEwfDmn", "UIDebug");
        "use strict";
        var UIDebug = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIDebug"
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
                    UIDebug._log.length > 12 && UIDebug._log.pop();
                },
                touchLog: ""
            },
            onLoad: function onLoad() {
                null != UIDebug.instance && cc.error("UIDebug instance already loaded");
                UIDebug.instance = this;
                this.debugLabel.string = "";
                this.touchLabel.string = "";
            },
            start: function start(err) {},
            update: function update(dt) {
                if (null != this.debugLabel) {
                    this.debugLabel.string = "";
                    for (var i = 0; i < UIDebug._log.length; i++) {
                        this.debugLabel.string += UIDebug._log[i] + "\n";
                    }
                }
                if (null != this.touchLabel) {
                    this.touchLabel.string = UIDebug.touchLog;
                    if (null != this.mapScrollView) {
                        this.touchLabel.string += " scrollOffset=" + this.mapScrollView.getScrollOffset();
                        this.touchLabel.string += " zoom=" + this.mapScrollView.content.scaleX;
                    }
                }
            }
        });
        module.exports = UIDebug;
        cc._RF.pop();
    }, {} ],
    UIEnv: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "6d70dhzfZNFH7Qp5lDKoDB3", "UIEnv");
        "use strict";
        var UIEnv = {
            message: null,
            office: null,
            parcel: null,
            speciesSelect: null,
            speciesInfos: null,
            questInfo: null,
            questMenu: null,
            score: null,
            score_croprotation: null,
            questIntro: null
        };
        module.exports = UIEnv;
        cc._RF.pop();
    }, {} ],
    UIMessage: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "d4cf2XJ/iVOPJMeqHGyaeP+", "UIMessage");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var UIEnv = require("./UIEnv");
        var i18n = require("LanguageData");
        var UIMessage = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIMessage"
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
                    buttons: "yes_no"
                },
                OK_CANCEL: {
                    buttons: "ok_cancel"
                }
            },
            _messagesOptions: null,
            onLoad: function onLoad() {
                UIEnv.message = this;
                this.initPopup();
                this._lbOk = this.btOk.node.getComponentInChildren(cc.Label);
                this._lbYes = this.btYes.node.getComponentInChildren(cc.Label);
                this._lbNo = this.btNo.node.getComponentInChildren(cc.Label);
                this._lbOk.string = i18n.t("ok").toUpperCase();
            },
            show: function show(_Text, _Title, _Options) {
                void 0 !== _Title && null !== _Title && "" != _Title || (_Title = i18n.t("message").toUpperCase());
                var lines = _Text.split("\n");
                if (lines.length > 4) {
                    this.lbMessage.fontSize = 20;
                    this.lbMessage.lineHeigth = 22;
                } else {
                    this.lbMessage.fontSize = 30;
                    this.lbMessage.lineHeigth = 36;
                }
                this.lbMessage.string = _Text;
                this.lbTitle.string = _Title;
                this._messagesOptions = void 0 != _Options ? _Options : null;
                this.bgLock.active = true;
                if (null != this._messagesOptions) {
                    this.btOk.node.active = void 0 == this._messagesOptions.buttons || "ok" == this._messagesOptions.buttons;
                    this.btYes.node.active = "yes_no" == this._messagesOptions.buttons || "ok_cancel" == this._messagesOptions.buttons;
                    this.btNo.node.active = this.btYes.node.active;
                    this._lbYes.string = "yes_no" == this._messagesOptions.buttons ? i18n.t("yes").toUpperCase() : i18n.t("ok").toUpperCase();
                    this._lbNo.string = "yes_no" == this._messagesOptions.buttons ? i18n.t("no").toUpperCase() : i18n.t("cancel").toUpperCase();
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
            onBtOk: function onBtOk() {
                void 0 !== this._messagesOptions.onOk && this._messagesOptions.onOk(this._messagesOptions.self);
                this.hide();
            },
            onBtYes: function onBtYes() {
                void 0 !== this._messagesOptions.onOk && this._messagesOptions.onOk(this._messagesOptions.self);
                this.hide();
            },
            onBtNo: function onBtNo() {
                void 0 !== this._messagesOptions.onCancel && this._messagesOptions.onCancel(this._messagesOptions.self);
                this.hide();
            }
        });
        module.exports = UIMessage;
        cc._RF.pop();
    }, {
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        LanguageData: "LanguageData"
    } ],
    UIOffice: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "6a190mC+6ZOA5vlgY1st6XK", "UIOffice");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var CGame = require("../Game");
        var UIEnv = require("./UIEnv");
        var i18n = require("LanguageData");
        var UIOffice = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIOffice"
            },
            properties: {
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
                void 0 === name && (name = i18n.t("farm_default_name").toUpperCase());
                this.farmName.string = name;
                this.totalSurface.string = i18n.t("surface_hectare", {
                    val: game.farm.totalSurface
                });
                this.nbParcels.string = game.farm.parcels.length.toString();
            },
            onBtClose: function onBtClose() {
                this.hide();
            }
        });
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        LanguageData: "LanguageData"
    } ],
    UIOutputInfoItem: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "025cdYdq1ZFiISVot7vqD8s", "UIOutputInfoItem");
        "use strict";
        var i18n = require("LanguageData");
        var UIOutputInfoItem = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIOutputInfoItem"
            },
            properties: {
                Name: {
                    default: null,
                    type: cc.Label
                },
                UnitQuantity: {
                    default: null,
                    type: cc.Label
                },
                ParcelQuantity: {
                    default: null,
                    type: cc.Label
                }
            },
            onLoad: function onLoad() {},
            init: function init(parcel, output) {
                this.Name.string = i18n.t("output_" + output.name).toUpperCase();
                var unitQt = Number(output.quantityPerSizeUnit);
                var parcelQt = unitQt * parcel.surface;
                var tid = "quantity_quintal";
                "t" == output.unitPerSizeUnit && (tid = "quantity_ton");
                this.UnitQuantity.string = i18n.t(tid, {
                    val: unitQt.toLocaleString(void 0, {
                        maximumFractionDigits: 2
                    })
                });
                this.ParcelQuantity.string = i18n.t(tid, {
                    val: parcelQt.toLocaleString(void 0, {
                        maximumFractionDigits: 2
                    })
                });
            }
        });
        module.exports = UIOutputInfoItem;
        cc._RF.pop();
    }, {
        LanguageData: "LanguageData"
    } ],
    UIParcelButton: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "1eeb4QRRqVC67SdkLrVyELP", "UIParcelButton");
        "use strict";
        var CParcel = require("../Parcel");
        var UIParcel = require("./UIParcel");
        var RscPreload = require("../RscPreload");
        cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIParcelButton"
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
                parcel: {
                    visible: false,
                    get: function get() {
                        return this._parcel;
                    },
                    set: function set(_value) {
                        this._parcel = _value;
                        null != this._parcel && null != this.parcelName && (this.parcelName.string = this._parcel.name);
                    },
                    type: CParcel
                }
            },
            _parcel: null,
            _species: null,
            onLoad: function onLoad() {
                this.parcelSpecies.node.active = false;
            },
            update: function update(dt) {
                if (null != this._parcel) {
                    var species = null;
                    this._parcel.rotationPrevision.length > 0 && (species = this._parcel.rotationPrevision[0].species);
                    if (species != this._species) {
                        if (null != species) {
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
    }, {
        "../Parcel": "Parcel",
        "../RscPreload": "RscPreload",
        "./UIParcel": "UIParcel"
    } ],
    UIParcelHistoryItem: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "e26d4zHk5xHfoZ0d5p3J3O6", "UIParcelHistoryItem");
        "use strict";
        var i18n = require("LanguageData");
        var CGame = require("../Game");
        var CParcel = require("../Parcel");
        var CPlant = require("../Plant");
        var RscPreload = require("../RscPreload");
        var UIEnv = require("./UIEnv");
        var SharedConsts = require("../common/constants");
        var game = new CGame();
        var UIParcelHistoryItem = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIParcelHistoryItem"
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
                btInfo: {
                    default: null,
                    type: cc.Button
                },
                parcel: {
                    default: null,
                    visible: false,
                    type: CParcel
                },
                year: {
                    default: 0,
                    visible: false
                },
                plant: {
                    default: null,
                    visible: false,
                    type: CPlant
                },
                cultureMode: {
                    default: null,
                    visible: false
                }
            },
            onLoad: function onLoad() {},
            initCulture: function initCulture(_Parcel, _Year, _Data, _CanEdit) {
                this.parcel = _Parcel;
                this.year = _Year;
                this.plant = null;
                this.cultureMode = null;
                if (_Year) {
                    var y;
                    y = _Year < 0 ? _Year.toString() : "+" + _Year.toString();
                    this.lbYear.string = y;
                } else {
                    this.lbYear.string = "";
                }
                if (void 0 === _Data || null === _Data) {
                    this.lbSpecies.string = i18n.t("new").toUpperCase();
                    this.lbCulture.string = "";
                    this.iconSpecies.node.active = false;
                    this.btAdd.node.active = true;
                    this.btEdit.node.active = false;
                    this.btInfo.node.active = false;
                } else if (_Data.species.indexOf("fallow") >= 0 || "pasture" === _Data.species) {
                    this.lbSpecies.string = i18n.t("plant_" + _Data.species).toUpperCase();
                    this.lbCulture.string = "";
                    this.iconSpecies.node.active = true;
                    this.iconSpecies.spriteFrame = RscPreload.getPlantIcon(_Data.species);
                    this.btAdd.node.active = false;
                    this.btEdit.node.active = _CanEdit;
                    this.btInfo.node.active = false;
                } else {
                    this.cultureMode = _Data.culture;
                    this.plant = game.findPlant(_Data.species);
                    this.lbSpecies.string = i18n.t("plant_" + _Data.species).toUpperCase();
                    void 0 !== _Data.culture ? this.lbCulture.string = i18n.t("culture_" + _Data.culture).toUpperCase() : this.lbCulture.string = i18n.t("culture_normal").toUpperCase();
                    this.iconSpecies.node.active = true;
                    this.iconSpecies.spriteFrame = RscPreload.getPlantIcon(_Data.species);
                    this.btAdd.node.active = false;
                    this.btEdit.node.active = _CanEdit;
                    if (this.plant && _CanEdit) {
                        this.btInfo.node.active = true;
                        this.btInfo.interactable = void 0 !== this.plant.getItk(this.cultureMode);
                    } else {
                        this.btInfo.node.active = false;
                    }
                }
            },
            onBtAdd: function onBtAdd() {
                UIEnv.speciesSelect.show(this.parcel, this.year);
            },
            onBtInfo: function onBtInfo() {
                UIEnv.speciesInfos.show(this.parcel, this.plant, this.cultureMode);
            }
        });
        module.exports = UIParcelHistoryItem;
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "../Parcel": "Parcel",
        "../Plant": "Plant",
        "../RscPreload": "RscPreload",
        "../common/constants": "constants",
        "./UIEnv": "UIEnv",
        LanguageData: "LanguageData"
    } ],
    UIParcel: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "5ed45J19xFADpo251R2d6oz", "UIParcel");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var CParcel = require("../Parcel");
        var UIParcelHistoryItem = require("./UIParcelHistoryItem");
        var CGame = require("../Game");
        var UIEnv = require("./UIEnv");
        var i18n = require("LanguageData");
        var game = new CGame();
        var UIParcel = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIParcel"
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
                parcel: {
                    visible: false,
                    get: function get() {
                        return this._parcel;
                    },
                    set: function set(_value) {
                        this._parcel = _value;
                        null != this._parcel && null != this.parcelName;
                        this._hidden || this.onShow();
                    },
                    type: CParcel
                }
            },
            statics: {
                instance: null
            },
            _parcel: null,
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
                var histContent = this.historyScrollView.content;
                histContent.removeAllChildren(true);
                var prevContent = this.previsionScrollView.content;
                prevContent.removeAllChildren(true);
                if (null != this._parcel) {
                    this.parcelName.string = this._parcel.name;
                    this.parcelGroundType.string = i18n.t("terrain_type_clay").toUpperCase();
                    this.parcelSurface.string = i18n.t("surface_hectare", {
                        val: this._parcel.surface.toString()
                    });
                    for (var i = this._parcel.rotationHistory.length - 1; i >= 0; i--) {
                        var hPrefab = cc.instantiate(this.plantPrefab);
                        hPrefab.setParent(histContent);
                        var h = hPrefab.getComponent(UIParcelHistoryItem);
                        h.initCulture(this._parcel, -(i + 1), this._parcel.rotationHistory[i], false);
                    }
                    this.updateRotationPrevisions();
                    this.historyScrollView.scrollToRight();
                    this.previsionScrollView.scrollToLeft();
                }
            },
            updateRotationPrevisions: function updateRotationPrevisions() {
                var prevContent = this.previsionScrollView.content;
                prevContent.removeAllChildren(true);
                for (var i = 0; i < this._parcel.rotationPrevision.length; i++) {
                    var hPrefab = cc.instantiate(this.plantPrefab);
                    hPrefab.setParent(prevContent);
                    var h = hPrefab.getComponent(UIParcelHistoryItem);
                    h.initCulture(this._parcel, i, this._parcel.rotationPrevision[i], true);
                }
                this.addEmptyPrevision();
            },
            addEmptyPrevision: function addEmptyPrevision() {
                if (null != game.phase && this._parcel.rotationPrevision.length < game.phase.maxPrevisions) {
                    var hPrefab = cc.instantiate(this.plantPrefab);
                    hPrefab.setParent(this.previsionScrollView.content);
                    var h = hPrefab.getComponent(UIParcelHistoryItem);
                    h.initCulture(this._parcel, this._parcel.rotationPrevision.length);
                }
            },
            onBtClose: function onBtClose() {
                this.hide();
            }
        });
        module.exports = UIParcel;
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "../Parcel": "Parcel",
        "./UIEnv": "UIEnv",
        "./UIParcelHistoryItem": "UIParcelHistoryItem",
        "./UIPopupBase": "UIPopupBase",
        LanguageData: "LanguageData"
    } ],
    UIPopupBase: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "26b02/CIaZOIqLKQKleyE5X", "UIPopupBase");
        "use strict";
        var FromMode = cc.Enum({
            LEFT: 0,
            RIGHT: 1,
            TOP: 2,
            BOTTOM: 3,
            NONE: 4
        });
        var UIPopupBase = cc.Class({
            extends: cc.Component,
            properties: {
                Popup: {
                    default: null,
                    type: cc.Node
                },
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
            initPopup: function initPopup() {
                null == this.Popup && (this.Popup = this.node);
                this._hidden = false;
                this._defaultX = this.Popup.x;
                this._defaultY = this.Popup.y;
                this._size = this.Popup.getContentSize();
                this.hide(true);
            },
            showPopup: function showPopup() {
                if (this._hidden) {
                    this.Popup.stopAllActions();
                    this.Popup.active || (this.Popup.active = true);
                    this.From != FromMode.NONE && this.Popup.runAction(cc.moveTo(.2, cc.p(this._defaultX, this._defaultY)));
                    this._hidden = false;
                    void 0 !== this.onShow && this.onShow();
                }
            },
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
                            cc.error("Invalid from value: " + this.From);
                            to.x = -cvw;
                        }
                        if (instant) {
                            this.Popup.x = to.x;
                            this.Popup.y = to.y;
                        } else {
                            this.Popup.runAction(cc.moveTo(.2, to));
                        }
                    } else {
                        this.Popup.active = false;
                    }
                    this._hidden = true;
                    void 0 !== this.onHide && this.onHide();
                }
            },
            show: function show() {
                this.showPopup();
            },
            hide: function hide() {
                var instant = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                this.hidePopup(instant);
            }
        });
        cc._RF.pop();
    }, {} ],
    UIQuestInfo: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "fe209aGUCRMrqhIU/Rt+APS", "UIQuestInfo");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var UIEnv = require("./UIEnv");
        var CGame = require("../Game");
        var game = new CGame();
        var UIQuestInfo = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIQuestInfo"
            },
            properties: {
                lbDescription: {
                    default: null,
                    type: cc.Label
                },
                lbCompletion: {
                    default: null,
                    type: cc.Label
                },
                btValidate: {
                    default: null,
                    type: cc.Button
                }
            },
            statics: {
                instance: null
            },
            onLoad: function onLoad() {
                UIQuestInfo.instance = this;
                UIEnv.questInfo = this;
                this.initPopup();
            },
            onShow: function onShow() {
                if (null != game.phase) {
                    this.lbDescription.string = game.phaseGetObjectiveText();
                    this.lbCompletion.string = game.phaseGetCompletionStr();
                    this.btValidate.interactable = game.phaseCanFinish();
                }
            },
            onBtValidate: function onBtValidate() {
                if (game.phaseCanFinish()) {
                    var score = 0;
                    var scorePart = game.phase.perfectScore / game.farm.parcels.length;
                    var results = [];
                    for (var i = 0; i < game.farm.parcels.length; ++i) {
                        var parcel = game.farm.parcels[i];
                        var solution = parcel.solution;
                        var playerChoice = parcel.rotationPrevision[0];
                        var result = {
                            parcelName: parcel.name,
                            note: 4,
                            choice: playerChoice
                        };
                        if (solution.perfects.indexOf(playerChoice.species) > -1) {
                            result.note = 1;
                            score += scorePart;
                        } else if (solution.acceptables.indexOf(playerChoice.species) > -1) {
                            result.note = 2;
                            score += .8 * scorePart;
                        } else if (solution.bads.indexOf(playerChoice.species) > -1) {
                            result.note = 3;
                            score -= .4 * scorePart;
                        }
                        results.push(result);
                    }
                    score = Math.round(score);
                    var normalizedScore = score / game.phase.perfectScore;
                    normalizedScore > 1 && (normalizedScore = 1);
                    UIEnv.score_croprotation.setResults(results);
                    UIEnv.score_croprotation.setScoreText(Math.round(20 * normalizedScore) + " / 20");
                    UIEnv.score_croprotation.show();
                    game.phaseFinish(normalizedScore, results);
                }
            },
            onBtClose: function onBtClose() {
                this.hide();
            }
        });
        module.exports = UIQuestInfo;
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase"
    } ],
    UIQuestIntro: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "a2ec7ttv5JG+pgS8fICxmUc", "UIQuestIntro");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var UIEnv = require("./UIEnv");
        var CGame = require("../Game");
        var game = new CGame();
        var UIQuestIntro = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIQuestIntro"
            },
            properties: {
                bgLock: {
                    default: null,
                    type: cc.Node
                },
                popup: {
                    default: null,
                    type: cc.Node
                },
                lbDescription: {
                    default: null,
                    type: cc.Label
                },
                _hidden: {
                    default: true,
                    visible: false
                }
            },
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
                null != game.phase && (this.lbDescription.string = game.phaseGetIntroText());
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
            hidePopup: function hidePopup(instant) {
                if (!this._hidden) {
                    this.popup.stopAllActions();
                    var cvw = cc.Canvas.instance.node.width;
                    var cvh = cc.Canvas.instance.node.height;
                    var to = new cc.Vec2(this._defaultX, this._defaultY);
                    to.y = cvh;
                    if (instant) {
                        this.popup.x = to.x;
                        this.popup.y = to.y;
                    } else {
                        this.popup.runAction(cc.moveTo(.2, to));
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
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase"
    } ],
    UIQuestMenu: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "7d7c3/wn7ZCuLYYti4yjtS7", "UIQuestMenu");
        "use strict";
        var CGame = require("../Game");
        var UIEnv = require("./UIEnv");
        var game = new CGame();
        var UIQuestMenu = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UIQuestMenu"
            },
            properties: {
                btOpen: {
                    default: null,
                    type: cc.Button
                },
                highlight: {
                    default: null,
                    type: cc.Node
                },
                _hlAnim: {
                    default: null,
                    type: cc.Animation,
                    visible: false
                },
                fxParticles: {
                    default: null,
                    type: cc.ParticleSystem
                },
                _isAnimated: {
                    default: false,
                    visible: false
                },
                progressBar: {
                    default: null,
                    type: cc.ProgressBar
                },
                progressLabel: {
                    default: null,
                    type: cc.Label
                },
                _completion: {
                    default: ""
                }
            },
            onLoad: function onLoad() {
                UIEnv.questMenu = this;
                this._hlAnim = this.highlight.getComponent(cc.Animation);
                this.highlight.active = false;
                this.fxParticles.stopSystem();
                this._isAnimated = false;
                this.btOpen.interactable = false;
                this.progressBar.progress = 0;
                this.progressLabel.string = "0%";
            },
            update: function update(dt) {
                if (game.state < CGame.State.PHASE_RUN) {
                    return;
                }
                this.btOpen.interactable = game.state < CGame.State.PHASE_SCORE && null != UIEnv.questInfo && !UIEnv.questInfo.isShown;
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
                var completion = game.phaseGetCompletionStr();
                if (completion != this._completion) {
                    this._completion = completion;
                    try {
                        var compType = completion.indexOf("%");
                        if (compType > 0) {
                            this.progressLabel.string = completion;
                            completion = completion.substring(0, compType);
                            this.progressBar.progress = Number(completion) / 100;
                        } else {
                            compType = completion.indexOf("/");
                            if (compType > 0) {
                                var numberPattern = /\d+/g;
                                var compParts = completion.match(numberPattern);
                                this.progressBar.progress = Number(compParts[0]) / Number(compParts[1]);
                                this.progressLabel.string = (100 * this.progressBar.progress).toLocaleString(void 0, {
                                    maximumFractionDigits: 0
                                }) + "%";
                            } else {
                                this.progressBar.progress = Number(completion);
                                this.progressLabel.string = (100 * this.progressBar.progress).toLocaleString(void 0, {
                                    maximumFractionDigits: 0
                                }) + "%";
                            }
                        }
                    } catch (_e) {
                        this.progressLabel.string = completion;
                        this.progressBar.progress = 0;
                    }
                }
            },
            onBtOpen: function onBtOpen() {
                UIEnv.questInfo.show();
            }
        });
        module.exports = UIQuestMenu;
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv"
    } ],
    UIScore_croprotation: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "b6098hR08JLhqWX764cWMcE", "UIScore_croprotation");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var CGame = require("../Game");
        var RscPreload = require("RscPreload");
        var UIEnv = require("./UIEnv");
        var i18n = require("LanguageData");
        var game = new CGame();
        var UIScore_croprotation = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIScore_croprotation"
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
                    lbl && (lbl.string = result.parcelName);
                    var icon = prefab.getChildByName("icon_note").getComponent(cc.Sprite);
                    icon && (icon.spriteFrame = RscPreload.instance.noteIconsAtlas.getSpriteFrame("note" + result.note));
                    prefab.setParent(content);
                }
            },
            setScoreText: function setScoreText(_text) {
                this.scoreText.string = _text;
            },
            update: function update(dt) {},
            onBtNext: function onBtNext() {
                location.pathname = "/dashboard";
                this.hide();
            }
        });
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        LanguageData: "LanguageData",
        RscPreload: "RscPreload"
    } ],
    UIScore: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "3ac5eIDVhJJ/ofpayCfR0NL", "UIScore");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var CGame = require("../Game");
        var UIEnv = require("./UIEnv");
        var i18n = require("LanguageData");
        var game = new CGame();
        var UIScore = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UIScore"
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
            onLoad: function onLoad() {
                UIScore.instance = this;
                UIEnv.score = this;
                this.initPopup();
                this.spider = this.drawingZone.addComponent(cc.Graphics);
            },
            show: function show() {
                UIEnv.parcel.hide();
                UIEnv.speciesSelect.hide();
                UIEnv.questInfo.hide();
                this.showPopup();
            },
            onShow: function onShow() {},
            setScore: function setScore(_financial, _rule, _quality, _ecological, _human, _text) {
                this.scoreText.string = _text;
                var g = this.spider;
                var center = new cc.Vec2(-151, -66);
                var directions = [ new cc.Vec2(0, 1), new cc.Vec2(150, 42), new cc.Vec2(84, -124), new cc.Vec2(-84, -124), new cc.Vec2(-150, 42) ];
                for (var i = 0; i < directions.length; ++i) {
                    directions[i] = directions[i].normalize();
                }
                var score = [ _financial, _rule, _quality, _ecological, _human ];
                g.clear();
                g.fillColor = new cc.Color(167, 247, 192, 160);
                g.strokeColor = new cc.Color(142, 162, 105, 160);
                g.lineWidth = 6;
                var start = null;
                for (var i = 0; i < directions.length; ++i) {
                    var d = directions[i];
                    var l = d.mul(160 * score[i]);
                    var p = center.add(l);
                    if (i) {
                        g.lineTo(p.x, p.y);
                    } else {
                        g.moveTo(p.x, p.y);
                        start = p;
                    }
                }
                g.lineTo(start.x, start.y);
                g.stroke();
                g.fill();
                this.drawingZone.opacity = 127;
            },
            update: function update(dt) {},
            onBtNext: function onBtNext() {
                this.hide();
            }
        });
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        LanguageData: "LanguageData"
    } ],
    UISpeciesInfosItem: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "fa349e/AsdHB4Nusn32H6u7", "UISpeciesInfosItem");
        "use strict";
        var i18n = require("LanguageData");
        var UISpeciesInfosItem = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UISpeciesInfosItem"
            },
            properties: {
                procedureIndex: {
                    default: null,
                    type: cc.Label
                },
                procedureName: {
                    default: null,
                    type: cc.Label
                },
                procedureUnitPrice: {
                    default: null,
                    type: cc.Label
                },
                procedureUnitDuration: {
                    default: null,
                    type: cc.Label
                }
            },
            onLoad: function onLoad() {},
            init: function init(parcel, procedure, index) {
                this.procedureIndex.string = index.toString();
                this.procedureName.string = i18n.t("procedure_" + procedure.name).toUpperCase();
                0 != procedure.unitCosts.money ? this.procedureUnitPrice.string = i18n.t("money_unit", {
                    val: procedure.unitCosts.money.toLocaleString(void 0, {
                        maximumFractionDigits: 2
                    })
                }) : this.procedureUnitPrice.string = "--";
                this.procedureUnitDuration.string = i18n.t("duration_unit", {
                    val: procedure.unitCosts.time.toLocaleString(void 0, {
                        maximumFractionDigits: 2
                    })
                });
            }
        });
        module.exports = UISpeciesInfosItem;
        cc._RF.pop();
    }, {
        LanguageData: "LanguageData"
    } ],
    UISpeciesInfosPopup: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "ee618Ep861Jg7U/fhom6yXR", "UISpeciesInfosPopup");
        "use strict";
        var i18n = require("LanguageData");
        var UIPopupBase = require("./UIPopupBase");
        var CGame = require("../Game");
        var UISpeciesInfosItem = require("./UISpeciesInfosItem");
        var UIEnv = require("./UIEnv");
        var SharedConsts = require("../common/constants");
        var RscPreload = require("RscPreload");
        var game = new CGame();
        var UISpeciesInfosPopup = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UISpeciesInfosPopup"
            },
            properties: {
                itemPrefab: {
                    default: null,
                    type: cc.Prefab
                },
                scrollView: {
                    default: null,
                    type: cc.ScrollView
                },
                title: {
                    default: null,
                    type: cc.Label
                },
                speciesIcon: {
                    default: null,
                    type: cc.Sprite
                },
                speciesName: {
                    default: null,
                    type: cc.Label
                },
                btNormal: {
                    default: null,
                    type: cc.Button
                },
                btBio: {
                    default: null,
                    type: cc.Button
                },
                btReasoned: {
                    default: null,
                    type: cc.Button
                },
                totalPrice: {
                    default: null,
                    type: cc.Label
                },
                totalSell: {
                    default: null,
                    type: cc.Label
                },
                totalProfit: {
                    default: null,
                    type: cc.Label
                },
                hectarePrice: {
                    default: null,
                    type: cc.Label
                },
                hectareSell: {
                    default: null,
                    type: cc.Label
                },
                hectareProfit: {
                    default: null,
                    type: cc.Label
                },
                outputPanel: {
                    default: null,
                    type: cc.Node
                },
                ouputPrefab: {
                    default: null,
                    type: cc.Prefab
                },
                ouputScrollView: {
                    default: null,
                    type: cc.ScrollView
                },
                _parcel: {
                    default: null,
                    visible: false
                },
                _plant: {
                    default: null,
                    visible: false
                },
                _mode: {
                    default: null,
                    visible: false
                }
            },
            statics: {
                instance: null
            },
            onLoad: function onLoad() {
                null != UISpeciesInfosPopup.instance && cc.error("An instance of UISpeciesInfosPopup already exists");
                UISpeciesInfosPopup.instance = this;
                UIEnv.speciesInfos = this;
                this.initPopup();
            },
            show: function show(_Parcel, _Plant, _Mode) {
                this._parcel = _Parcel;
                this._plant = _Plant;
                this._mode = _Mode;
                this.speciesName.string = i18n.t("plant_" + this._plant.species).toUpperCase();
                this.speciesIcon.spriteFrame = RscPreload.getPlantIcon(this._plant.species);
                this.title.string = i18n.t("activity_infos_title") + "\n" + this._parcel.name + " (" + i18n.t("surface_hectare", {
                    val: this._parcel.surface.toLocaleString(void 0, {
                        maximumFractionDigits: 2
                    })
                }) + ")";
                this.outputPanel.active = false;
                this.showPopup();
            },
            onShow: function onShow() {
                var content = this.scrollView.content;
                content.removeAllChildren(true);
                var outputContent = this.ouputScrollView.content;
                outputContent.removeAllChildren(true);
                var itk = this._plant.getItk(this._mode);
                if (itk && itk.procedures) {
                    this.hectarePrice.string = i18n.t("money_unit", {
                        val: itk.unitCosts.money.toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    this.hectareSell.string = i18n.t("money_unit", {
                        val: itk.unitResults.money.toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    this.hectareProfit.string = i18n.t("money_unit", {
                        val: (itk.unitResults.money - itk.unitCosts.money).toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    this.totalPrice.string = i18n.t("money_unit", {
                        val: (itk.unitCosts.money * this._parcel.surface).toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    this.totalSell.string = i18n.t("money_unit", {
                        val: (itk.unitResults.money * this._parcel.surface).toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    this.totalProfit.string = i18n.t("money_unit", {
                        val: ((itk.unitResults.money - itk.unitCosts.money) * this._parcel.surface).toLocaleString(void 0, {
                            maximumFractionDigits: 2
                        })
                    });
                    for (var procId = 0; procId < itk.procedures.length; procId++) {
                        var procedure = itk.procedures[procId];
                        var prefab = cc.instantiate(this.itemPrefab);
                        prefab.setParent(content);
                        var s = prefab.getComponent("UISpeciesInfosItem");
                        s.init(this._parcel, procedure, procId + 1);
                    }
                    var outputs = this._plant.getOutputs(this._mode);
                    for (var oi = 0; oi < outputs.length; oi++) {
                        var output = outputs[oi];
                        var prefab = cc.instantiate(this.ouputPrefab);
                        prefab.setParent(outputContent);
                        var s = prefab.getComponent("UIOutputInfoItem");
                        s.init(this._parcel, output);
                    }
                } else {
                    this.hectarePrice.string = "";
                    this.hectareSell.string = "";
                    this.hectareProfit.string = "";
                    this.totalPrice.string = "";
                    this.totalSell.string = "";
                    this.totalProfit.string = "";
                }
                this.btNormal.interactable = this._mode != SharedConsts.CultureModeEnum.NORMAL;
                this.btBio.interactable = this._mode != SharedConsts.CultureModeEnum.BIO;
                this.btReasoned.interactable = this._mode != SharedConsts.CultureModeEnum.REASONED;
                this.scrollView.scrollToTop();
            },
            onHide: function onHide() {},
            onBtNormal: function onBtNormal() {
                this._mode = SharedConsts.CultureModeEnum.NORMAL;
                this.onShow();
            },
            onBtBio: function onBtBio() {
                this._mode = SharedConsts.CultureModeEnum.BIO;
                this.onShow();
            },
            onBtReasoned: function onBtReasoned() {
                this._mode = SharedConsts.CultureModeEnum.REASONED;
                this.onShow();
            },
            onBtDetails: function onBtDetails() {
                this.outputPanel.active = !this.outputPanel.active;
            }
        });
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "../common/constants": "constants",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        "./UISpeciesInfosItem": "UISpeciesInfosItem",
        LanguageData: "LanguageData",
        RscPreload: "RscPreload"
    } ],
    UISpeciesSelItem: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "aaef9bEqX5BcJFGX/hbg8UC", "UISpeciesSelItem");
        "use strict";
        var i18n = require("LanguageData");
        var CPlant = require("Plant");
        var RscPreload = require("RscPreload");
        var SharedConsts = require("../common/constants");
        var UIEnv = require("./UIEnv");
        var UISpeciesSelItem = cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UISpeciesSelItem"
            },
            properties: {
                speciesName: {
                    default: null,
                    type: cc.Label
                },
                speciesVariety: {
                    default: null,
                    type: cc.Label
                },
                speciesIcon: {
                    default: null,
                    type: cc.Sprite
                },
                buyPriceNormal: {
                    default: null,
                    type: cc.Label
                },
                sellPriceNormal: {
                    default: null,
                    type: cc.Label
                },
                btNormal: {
                    default: null,
                    type: cc.Button
                },
                buyPriceBio: {
                    default: null,
                    type: cc.Label
                },
                sellPriceBio: {
                    default: null,
                    type: cc.Label
                },
                btBio: {
                    default: null,
                    type: cc.Button
                },
                buyPriceReasoned: {
                    default: null,
                    type: cc.Label
                },
                sellPriceReasoned: {
                    default: null,
                    type: cc.Label
                },
                btReasoned: {
                    default: null,
                    type: cc.Button
                },
                btAdd: {
                    default: null,
                    type: cc.Button
                },
                btInfo: {
                    default: null,
                    type: cc.Button
                },
                hlSelected: {
                    default: null,
                    type: cc.Node
                },
                isSelected: {
                    visible: false,
                    get: function get() {
                        return this._isSelected;
                    },
                    set: function set(val) {
                        if (this._isSelected !== val) {
                            this._isSelected = val;
                            val && null !== this.selectionCallback && this.selectionCallback(this);
                            this._selectionChanged = true;
                        }
                    }
                },
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
                selectionCallback: {
                    visible: false,
                    default: null,
                    type: Object
                },
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
            onLoad: function onLoad() {
                this.speciesVariety.string = "";
                this.hlSelected.active = false;
            },
            updateUI: function updateUI() {
                if (null != this._plant) {
                    if (this._plantChanged) {
                        this.speciesName.string = i18n.t("plant_" + this._plant.species).toUpperCase();
                        this.speciesIcon.spriteFrame = RscPreload.getPlantIcon(this._plant.species);
                        this._plantChanged = false;
                        this._selectionChanged = true;
                        this._cultureChanged = true;
                    }
                    if (this._cultureChanged) {
                        if (this._plant.isFallow) {
                            this.buyPriceNormal.string = "";
                            this.buyPriceBio.string = "";
                            this.buyPriceReasoned.string = "";
                            this.sellPriceNormal.string = "";
                            this.sellPriceBio.string = "";
                            this.sellPriceReasoned.string = "";
                            this.btNormal.node.active = false;
                            this.btBio.node.active = false;
                            this.btReasoned.node.active = false;
                        } else {
                            var itkNormal = this._plant.getItk(SharedConsts.CultureModeEnum.NORMAL);
                            if (itkNormal && itkNormal.unitCosts) {
                                this.buyPriceNormal.string = i18n.t("money_unit", {
                                    val: itkNormal.unitCosts.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceNormal.string = i18n.t("money_unit", {
                                    val: itkNormal.unitResults.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            } else {
                                this.buyPriceNormal.string = i18n.t("money_unit", {
                                    val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.NORMAL).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceNormal.string = i18n.t("money_unit", {
                                    val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.NORMAL).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            }
                            var itkBio = this._plant.getItk(SharedConsts.CultureModeEnum.BIO);
                            if (itkBio && itkBio.unitCosts) {
                                this.buyPriceBio.string = i18n.t("money_unit", {
                                    val: itkBio.unitCosts.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceBio.string = i18n.t("money_unit", {
                                    val: itkBio.unitResults.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            } else {
                                this.buyPriceBio.string = i18n.t("money_unit", {
                                    val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.BIO).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceBio.string = i18n.t("money_unit", {
                                    val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.BIO).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            }
                            var itkReasoned = this._plant.getItk(SharedConsts.CultureModeEnum.REASONED);
                            if (itkReasoned && itkReasoned.unitCosts) {
                                this.buyPriceReasoned.string = i18n.t("money_unit", {
                                    val: itkReasoned.unitCosts.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceReasoned.string = i18n.t("money_unit", {
                                    val: itkReasoned.unitResults.money.toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            } else {
                                this.buyPriceReasoned.string = i18n.t("money_unit", {
                                    val: this._plant.getBuyPrice(SharedConsts.CultureModeEnum.REASONED).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                                this.sellPriceReasoned.string = i18n.t("money_unit", {
                                    val: this._plant.getSellPrice(SharedConsts.CultureModeEnum.REASONED).toLocaleString(void 0, {
                                        maximumFractionDigits: 2
                                    })
                                });
                            }
                            this.btNormal.interactable = this.cultureMode != SharedConsts.CultureModeEnum.NORMAL;
                            this.btBio.interactable = this.cultureMode != SharedConsts.CultureModeEnum.BIO;
                            this.btReasoned.interactable = this.cultureMode != SharedConsts.CultureModeEnum.REASONED;
                        }
                    }
                    this._plant.getItk(SharedConsts.CultureModeEnum.NORMAL) ? this.btInfo.interactable = true : this.btInfo.interactable = false;
                    this._selectionChanged && (this.hlSelected.active = this._isSelected);
                }
            },
            update: function update(dt) {
                this.updateUI();
            },
            onBtCultureNormal: function onBtCultureNormal() {
                null == this._plant || this._plant.isFallow || (this.cultureMode = SharedConsts.CultureModeEnum.NORMAL);
            },
            onBtCultureBio: function onBtCultureBio() {
                null == this._plant || this._plant.isFallow || (this.cultureMode = SharedConsts.CultureModeEnum.BIO);
            },
            onBtCultureReasoned: function onBtCultureReasoned() {
                null == this._plant || this._plant.isFallow || (this.cultureMode = SharedConsts.CultureModeEnum.REASONED);
            },
            onBtCulturePerma: function onBtCulturePerma() {
                null == this._plant || this._plant.isFallow || (this.cultureMode = SharedConsts.CultureModeEnum.PERMACULTURE);
            },
            onBtAdd: function onBtAdd() {
                null != this._plant && null != this.validationCallback && this.validationCallback({
                    species: this._plant.species,
                    culture: this._cultureMode
                });
            },
            onBtInfo: function onBtInfo() {
                null != this._plant && UIEnv.speciesInfos.show(UIEnv.speciesSelect._parcel, this._plant, this._cultureMode);
            }
        });
        module.exports = UISpeciesSelItem;
        cc._RF.pop();
    }, {
        "../common/constants": "constants",
        "./UIEnv": "UIEnv",
        LanguageData: "LanguageData",
        Plant: "Plant",
        RscPreload: "RscPreload"
    } ],
    UISpeciesSelPopup: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "be3ddDBLZpLTbjtJ2jb+FZn", "UISpeciesSelPopup");
        "use strict";
        var UIPopupBase = require("./UIPopupBase");
        var CGame = require("../Game");
        var UISpeciesSelItem = require("./UISpeciesSelItem");
        var UIEnv = require("./UIEnv");
        var game = new CGame();
        var UISpeciesSelPopup = cc.Class({
            extends: UIPopupBase,
            editor: {
                menu: "gof/UISpeciesSelPopup"
            },
            properties: {
                itemPrefab: {
                    default: null,
                    type: cc.Prefab
                },
                scrollView: {
                    default: null,
                    type: cc.ScrollView
                },
                _parcel: {
                    default: null,
                    visible: false
                },
                _previsionYear: {
                    default: -1,
                    visible: false
                }
            },
            statics: {
                instance: null
            },
            onLoad: function onLoad() {
                null != UISpeciesSelPopup.instance && cc.error("An instance of UISpeciesSelPopup already exists");
                UISpeciesSelPopup.instance = this;
                UIEnv.speciesSelect = this;
                this.initPopup();
            },
            show: function show(_Parcel) {
                var _Year = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                this._parcel = _Parcel;
                this._previsionYear = _Year;
                this.showPopup();
            },
            onShow: function onShow() {
                var current = null;
                this._previsionYear >= 0 && this._previsionYear < this._parcel.rotationPrevision.length && (current = this._parcel.rotationPrevision[this._previsionYear]);
                var content = this.scrollView.content;
                content.removeAllChildren(true);
                for (var i = 0; i < game.plants.length; i++) {
                    if (game.farm.plantExcludes.indexOf(game.plants[i].species) > -1) {
                        continue;
                    }
                    var prefab = cc.instantiate(this.itemPrefab);
                    prefab.setParent(content);
                    var s = prefab.getComponent("UISpeciesSelItem");
                    s.plant = game.plants[i];
                    s.selectionCallback = this.onItemSelection;
                    s.validationCallback = this.onItemValidation;
                    if (null !== current && current.species == s.plant.species) {
                        current.culture && (s.cultureMode = current.culture);
                        s.isSelected = true;
                    }
                }
            },
            onHide: function onHide() {},
            onItemSelection: function onItemSelection(_Item) {
                var items = UISpeciesSelPopup.instance.scrollView.content.children;
                for (var i = 0; i < items.length; i++) {
                    var s = items[i].getComponent("UISpeciesSelItem");
                    s.isSelected && _Item.plant !== s.plant && (s.isSelected = false);
                }
            },
            onItemValidation: function onItemValidation(_Data) {
                var self = UISpeciesSelPopup.instance;
                self._previsionYear >= 0 && self._previsionYear < self._parcel.rotationPrevision.length ? self._parcel.rotationPrevision[self._previsionYear] = _Data : self._parcel.rotationPrevision.push(_Data);
                game.saveChannel();
                UIEnv.parcel.updateRotationPrevisions();
                self.hide();
            },
            onBtClose: function onBtClose() {
                this.hide();
            }
        });
        module.exports = UISpeciesSelPopup;
        cc._RF.pop();
    }, {
        "../Game": "Game",
        "./UIEnv": "UIEnv",
        "./UIPopupBase": "UIPopupBase",
        "./UISpeciesSelItem": "UISpeciesSelItem"
    } ],
    UITop: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "5d170x4gqNGn6wYSkUsy2s+", "UITop");
        "use strict";
        var _Game = require("Game");
        var _Game2 = _interopRequireDefault(_Game);
        var _Farm = require("Farm");
        var _Farm2 = _interopRequireDefault(_Farm);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var game = new _Game2.default();
        var i18n = require("LanguageData");
        cc.Class({
            extends: cc.Component,
            editor: {
                menu: "gof/UITop"
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
            onLoad: function onLoad() {
                this.moneyLabel.string = "";
                this.dateLabel.string = "";
            },
            start: function start() {},
            update: function update(dt) {
                if (null != game.phase) {
                    var farm = game.farm;
                    this.moneyLabel.string = game.farm.money;
                    var month = i18n.t("month_" + (farm.month + 1));
                    this.dateLabel.string = i18n.t("date_value", {
                        year: farm.year,
                        month: month,
                        week: farm.week + 1
                    });
                }
            }
        });
        cc._RF.pop();
    }, {
        Farm: "Farm",
        Game: "Game",
        LanguageData: "LanguageData"
    } ],
    UsableItem: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "cdffbW74nlJB4VaXT8j1d7G", "UsableItem");
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var CUsableItem = function CUsableItem(_JSON) {
            _classCallCheck(this, CUsableItem);
            this.dbId = _JSON._id;
            this.name = _JSON.name;
            this.pricePerUnit = Number(_JSON.price);
            this.unit = _JSON.unit;
            this._valid = this.dbId && this.name && this.pricePerUnit;
        };
        exports.default = CUsableItem;
        module.exports = exports["default"];
        cc._RF.pop();
    }, {} ],
    constants: [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "a3409Ylha9I4Zk4lNHwejqQ", "constants");
        "use strict";
        module.exports = Object.freeze({
            CultureModeEnum: {
                NORMAL: "normal",
                BIO: "bio",
                PERMACULTURE: "permaculture",
                REASONED: "reasoned"
            },
            UserRoleEnum: {
                MASTER: "master",
                STUDENT: "student",
                PROFESSIONAL: "professional",
                OTHER: "other"
            },
            ChannelStateEnum: {
                OPENED: "opened",
                CLOSED: "closed"
            }
        });
        cc._RF.pop();
    }, {} ],
    "polyglot.min": [ function(require, module, exports) {
        "use strict";
        cc._RF.push(module, "e26fd9yy65A4q3/JkpVnFYg", "polyglot.min");
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        (function(e, t) {
            "function" == typeof define && define.amd ? define([], function() {
                return t(e);
            }) : "object" == ("undefined" === typeof exports ? "undefined" : _typeof(exports)) ? module.exports = t(e) : e.Polyglot = t(e);
        })(void 0, function(e) {
            function t(e) {
                e = e || {}, this.phrases = {}, this.extend(e.phrases || {}), this.currentLocale = e.locale || "en", 
                this.allowMissing = !!e.allowMissing, this.warn = e.warn || c;
            }
            function s(e) {
                var t, n, r, i = {};
                for (t in e) {
                    if (e.hasOwnProperty(t)) {
                        n = e[t];
                        for (r in n) {
                            i[n[r]] = t;
                        }
                    }
                }
                return i;
            }
            function o(e) {
                var t = /^\s+|\s+$/g;
                return e.replace(t, "");
            }
            function u(e, t, r) {
                var i, s, u;
                return null != r && e ? (s = e.split(n), u = s[f(t, r)] || s[0], i = o(u)) : i = e, 
                i;
            }
            function a(e) {
                var t = s(i);
                return t[e] || t.en;
            }
            function f(e, t) {
                return r[a(e)](t);
            }
            function l(e, t) {
                for (var n in t) {
                    "_" !== n && t.hasOwnProperty(n) && (e = e.replace(new RegExp("%\\{" + n + "\\}", "g"), t[n]));
                }
                return e;
            }
            function c(t) {
                e.console && e.console.warn && e.console.warn("WARNING: " + t);
            }
            function h(e) {
                var t = {};
                for (var n in e) {
                    t[n] = e[n];
                }
                return t;
            }
            t.VERSION = "0.4.3", t.prototype.locale = function(e) {
                return e && (this.currentLocale = e), this.currentLocale;
            }, t.prototype.extend = function(e, t) {
                var n;
                for (var r in e) {
                    e.hasOwnProperty(r) && (n = e[r], t && (r = t + "." + r), "object" == ("undefined" === typeof n ? "undefined" : _typeof(n)) ? this.extend(n, r) : this.phrases[r] = n);
                }
            }, t.prototype.clear = function() {
                this.phrases = {};
            }, t.prototype.replace = function(e) {
                this.clear(), this.extend(e);
            }, t.prototype.t = function(e, t) {
                var n, r;
                return t = null == t ? {} : t, "number" == typeof t && (t = {
                    smart_count: t
                }), "string" == typeof this.phrases[e] ? n = this.phrases[e] : "string" == typeof t._ ? n = t._ : this.allowMissing ? n = e : (this.warn('Missing translation for key: "' + e + '"'), 
                r = e), "string" == typeof n && (t = h(t), r = u(n, this.currentLocale, t.smart_count), 
                r = l(r, t)), r;
            }, t.prototype.has = function(e) {
                return e in this.phrases;
            };
            var n = "||||", r = {
                chinese: function chinese(e) {
                    return 0;
                },
                german: function german(e) {
                    return 1 !== e ? 1 : 0;
                },
                french: function french(e) {
                    return e > 1 ? 1 : 0;
                },
                russian: function russian(e) {
                    return e % 10 === 1 && e % 100 !== 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
                },
                czech: function czech(e) {
                    return 1 === e ? 0 : e >= 2 && e <= 4 ? 1 : 2;
                },
                polish: function polish(e) {
                    return 1 === e ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
                },
                icelandic: function icelandic(e) {
                    return e % 10 !== 1 || e % 100 === 11 ? 1 : 0;
                }
            }, i = {
                chinese: [ "fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh" ],
                german: [ "da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv" ],
                french: [ "fr", "tl", "pt-br" ],
                russian: [ "hr", "ru" ],
                czech: [ "cs" ],
                polish: [ "pl" ],
                icelandic: [ "is" ]
            };
            return t;
        });
        cc._RF.pop();
    }, {} ]
}, {}, [ "ApiClient", "Farm", "Game", "GamePhase", "MapCtrl", "Parcel", "ParcelSetup", "Plant", "RscPreload", "Startup", "LocalizedLabelExt", "UIBottom", "UICheat", "UIDebug", "UIEnv", "UIMessage", "UIOffice", "UIOutputInfoItem", "UIParcel", "UIParcelButton", "UIParcelHistoryItem", "UIPopupBase", "UIQuestInfo", "UIQuestIntro", "UIQuestMenu", "UIScore", "UIScore_croprotation", "UISpeciesInfosItem", "UISpeciesInfosPopup", "UISpeciesSelItem", "UISpeciesSelPopup", "UITop", "UsableItem", "constants", "LanguageData", "LocalizedLabel", "LocalizedSprite", "SpriteFrameSet", "polyglot.min" ]);