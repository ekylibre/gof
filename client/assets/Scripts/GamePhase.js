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
                history: ['ble', 'ble', 'orge']
            },
            {
                uid: 'parcel2',
                history: ['pois', 'avoine', 'ble']
            },
            {
                uid: 'parcel3',
                history: ['lupin', 'lupin', 'colza']
            },
            {
                uid: 'parcel4',
                history: ['orge', 'sarrasin', 'seigle']
            },
            {
                uid: 'parcel5',
                history: ['tournesol', 'mais', 'fallow']
            },
            {
                uid: 'parcel6',
                history: ['fallow', 'fallow', 'carotte']
            },
            {
                uid: 'parcel7',
                history: ['lupin', 'lupin', 'triticale']
            },
        ];

    }
}