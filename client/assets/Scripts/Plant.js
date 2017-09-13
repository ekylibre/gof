
const SharedConsts = require('./common/constants')

/**
 * Represents a plant species available in the game
 * @class
 * @property {String} species plant species
 * @property {Dictionary(key: CultureModeEnum, value: number)} dbId entry id in database for each culture modes
 * @property {Dictionary(key: CultureModeEnum, value: number)} buyPrices price of seeds for a culture mode and per hectare
 * @property {Dictionary(key: CultureModeEnum, value: number)} sellPrices selling price of a ton of product
 * @property {Dictionary(key: CultureModeEnum, value: Object)} itks itk data
 */
export default class CPlant
{
    /**
     * @constructor
     * @param {String} _JSON JSon representing a plant from the database
     */
    constructor(_JSON)
    {
        this._valid = true;

        this.dbId = {};
        this.buyPrices = {};
        this.sellPrices = {};
        this.itks = {};

        this.tiledGID = [];

        if (_JSON !== undefined)
        {
            this.species = _JSON.species;

            this.update(_JSON);
        }
        
        if (this.species === undefined)
        {
            this._valid = false;
            cc.error('Invalid plant JSon: '+_JSON);
        }

    }

    update(_JSON)
    {
        if (_JSON.cultureMode !== undefined && _JSON.pricePerHectare !== undefined)
        {
            var mode = this._CultureMode(_JSON.cultureMode);
            if (this.dbId[mode] && this.dbId[mode] != _JSON._id)
            {
                cc.warn('Conflict on plant: '+this.species+' / mode: '+mode);
            }

            this.dbId[mode] = _JSON._id;

            this.buyPrices[mode] = _JSON.pricePerHectare;

            this.sellPrices[mode] = _JSON.pricePerHectare * 10;

            this.itks[mode] = _JSON.itk;
        }        
    }

    _CultureMode(_Mode)
    {
        var mode = _Mode;
        if (mode != SharedConsts.CultureModeEnum.NORMAL &&
            mode != SharedConsts.CultureModeEnum.BIO &&
            //mode != SharedConsts.CultureModeEnum.PERMACULTURE &&
            mode != SharedConsts.CultureModeEnum.REASONED)
        {
            cc.error('Invalid culture mode: '+_Mode);
            mode = SharedConsts.CultureModeEnum.NORMAL;
        }

        return mode;
    }

    getUnitCosts(_Mode)
    {
        var itk = getItk(_Mode);
        if (itk)
        {
            return itk.unitCosts;
        }
        return null;
    }

    getBuyPrice(_Mode)
    {
        return this.buyPrices[this._CultureMode(_Mode)];
    }

    getSellPrice(_Mode)
    {
        return this.sellPrices[this._CultureMode(_Mode)];
    }

    getItk(_Mode)
    {
        return this.itks[this._CultureMode(_Mode)];
    }

    get isFallow()
    {
        return this.species === 'fallow' || this.species === 'pasture';
    }
}

