// MapCtrl component

// Add this on the TiledMap to manage touch events
// Call scrollEvent(null, 0) to disable touch (e.g.: when scrolling map)


import CGame from 'Game';
import CFarm from 'Farm';
import CParcel from 'Parcel';

const game = new CGame();

const UIOffice = require('UIOffice');
const UIDebug = require('UIDebug');

cc.Class({
    extends: cc.Component,
    editor:
    {
        //requireComponent: cc.TiledMap,
        menu: 'gof/MapCtrl'
    },

    properties: {
        // the ScrollView containing the map
        mapScrollView:
        {
            default: null,
            type: cc.ScrollView,
            displayName: 'MapScrollView'
        },
        
        // starting ScrollView offset
        startOffset:
        {
            default: new cc.Vec2(0,0),
            displayName: 'Scroll starting pos'
        },
        
        // List of parcels TiledMaps
        mapParcels:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Parcels maps'
        },

        // List of sprouts TiledMaps
        mapSprouts:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Sprouts maps'
        },

        // List of valid parcel tiles gid
        parcelsGID:
        {
            default: [],
            type: [cc.Integer],
            displayName: 'Parcels GID'
        },

        // List of objects TiledMaps
        mapObjects:
        {
            default: [],
            type: [cc.TiledMap],
            displayName: 'Objects maps'
        },

        // a debug prefab
        debugLabelPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function()
    {
        // Setting touch events

        this.initTouch();

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

    initTouch: function()
    {
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
                var baseMap = null;
                var loc = null;
                if (this.mapParcels && this.mapParcels.length>0)
                {
                    baseMap = this.mapParcels[0];
                }
                else
                if (this.mapSprouts && this.mapSprouts.length>0)
                {
                    baseMap = this.mapSprouts[0];
                }
                else
                {
                    cc.error('At least one parcel or sprout TiledMap is required');
                    return;
                }

                var loc = baseMap.node.convertToNodeSpace(touch.getLocation());
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

                // var tiledMap = this._tiledMap; //this.node.getComponent('cc.TiledMap');
                // if (tiledMap)
                // {
                //     var mapSize = tiledMap.getMapSize();
                //     var layers = tiledMap.allLayers();

                //     // convert touch position to node position (i.e. map position)
                //     var loc = tiledMap.node.convertToNodeSpace(touch.getLocation());
                    
                //     UIDebug.touchLog = ''+touch.getLocationX()+','+touch.getLocationY()+' => '+loc;

                //     var groups = tiledMap.getObjectGroups();
                //     for (var i= groups.length-1; i>=0; i--)
                //     {
                //         var group = groups[i];
                //         var objs = group.getObjects();

                //         for (var j=0; j<objs.length; j++)
                //         {
                //             var obj = objs[j];

                //             var rect = cc.rect(obj.sgNode.x - obj.sgNode.width/2, obj.sgNode.y,
                //             obj.sgNode.width, obj.sgNode.height);

                //             if (rect.contains(loc))
                //             {
                //                 UIDebug.log('Clicked on object '+obj.name);

                //                 UIOffice.instance.show();
                //                 return;
                //             }
                //         }
                //     }

                //     for (var i = layers.length-1; i >=0; i--)
                //     {
                //         var layer = layers[i];

                //         var TILE_WIDTH_HALF = layer.getMapTileSize().width;
                //         var TILE_HEIGHT_HALF = layer.getMapTileSize().height;

                //         var tw = layer.getMapTileSize().width;
                //         var th = layer.getMapTileSize().height;
                //         var mw = layer.getLayerSize().width;
                //         var mh = layer.getLayerSize().height;

                //         var x = (loc.x) * 1;
                //         var y = (loc.y) * 1;

                //         var isox = Math.floor(mh - y/th + x/tw - mw/2);
                //         var isoy = Math.floor(mh - y/th - x/tw + mw/2);

                //         // true only if the coords is with in the map
                //         if(isox < mapSize.width && isoy < mapSize.height)
                //         {
                //             var tile = layer.getTileAt(cc.v2(isox,isoy));
                //             if(tile)
                //             {
                //                 // a tile is clicked!
                //                 var tileGid = layer.getTileGIDAt(cc.v2(isox,isoy));
                //                 UIDebug.log('Clicked on layer '+layer.getLayerName()+' tile at '+isox+','+isoy+' GID='+tileGid);
                //                 return;
                //             }
                //         }                        
                //     }
                //}
            },
            this.node);

    },

    // Find if there's something on map at specified pos
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

                var rect = cc.rect(obj.sgNode.x - obj.sgNode.width/2, obj.sgNode.y,
                obj.sgNode.width, obj.sgNode.height);

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

            var TILE_WIDTH_HALF = layer.getMapTileSize().width;
            var TILE_HEIGHT_HALF = layer.getMapTileSize().height;

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

    start: function(err)
    {
        if (err) return;

        // Scroll map to starting offset
        this.mapScrollView.scrollToOffset(this.startOffset);

        this.findParcels();

        // // display debug info on map "objects"
        // if (this.mapObjects && this.mapObjects.length>0)
        // {
        //     for (var k=0; k<this.mapObjects.length; k++)
        //     {            
        //         var groups = this.mapObjects[k].getObjectGroups();
        //         for (var i= groups.length-1; i>=0; i--)
        //         {
        //             var group = groups[i];
        //             var objs = group.getObjects();

        //             for (var j=0; j<objs.length; j++)
        //             {
        //                 var obj = objs[j];

        //                 //var pos = this.mapObjects[k].node.convertToWorldSpace(new cc.Vec2(obj.sgNode.x, obj.sgNode.y));

        //                 var dbg = cc.instantiate(this.debugLabelPrefab);

        //                 dbg.setParent(this.mapScrollView.node);
        //                 dbg.setPosition(new cc.Vec2(obj.sgNode.x, obj.sgNode.y));

        //                 var label = dbg.getComponentInChildren(cc.Label);                   
                        
        //                 label.string = obj.name+': '+Math.floor(obj.sgNode.x)+','+Math.floor(obj.sgNode.y);
        //             }
        //         }
                
        //     }
        // }
        
    },

    findParcels: function()
    {
        if (this.mapParcels && this.parcelsGID && this.parcelsGID.length>0)
        {
            
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
                                if (parcel != null)
                                {
                                    // adjacent parcel found, add tile to it
                                    parcel.addTile(pos);
                                }
                                else
                                {
                                    // create a new parcel
                                    var name = 'Parcel'+(game.farm.parcels.length+1);
                                    parcel = new CParcel(name);
                                    parcel.addTile(pos);
                                    game.farm.addParcel(parcel);
                                }

                                //DEBUG
                                //layer.setTileGID(0, x, y);
                            }
                        }
                    }
                }
            }

            if (game.isDebug)
            {
                cc.log('NbParcels='+game.farm.parcels.length);
                for (var k=0; k<game.farm.parcels.length; k++)
                {
                    var parcel = game.farm.parcels[k];
                    cc.log(parcel.name+': '+parcel.tiles.length);
                }
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {

    // },

    // ScrollView callback, so we know when its scrolling
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
    }
});
