// GamePhase class ("scenario")

/**
 * Represents a 'phase' of the game (scenario or part of a scenario)
 * @class
 * @property {string} uid: unique identifier
 * @property {number} startMoney: money given if 1st phase
 * @property {number} startMonth: starting month
 * @property {number} startWeek: starting week in month
 * @property {number} startYearDiff: interval of year if not 1st phase
 * @property {number} perfectScore: score received for doing a perfect phase
 * @property {array}  parcels: parcels setup data
 */
export default class CGamePhase
{
    constructor()
    {
        this.uid='assolement';
        this.startMoney=50000;
        this.startMonth = 7;
        this.startWeek = 3;
        this.startYearDiff = 0;
        this.perfectScore=0;

        this.parcels =
        [
            {
                uid: 'parcel1',
                history: ['ble', 'ble', 'orge', 'fallow', 'fallow']
            },
            {
                uid: 'parcel2',
                history: ['pois', 'avoine', 'ble', 'ble', 'fallow']
            },
            {
                uid: 'parcel3',
                history: ['lupin', 'lupin', 'colza', 'colza', 'fallow']
            },
            {
                uid: 'parcel4',
                history: ['orge', 'sarrasin', 'seigle', 'sarrasin', 'fallow']
            },
            {
                uid: 'parcel5',
                history: ['tournesol', 'mais', 'fallow', 'avoine', 'lupin']
            },
            {
                uid: 'parcel6',
                history: ['fallow', 'fallow', 'carotte', 'pois', 'fallow']
            },
            {
                uid: 'parcel7',
                history: ['lupin', 'lupin', 'triticale', 'fallow', 'ble']
            },
        ];

    }
}