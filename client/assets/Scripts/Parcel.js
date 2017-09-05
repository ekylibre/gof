
/**
 * Parcel state enum
 * @enum ParcelState
 */
var ParcelState = cc.Enum({
    EMPTY:0,
    FALLOW:1,       // en jachère
    PLOWED:2,       // labourée
    SEEDS:4,
    GROWING:5,
    READY:6
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
export default class CParcel
{

    /**
     * @constructor
     * @param {string} _UID: parcel unique identifier
     * @param {string} _Name: parcel name
     * @param {cc.TiledLayer} _TiledLayer: layer containing the parcel
     */
    constructor(_UID, _Name, _TiledLayer)
    {
        this.uid = _UID;

        if (_Name === undefined)
        {
            this.name = '';
        }
        else
        {
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
    hasTile(_Pos)
    {
        for (var i=0; i<this.tiles.length; i++)
        {
            if (this.tiles[i].x === _Pos.x && this.tiles[i].y === _Pos.y)
            {
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
    isAdjacent(_Pos)
    {
        for (var i=0; i<this.tiles.length; i++)
        {
            var pos1 = this.tiles[i];
            if(Math.abs(pos1.x - _Pos.x) == 1 && Math.abs(pos1.y - _Pos.y) == 0)
            {
                return true;
            }

            if(Math.abs(pos1.y - _Pos.y) == 1 && Math.abs(pos1.x - _Pos.x) == 0)
            {
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
    addTile(_Pos)
    {
        // Add tile to the array
        this.tiles.push(_Pos);

        if (this.rect.width == 0)
        {
            this.rect.x = _Pos.x;
            this.rect.y = _Pos.y;
            this.rect.width = 1;
            this.rect.height = 1;
        }

        // Updates rectangle
        if (this.rect.x>_Pos.x)
        {
            this.rect.x = _Pos.x;
        }
        if (this.rect.xMax<_Pos.x)
        {
            this.rect.width = _Pos.x - this.rect.x;
        }
        if (this.rect.y>_Pos.y)
        {
            this.rect.y = _Pos.y;
        }
        if (this.rect.yMax<_Pos.y)
        {
            this.rect.height = _Pos.y - this.rect.y;
        }

        this.surface++;
    }

    serialize()
    {
        var json=
        {
            uid: this.uid,
            state: this.state,
            rotationPrevision: this.rotationPrevision
        };
        return json;
    }

    deserialize(_JSon)
    {
        if (_JSon.uid !== this.uid)
        {
            cc.error("Invalid parcel json");
            return;
        }

        this.state = _JSon.state;
        this.rotationPrevision = _JSon.rotationPrevision;
    }
}