
import CParcel from 'Parcel';

/**
 * The farm
 * @class CFarm
 * 
 * @property {Array:cc.CParcel}    parcels: array of parcels
 */
export default class CFarm
{
    constructor()
    {
        this.parcels = [];
    }

    /**
     * Adds a parcel to the farm
     * @method
     * @param {CParcel} _Parcel 
     */
    addParcel(_Parcel)
    {
        this.parcels.push(_Parcel);
    }

    /**
     * @method
     * @param {cc.Vec2} _Pos: position of tile in map
     * @return {CParcel} or null
     */
    findParcelAt(_Pos)
    {
        for (var i=0; i<this.parcels.length; i++)
        {
            var parcel = this.parcels[i];
            if (parcel.hasTile(_Pos))
            {
                return parcel;
            }
        }

        return null;
    }

    findParcelAdjacent(_Pos)
    {
        for (var i=0; i<this.parcels.length; i++)
        {
            var parcel = this.parcels[i];
            if (parcel.isAdjacent(_Pos))
            {
                return parcel;
            }
        }

        return null;        
    }
}