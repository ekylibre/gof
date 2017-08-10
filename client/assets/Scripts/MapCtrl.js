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


const CGame = require('./Game');
const CGamePhase = require('./GamePhase');
const CFarm = require('./Farm');
const CParcel = require('./Parcel');
const UIParcelButton = require('./UI/UIParcelButton');

const UIEnv = require('./UI/UIEnv');
const UIOffice = require('./UI/UIOffice');
const UIDebug = require('./UI/UIDebug');

const i18n = require('LanguageData');

const game = new CGame();


/**
 * Manages the map scrolling, UI, etc...
 * @class
 * @name MapCtrl
 */
var MapCtrl = cc.Class({
    extends: cc.Component,
    editor:
    {
        requireComponent: cc.ScrollView,
        menu: 'gof/MapCtrl'
    },

    properties: {

        /**
         * @property Layer to place the UI
         */
        mapUILayer:
        {
            default: null,
            type: cc.Node,
            displayName: 'UI layer'
        },
        
        /**
         * @property Starting scrollview position
         */
        startOffset:
        {
            default: new cc.Vec2(0,0),
            displayName: 'Scroll starting pos'
        },
        
        /**
         * @property List of TiledMaps containing parcels ground
         */        
        mapParcels:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Parcels maps'
        },

        /**
         * @property List of TiledMaps containing the sprouts
         */
        mapSprouts:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Sprouts maps'
        },

        // List of objects TiledMaps
        mapObjects:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Objects maps'
        },


        /**
         * @property List of valid parcel tiles gid
         */
        parcelsGID:
        {
            default: [],
            type: [cc.Integer],
            displayName: 'Parcels GID'
        },

        /**
         * @property Prefab used to display a button over a parcel
         */
        parcelButtonPrefab:
        {
            default: null,
            type: cc.Prefab,
            displayName: 'Prefab Parcels button'
        },

        // a debug prefab
        debugLabelPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    statics:
    {
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
    onLoad: function()
    {
        if (MapCtrl.instance == null)
        {
            MapCtrl.instance = this;
        }
        else
        {
            cc.error('An instance of MapCtrl already exists');
        }

        this._mapScrollView = this.getComponent(cc.ScrollView);
        this._mapStartSize = this._mapScrollView.content.getContentSize();

        // Setting touch events       
        this.initTouch();
    },

    start: function(err)
    {
        if (err) return;

        // Scroll map to starting offset
        this._mapScrollView.scrollToOffset(this.startOffset);
     
        this.findParcels();

        if (game.isDebug)
        {
            this.addDebugInfo();
        }
    },
    
    /**
     * Updates the game state
     */
    update: function(dt)
    {
        switch (game.state)
        {
            case CGame.State.READY:
                // CGame is ready, lets load a phase
                game.loadPhase('croprotation', 
                (error) =>
                {
                    if(error)
                    {
                        UIEnv.message.show(
                            i18n.t('error_connection_failed')+'\n\n('+error+')',
                            i18n.t('error'),
                            {
                                buttons: 'none'
                            }
                        );                         
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
    checkMapBorders: function()
    {
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
        if (center.x<-margin)
        {
            delta = -center.x+margin;
            center.x = -margin;
        }
        if (center.x>=(mapSize.width+margin))
        {
            delta += center.x-(mapSize.width+margin);
            center.x = mapSize.width+margin-1;
        }
        if (center.y<-margin)
        {
            delta += -center.y+margin;
            center.y = -margin;
        }
        if (center.y>=(mapSize.height+margin))
        {
            delta += center.y-(mapSize.height+margin);
            center.y = mapSize.height+margin-1;
        }

        if (delta>0)
        {
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
    initTouch: function()
    {
        // Check map content
        if (this.mapParcels && this.mapParcels.length>0)
        {
            this._refMap = this.mapParcels[0];
            this._refLayer = this._refMap.allLayers()[0];
        }
        else
        if (this.mapSprouts && this.mapSprouts.length>0)
        {
            this._refMap = this.mapSprouts[0];
            this._refLayer = this._refMap.allLayers()[0];
        }
        else
        {
            cc.error('At least one parcel or sprout TiledMap is required');
            return;
        }

        // Compute full map size in pixels
        var mapSize = this._refMap.getMapSize();
        var tileSize = this._refMap.getTileSize();
        this._refSize = cc.v2(mapSize.width * tileSize.width, mapSize.height * tileSize.height);

        // Replace the _onMouseWheel callback from the ScrollView
        this._mapScrollView._onMouseWheel = function(event, captureListeners)
        {
            var speed = 0.05;
            if (event.getScrollY()<0)
            {
                speed = -speed;
            }
            var scale = this.content.scaleX + speed;
            if (scale < game.config.MAP_ZOOM_MIN)
            {
                scale = game.config.MAP_ZOOM_MIN;
            }
            if (scale> game.config.MAP_ZOOM_MAX)
            {
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
        this.node.on(cc.Node.EventType.TOUCH_START,
            (event) =>
            {
                this._scrollLen = 0;
            },
            this.node
        );
        this.node.on(cc.Node.EventType.TOUCH_MOVE,
            (event) =>
            {
                this._scrollLen += cc.pLength(event.touch.getDelta());
            },
            this.node
        );
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,
            (event) =>
            {
                if (this._scrollLen>2)
                {
                    // scrollview is scrolling, ignore touch
                    this._scrollLen = 0;
                    MapCtrl.instance.checkMapBorders();
                    return;
                }                
            });
        
        this.node.on(cc.Node.EventType.TOUCH_END,
            (event) =>
            {
                if (this._scrollLen>2)
                {
                    // scrollview is scrolling, ignore touch
                    this._scrollLen = 0;
                    MapCtrl.instance.checkMapBorders();
                    return;
                }

                // get "local" position
                var touch = event.touch;

                var loc = this._refMap.node.convertToNodeSpace(touch.getLocation());
                UIDebug.touchLog = ''+touch.getLocationX()+','+touch.getLocationY()+' => '+loc;

                // var center = this.pixelToScroll(loc);
                // center.x -= (this._mapScrollView.node.width / 2);
                // center.y -= (this._mapScrollView.node.height / 2);
                // this._mapScrollView.scrollToOffset(center);

                if (this.mapObjects && this.mapObjects.length>0)
                {
                    for (var i=0; i<this.mapObjects.length; i++)
                    {
                        if (this.touchOnMap(this.mapObjects[i], loc))
                        {
                            return;
                        }
                    }
                }

                if (this.mapSprouts && this.mapSprouts.length>0)
                {
                    for (var i=0; i<this.mapSprouts.length; i++)
                    {
                        if (this.touchOnMap(this.mapSprouts[i], loc))
                        {
                            return;
                        }
                    }
                }
                
                if (this.mapParcels && this.mapParcels.length>0)
                {
                    for (var i=0; i<this.mapParcels.length; i++)
                    {
                        if (this.touchOnMap(this.mapParcels[i], loc))
                        {
                            return;
                        }
                    }
                }
            },
            this.node);

    },

    /**
     *  Checks if there's something on map at specified 'pixel' position
     * @method
     * @param {cc.TiledMap} _Map the TiledMap to look into
     * @param {cc.Vec2}     _Pos the position in the map in pixels
     * @return {Boolean}
     */
    touchOnMap: function(_Map, _Pos)
    {
        var layers = _Map.allLayers();

        var tilePos = this.pixelToTile(_Pos);
        if (tilePos == null)
        {
            // not on map
            return false;
        }
        
        // Parse objectsgroups
        var groups = _Map.getObjectGroups();
        for (var i= groups.length-1; i>=0; i--)
        {
            var group = groups[i];
            var objs = group.getObjects();

            for (var j=0; j<objs.length; j++)
            {
                var obj = objs[j];

                var margin = 0.15;
                var w = obj.sgNode.width * (1-margin*2);
                var halfw = w / 2;
                var ydelta = obj.sgNode.height * margin; 
                var h = obj.sgNode.height * (1-margin*2);
                var rect = cc.rect(
                    obj.sgNode.x - halfw,
                    obj.sgNode.y + ydelta,
                    w,
                    h);

                if (rect.contains(_Pos))
                {
                    if (game.isDebug)
                    {
                        UIDebug.log('Clicked on object '+obj.name);
                    }

                    UIOffice.instance.show();
                    return true;
                }
            }
        }

        // Parse tiles layers
        for (var i = layers.length-1; i >=0; i--)
        {
            var layer = layers[i];

            var tileGid = layer.getTileGIDAt(tilePos);
            if(tileGid != 0)
            {           
                if (game.isDebug)
                {
                    var debug = 'Clicked on layer '+layer.getLayerName()+' tile('+tilePos.x+','+tilePos.y+') GID='+tileGid;
                    var parcel = game.farm.findParcelAt(tilePos);
                    if (parcel != null)
                    {
                        debug += ' Parcel: '+parcel.name;
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
    pixelToTile: function(_Pos, _NoLimit = false)
    {
        var mapSize = this._refMap.getMapSize();
        
        var tw = this._refLayer.getMapTileSize().width;
        var th = this._refLayer.getMapTileSize().height;
        var mw = this._refLayer.getLayerSize().width;
        var mh = this._refLayer.getLayerSize().height;

        var x = (_Pos.x) * 1;
        var y = (_Pos.y) * 1;

        var isox = Math.floor(mh - y/th + x/tw - mw/2);
        var isoy = Math.floor(mh - y/th - x/tw + mw/2);

        // true only if the coords are within the map
        if (_NoLimit || (isox>=0 && isoy>=0 && isox < mapSize.width && isoy < mapSize.height))
        {
            return cc.v2(isox, isoy);
        }

        return null;
    },

    /**
     * Converts a map pixel position to a scroll offset (for the scrollview)
     * @param {cc.Vec2} _Pos: pixel position in map
     * @return {cc.Vec2}
     */
    pixelToScroll: function(_Pos)
    {
        var scale = this._mapScrollView.content.scaleX;
        return cc.v2(_Pos.x * scale, (this._refSize.y-_Pos.y)*scale);
    },

    
    /**
     * Converts a tile position to a map pixel position
     * @param {cc.Vec2} _Pos: tile coordinates
     * @return {cc.Vec2}
     */
    tileToPixel: function(_Pos)
    {
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
    tileToUI: function(_Pos)
    {
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
    mapToUI: function(_Pos)
    {
        return cc.v2(_Pos.x-this.mapUILayer.width*0.5, _Pos.y-this.mapUILayer.height*0.5);
    },

    
    /**
     * Parses the parcels map to create CParcel objects
     * @method
     */
    findParcels: function()
    {
        if (this.mapParcels && this.parcelsGID && this.parcelsGID.length>0)
        {
            var totalTiles = 0;
            for (var i=0; i<this.mapParcels.length; i++)
            {
                var mapSize = this.mapParcels[i].getMapSize();

                for (var j=0; j<this.mapParcels[i].allLayers().length; j++)
                {
                    var layer = this.mapParcels[i].allLayers()[j];
                    for (var y=0; y<mapSize.height; y++)
                    {
                        for (var x=0; x<mapSize.width; x++)
                        {
                            if (this.parcelsGID.includes(layer.getTileGIDAt(x, y)))
                            {
                                var pos = new cc.Vec2(x, y);
                                var parcel = game.farm.findParcelAdjacent(pos);
                                if (parcel != null && parcel.tiledLayer == layer)
                                {
                                    // adjacent parcel found, add tile to it
                                    parcel.addTile(pos);
                                }
                                else
                                {
                                    // create a new parcel
                                    var uid = 'parcel'+(game.farm.parcels.length+1);
                                    var name = i18n.t('parcel')+' '+String(game.farm.parcels.length+1);
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
                cc.log('TODO: setup the total surface from a metadata in the map?')
                game.farm.totalSurface = 55;                
                game.farm.surfacePerTile = game.farm.totalSurface / totalTiles;
            }
        }

        // Compute parcels surface depending on total farm surface
        // and display info button over each one
        if (game.farm.parcels.length>0)
        {
            for (var k=0; k<game.farm.parcels.length; k++)
            {
                var parcel = game.farm.parcels[k];

                // surface in Ha
                parcel.surface = Math.ceil(parcel.surface *game.farm.surfacePerTile*100) / 100;

                var btPrefab = cc.instantiate(this.parcelButtonPrefab);
                var bt = btPrefab.getComponent(UIParcelButton);
                bt.parcel = parcel;
                btPrefab.setParent(this.mapUILayer);
                btPrefab.setPosition(this.tileToUI(parcel.rect.center));

                //DEBUG
                //parcel.rotationPrevision.push({species: 'carrot', culture: 'normal'});
            }                
        }
        else
        {
            cc.error('No parcels found! Please check you filled the mapParcel and parcelGID arrays');
        }
    },

    addDebugInfo: function()
    {
        // Display info labels on top of map objects
        if (this.mapObjects)
        {
            for (var k=0; k<this.mapObjects.length; k++)
            {            
                var groups = this.mapObjects[k].getObjectGroups();
                for (var i= groups.length-1; i>=0; i--)
                {
                    var group = groups[i];
                    var objs = group.getObjects();

                    for (var j=0; j<objs.length; j++)
                    {
                        var obj = objs[j];
                        var sgPos = cc.v2(obj.sgNode.x, obj.sgNode.y);

                        var dbg = cc.instantiate(this.debugLabelPrefab);
                        dbg.setParent(this.mapUILayer);
                        dbg.setPosition(this.mapToUI(sgPos));

                        var label = dbg.getComponentInChildren(cc.Label);
                        
                        label.string = obj.name+': '+Math.floor(obj.sgNode.x)+','+Math.floor(obj.sgNode.y);
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


    __Debug: function()
    {

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
       

    },


});

module.exports = MapCtrl;