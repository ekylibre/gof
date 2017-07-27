// GamePhase class ("scenario")

/**
 * Represents a 'phase' of the game (scenario or part of a scenario)
 * @class
 * @property {string} id: unique identifier
 * @property {number} startMoney: money given if 1st phase
 * @property {number} startMonth: starting month
 * @property {number} startWeek: starting week in month
 * @property {number} startYearDiff: interval of year if not 1st phase
 * @property {number} perfectScore: score received for doing a perfect phase
 */
export default class CGamePhase
{
    constructor()
    {
        this.id='assollement';
        this.startMoney=50000;
        this.startMonth = 7;
        this.startWeek = 3;
        this.startYearDiff = 0;
        this.perfectScore=0;
    }
}