/**
 * A parcel from the map
 * @class CParcel
 * 
 * @property {Array:cc.Vec2}    tiles: array of tiles positions
 * @property {cc.Rect}          rect: rectangle containg the parcel
 * @property {ParcelState}      state: current parcel state
 */
export class CParcel
{
    /**
     * Checks if given tile exists in the parcel
     * @param _Pos position of tile in map
     */
    hasTile(_Pos: cc._Vec2): boolean;

    /**
     * Checks if given tile is adjacent to one in the parcel
     * @param _Pos position of tile in map
     */
    isAdjacent(_Pos: cc.Vec2): boolean;

    /**
     * Add a tile to the parcel (without any check)
     * @param _Pos position of tile in map
     */
    addTile(_Pos: cc.Vec2): void;
}

/**
 * The farm
 * @class CFarm
 * 
 * @property {Array:cc.CParcel}    parcels: array of parcels
 */
export class CFarm
{
    /**
     * Adds a parcel to the farm
     * @method
     * @param {CParcel} _Parcel 
     */
    addParcel(_Parcel: CParcel): void;

    /**
     * @method
     * @param {cc.Vec2} _Pos: position of tile in map
     * @return {CParcel} or null
     */
    findParcelAt(_Pos: cc.Vec2): CParcel;

    findParcelAdjacent(_Pos: cc.Vec2): CParcel;
}

/**
 The Game singleton
 */
export class CGame
{
    /**
     * A debug tool
     */
    init(): void;
}