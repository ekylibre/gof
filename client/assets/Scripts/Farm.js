
import CParcel from 'Parcel'
import CGamePhase from 'GamePhase'

/**
 * The farm
 * @class CFarm
 * 
 * @property {String}               name: farm name
 * @property {Array:cc.CParcel}     parcels: array of parcels
 * @property {number}               totalSurface: total surface of parcels (hectare)
 * @property {Array:strings}        possibleSpecies: list of possible plant species
 * @property {number}               money: current money
 * @property {number}               year: current year delta [0, ?]
 * @property {number}               month: current month [0, 11]
 * @property {number}               week: current week in month [0,3]
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
        this.name = _Name;

        if (_Surface === undefined)
        {
            this.totalSurface = 0;
        }
        else
        {
            this.totalSurface = _Surface;
        }

        this.parcels = [];
        this.possibleSpecies = [];
        this.money = 0;

        this.year = 0;
        this.month = 0;
        this.week = 0;
    }

    /**
     * Adds a parcel to the farm
     * @method addParcel
     * @param {CParcel} _Parcel 
     */
    addParcel(_Parcel)
    {
        this.parcels.push(_Parcel);
    }

    /**
     * @method findParcelAt
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

    /**
     * @method findParcelAdjacent
     * @param {cc.Vec2} _Pos: position of tile in map
     * @return {CParcel} or null
     */
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

    /**
     * Finds a parcel with specified UID
     * @method findParcelUID
     * @param {String} _UID parcel unique identifier
     * @returns {CParcel} the parcel, or null
     */
    findParcelUID(_UID)
    {
        if (_UID !== undefined)
        {
            var parcel = this.parcels.find( (p)=> {return p.uid == _UID;} );
            if (parcel !== undefined)
            {
                return parcel;
            }
            // for (var i=0; i<this.parcels.length; i++)
            // {
            //     var parcel = this.parcels[i];
            //     if (parcel.uid === _UID)
            //     {
            //         return parcel;
            //     }
            // }
        }

        return null;
    }
}