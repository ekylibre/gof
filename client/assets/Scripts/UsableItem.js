
/**
 * Very generic class to store cost of "usable" items
 * TODO: Should be split into specialized classes (at the moment, includes everything from tractors to employees)
 * TODO: and take into account unit types (eg: kg...) to be able to convert if needed
 */
export default class CUsableItem
{
    constructor(_JSON)
    {
        /**
         * @type {String}
         */
        this.dbId = _JSON._id;
        /**
         * @type {String}
         */
        this.name = _JSON.name;

        /**
         * depending on item type, can represent a cost per hour, per kg...
         * @type {Number}
         */
        this.pricePerUnit = Number(_JSON.price);

        /**
         * Unit
         */
        this.unit = _JSON.unit;

        this._valid = this.dbId && this.name && this.pricePerUnit;

    }
}
