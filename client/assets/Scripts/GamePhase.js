// GamePhase class ("scenario")

const i18n = require('LanguageData');

/**
 * Represents a 'phase' of the game (scenario or part of a scenario)
 * @class
 */
export default class CGamePhase
{
    constructor()
    {
        this.id='assollement';
        this.score=0;
        this.money=50000;

        var now = new Date(Date.now());       
        this._startYear = now.getFullYear();
        this.date = new Date(this._startYear, 7, 20);
    }

    getDateString()
    {
        var y = this.date.getFullYear();
        var m = this.date.getMonth() + 1;
        var d = this.date.getDate();

        return d.toLocaleString("fr", {minimumIntegerDigits: 2})+'/'+m.toLocaleString("fr", {minimumIntegerDigits: 2})+'/'+y;
    }

    get title()
    {
        return i18n.t(this.id);
    }
}