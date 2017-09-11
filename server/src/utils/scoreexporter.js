const Constants = require('../../../common/constants');
const User = require('../models/user');
const Channel = require('../models/channel');
const moment = require('moment');
var fs = require('fs');


function ScoreExporter(channel, format, i18n) {
    this.channel = channel;
    this.format = format;
    this.i18n = i18n;
}

var specific_data_export = {
    croprotation: function(header, bodyLine, details) {
        var hpop = false;
        var r = JSON.parse(details);
        for(var i=0;i<r.length;++i) {
            var detail = r[i];
            if(header) {
                header.push(detail.parcelName);
                hpop = true;
            }
            bodyLine.push(detail.note);
        }
        return hpop;
    }
};

var export_funcs = {
    
    default_csv : function(self) {
        var body = [];
        var header = [];
        var chan = self.channel;

        header.push(self.i18n.__('export_player_header')); 
        header.push(self.i18n.__('export_score_header'));

        var headerPopulated = false;

        for(var i=0;i<chan.users.length;++i) {
            var bodyLine = [];
            var channelUser = chan.users[i];
            var user = channelUser.user;
            if(channelUser.phaseResult && channelUser.phaseResult.details) {
                bodyLine.push(user.email);
                bodyLine.push(channelUser.phaseResult.score);
                //now export the scenario specific data
                var f = specific_data_export[chan.phase];
                if(f) {
                    var h = headerPopulated ? null : header;
                    var result = f(h, bodyLine, channelUser.phaseResult.details);
                    if(h && result) {
                        headerPopulated = true;
                    }
                }
            }
            body.push(bodyLine);
        }
        var csv = header.join(',') + '\n';
        for(var i=0;i<body.length;++i) {
            csv += body[i].join(',') + '\n';
        }

        return csv;
    }
};

ScoreExporter.prototype.export = function() {
    var exportFuncName = this.channel.phase + '_' + this.format.toLowerCase();
    var exportFunc = export_funcs[exportFuncName];

    var fallbackName = 'default_'+ this.format.toLowerCase();
    var fallback = export_funcs[fallbackName];
    if(exportFunc) {
        return exportFunc(this);
    } else if(fallback) {
        return fallback(this);
    }
    console.log("Function not implemented: " + exportFuncName + " neither: " + fallbackName);
    return null;
}

module.exports = ScoreExporter;


