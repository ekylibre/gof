// MapCtrl component

// Add this on the TiledMap to manage touch events
// Call scrollEvent(null, 0) to disable touch (e.g.: when scrolling map)


//import CGame from 'Game';
//const game = new CGame();

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

        //this.initTouch();
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

                var touch = event.touch;
                // get 

                if (this.mapObjects && this.mapObjects.length>0)
                {
                    for (var i=0; i<this.mapObjects.length; i++)
                    {
                        var loc = this.mapObjects[i].node.convertToNodeSpace(touch.getLocation());
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
                        var loc = this.mapSprouts[i].node.convertToNodeSpace(touch.getLocation());
                        if (this.touchOnMap(this.mapSprouts[i], loc))
                        {
                            return;
                        }
                    }
                }
                
                if (this.mapParcels && this.mapParcels.length>0)
                {
                    UIDebug.touchLog = ''+touch.getLocationX()+','+touch.getLocationY()+' => '+this.mapParcels[0].node.convertToNodeSpace(touch.getLocation());                    

                    for (var i=0; i<this.mapParcels.length; i++)
                    {
                        var loc = this.mapParcels[i].node.convertToNodeSpace(touch.getLocation());
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

                //             var rect = new cc.rect(obj.sgNode.x - obj.sgNode.width/2, obj.sgNode.y,
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

                var rect = new cc.rect(obj.sgNode.x - obj.sgNode.width/2, obj.sgNode.y,
                obj.sgNode.width, obj.sgNode.height);

                if (rect.contains(_Pos))
                {
                    UIDebug.log('Clicked on object '+obj.name);

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
            if(isox < mapSize.width && isoy < mapSize.height)
            {
                var tile = layer.getTileAt(cc.v2(isox,isoy));
                if(tile)
                {
                    // a tile is clicked!
                    var tileGid = layer.getTileGIDAt(cc.v2(isox,isoy));
                    UIDebug.log('Clicked on layer '+layer.getLayerName()+' tile at '+isox+','+isoy+' GID='+tileGid);
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



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

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
