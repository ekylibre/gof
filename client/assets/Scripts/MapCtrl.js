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


import CGame from 'Game';
import CGamePhase from 'GamePhase';
import CFarm from 'Farm';
import CParcel from 'Parcel';
import UIParcelButton from 'UIParcelButton'

const game = new CGame();

const UIOffice = require('UIOffice');
const UIDebug = require('UIDebug');

const i18n = require('LanguageData');

/**
 * Manages the map scrolling, UI, etc...
 * @class
 * @name MapCtrl
 */
cc.Class({
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
    

    // use this for initialization
    onLoad: function()
    {
        this._mapScrollView = this.getComponent(cc.ScrollView);

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

        // Start a phase if needed
        if (game.phase === null)
        {
            game.phase = new CGamePhase();
        }
    },
    
    /**
     * Initializes touch events
     * @method
     */
    initTouch: function()
    {
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
        
        this.node.on(cc.Node.EventType.TOUCH_START,
            (event) =>
            {
                this._isScrolling = false;
            },
            this.node
        );

        this.node.on(cc.Node.EventType.TOUCH_END,
            (event) =>
            {
                if (this._isScrolling)
                {
                    // scrollview is scrolling, ignore touch
                    return;
                }

                // get "local" position
                var touch = event.touch;

                var loc = this._refMap.node.convertToNodeSpace(touch.getLocation());
                UIDebug.touchLog = ''+touch.getLocationX()+','+touch.getLocationY()+' => '+loc;

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
        var mapSize = _Map.getMapSize();
        var layers = _Map.allLayers();

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

            var tw = layer.getMapTileSize().width;
            var th = layer.getMapTileSize().height;
            var mw = layer.getLayerSize().width;
            var mh = layer.getLayerSize().height;

            var x = (_Pos.x) * 1;
            var y = (_Pos.y) * 1;

            var isox = Math.floor(mh - y/th + x/tw - mw/2);
            var isoy = Math.floor(mh - y/th - x/tw + mw/2);

            // true only if the coords is with in the map
            if(isox>=0 && isoy>=0 && isox < mapSize.width && isoy < mapSize.height)
            {
                var tilePos = cc.v2(isox,isoy);
                var tileGid = layer.getTileGIDAt(tilePos);
                if(tileGid != 0)
                {
                    // a tile is clicked!
                    // if (tileGid == 104)
                    // {
                    //     layer.setTileGID(102, cc.v2(isox,isoy))                        
                    // }
                    
                    if (game.isDebug)
                    {
                        var debug = 'Clicked on layer '+layer.getLayerName()+' tile('+isox+','+isoy+') GID='+tileGid;
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
            
        }

        return false;
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
        //pos.x += ts.width * 0.5;
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
            var totalSurface = 0;
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

                                totalSurface++;
                                //DEBUG
                                //layer.setTileGID(0, x, y);
                            }
                        }
                    }
                }

                // use number of tiles as a placeholder for surface
                game.farm.totalSurface = totalSurface;
            }
        }

        // Display buttons over parcels
        if (game.farm.parcels.length>0)
        {
            for (var k=0; k<game.farm.parcels.length; k++)
            {
                var parcel = game.farm.parcels[k];
                var btPrefab = cc.instantiate(this.parcelButtonPrefab);
                var bt = btPrefab.getComponent(UIParcelButton);
                bt.parcel = parcel;
                btPrefab.setParent(this.mapUILayer);
                btPrefab.setPosition(this.tileToUI(parcel.rect.center));
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
        
        cc.log('NbParcels='+game.farm.parcels.length);
        for (var k=0; k<game.farm.parcels.length; k++)
        {
            var parcel = game.farm.parcels[k];
            cc.log(parcel.name+': '+parcel.tiles.length);

            // show label at center
            // var dbg = cc.instantiate(this.debugLabelPrefab);
            // dbg.setParent(this.mapUILayer);
            // dbg.setPosition(this.tileToUI(parcel.rect.center));

            // var label = dbg.getComponentInChildren(cc.Label);         
            
            // label.string = parcel.name+' s='+parcel.surface+' (c='+parcel.rect.center.x+','+parcel.rect.center.y+')';
        }
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {

    // },

    /**
     * ScrollView callback, so we know when its scrolling
     * @callback
     */
    scrollEvent: function(sender, event)
    {
        if (event<9)
        {
            this._isScrolling = true;
        }
        else
        {
            this._isScrolling = false;          
        }
    },


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
