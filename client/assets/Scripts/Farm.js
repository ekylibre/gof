
import CParcel from 'Parcel';

/**
 * The farm
 * @class CFarm
 * 
 * @property {String}               name: farm name
 * @property {Array:cc.CParcel}     parcels: array of parcels
 * @property {number}               totalSurface: total surface of parcels (hectare)
 */
export default class CFarm
{
    /**
     * @constructor
     * @param {String} _Name name of farm
     * @param {number} _Surface total parcels surface (hectare)
     */
    constructor(_Name, _Surface)
    {
        if (_Name === undefined)
        {
            this.name = 'Farm';
        }
        else
        {
            this.name = _Name;
        }
        if (_Surface === undefined)
        {
            this.totalSurface = 0;
        }
        else
        {
            this.totalSurface = _Surface;
        }

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