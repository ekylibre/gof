
const SharedConsts = require('../../../common/constants')

/**
 * Represents a plant species available in the game
 * @class
 * @property {String} species plant species
 * @property {Dictionary(key: CultureModeEnum, value: number)} dbId entry id in database for each culture modes
 * @property {Dictionary(key: CultureModeEnum, value: number)} buyPrices price of seeds for a culture mode and per hectare
 * @property {Dictionary(key: CultureModeEnum, value: number)} sellPrices selling price of a ton of product
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

        this.tiledGID = [];

        if (_JSON !== undefined)
        {
            this.species = _JSON.species;

            this.updatePrices(_JSON);
        }
        
        if (this.species === undefined)
        {
            this.valid = false;
            cc.error('Invalid plant JSon: '+_JSON);
        }

    }

    updatePrices(_JSON)
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

            this.sellPrices[mode] = _JSON.pricePerHectare * 100;
        }        
    }

    _CultureMode(_Mode)
    {
        var mode = _Mode;
        if (mode != SharedConsts.CultureModeEnum.NORMAL &&
            mode != SharedConsts.CultureModeEnum.BIO &&
            mode != SharedConsts.CultureModeEnum.PERMACULTURE)
        {
            cc.error('Invalid culture mode: '+_Mode);
            mode = SharedConsts.CultureModeEnum.NORMAL;
        }

        return mode;
    }

    getBuyPrice(_Mode)
    {
        return this.buyPrices[this._CultureMode(_Mode)];
    }

    getSellPrice(_Mode)
    {
        return this.sellPrices[this._CultureMode(_Mode)];
    }

    static _getIconId(_Species)
    {
        var t=
        {
            'corn': 'mais',
            'wheat': 'ble',
            'durum_wheat': 'ble',
            'soft_wheat': 'ble',
            'carrot': 'carotte',
            'sunflower': 'tournesol',
            'barley': 'orge',
            'oat': 'avoine',
            'rye': 'seigle',
            'buckwheat': 'sarrasin',
            'pea': 'pois',
            'beetroot': 'betterave',

            'pasture': 'prairies',
        };

        var id = t[_Species];
        if (id === undefined)
        {
            id = _Species;            
        }

        return id;
    }
}

