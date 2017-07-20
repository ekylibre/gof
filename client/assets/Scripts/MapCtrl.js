import CGame from 'Game';
const game = new CGame();


cc.Class({
    extends: cc.Component,
    editor:
    {
        requireComponent: cc.TiledMap
    },

    properties: {
        debugLabelPrefab: {
            default: null,
            type: cc.Prefab
        },
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
    onLoad: function()
    {
        // Setting touch events
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
                var tiledMap = this.node.getComponent('cc.TiledMap');
                if (tiledMap)
                {
                    var mapSize = tiledMap.getMapSize();
                    var layers = tiledMap.allLayers();

                    // convert touch position to node position (i.e. map position)
                    var loc = tiledMap.node.convertToNodeSpace(touch.getLocation());
                    
                    game.touchLog = ''+touch.getLocationX()+','+touch.getLocationY()+' => '+loc;

                    //var groups = tiledMap.getObjectGroups();
                    // for (var i= groups.length-1; i>=0; i--)
                    // {
                    //     var group = groups[i];
                    //     var objs = group.getObjects();

                    //     for (var j=0; j<objs.length; j++)
                    //     {
                    //         var obj = objs[j];

                    //         cc.log(obj.name+': '+(obj.sgNode.x)+','+(obj.sgNode.y) );
                    //         //cc.log('Clicked on objectGroup '+group.getGroupName()+': '+obj.name);
                    //     }
                    // }

                    for (var i = layers.length-1; i >=0; i--)
                    {
                        var layer = layers[i];

                        var TILE_WIDTH_HALF = layer.getMapTileSize().width;
                        var TILE_HEIGHT_HALF = layer.getMapTileSize().height;

                        var tw = layer.getMapTileSize().width;
                        var th = layer.getMapTileSize().height;
                        var mw = layer.getLayerSize().width;
                        var mh = layer.getLayerSize().height;

                        var x = (loc.x) * 1;
                        var y = (loc.y) * 1;

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
                                game.debugLog = 'Clicked on layer '+layer.getLayerName()+' tile at '+isox+','+isoy+' GID='+tileGid;
                                break;
                            }
                        }
                        
                    }
                }
            },
            this.node);
    },

    start: function(err)
    {
        if (err) return;

        this._tiledMap = this.node.getComponent('cc.TiledMap');

        // display debug info on map "objects"
        if (this._tiledMap)
        {
            var groups = this._tiledMap.getObjectGroups();
            for (var i= groups.length-1; i>=0; i--)
            {
                var group = groups[i];
                var objs = group.getObjects();

                for (var j=0; j<objs.length; j++)
                {
                    var obj = objs[j];

                    var pos = this.node.convertToWorldSpace(new cc.Point(obj.sgNode.x, obj.sgNode.y));

                    var dbg = cc.instantiate(this.debugLabelPrefab);

                    dbg.setPosition(pos);
                    dbg.setParent(this.node);

                    var label = dbg.getComponentInChildren(cc.Label);                   
                    
                    label.string = obj.name+': '+Math.floor(obj.sgNode.x)+','+Math.floor(obj.sgNode.y);
                }
            }
        }
        
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
