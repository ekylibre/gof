// GamePhase class ("scenario")

const i18n = require('LanguageData');

export default class CGamePhase
{
    id='assollement';
    score=0;
    date=null;
    money=50000;

    _startYear=0;

    constructor()
    {
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