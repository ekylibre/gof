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
 * @property {number} maxPrevisions: maximum number of rotation previsions per parcel
 * @property {array:string} plantExcludes: array of uid of plants to exclude during this phase
 * @property {array:CParcelSetup}  parcels: parcels setup data
 */
export default class CGamePhase {
    constructor() {
        this.uid = 'assolement';
        this.startMoney = 50000;
        this.startMonth = 7;
        this.startWeek = 3;
        this.introTextId = null;
        this.objctiveTextId = null;
        this.startYearDiff = 0;
        this.perfectScore = 0;
        this.maxPrevisions = 1;
        this.endCondition = 'false';
        this.completionStr = '';
        this.plantExcludes = [];
        this.parcels =
            [
                {
                    uid: 'parcel1',
                    history:
                    [
                        {
                            species: 'ble',
                            culture: 'bio'
                        },
                        {
                            species: 'orge',
                            culture: 'normal'
                        },
                    ]
                },
            ];
    }
}