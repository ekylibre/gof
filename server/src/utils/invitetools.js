
const Mailer = require('./mailer');
const config = require('config');

function getUrl(request, endpoint) {
    var host = request.server.info.uri;
    if(process.env.NODE_ENV === 'production'){
        host = 'https://game-of-farms.ekylibre.com';
    }
    return host + endpoint;
}

function InviteTools() {}

InviteTools.send = function(request, userEmail, channelId, callback) {

    var inviteUrl = getUrl(request, "/channels/"+channelId+"/accept/" + encodeURIComponent(userEmail));
    var subject = request.i18n.__("game_title");
    var text = request.i18n.__("player_invited_mail") + '\n' + inviteUrl;

    var mailer = new Mailer();
    var ctx = request.i18n;
    ctx.email = userEmail;
    ctx.inviteUrl = inviteUrl;
    ctx.preheader_text = text;

    request.server.render('mails/invite', ctx, { layoutPath: './templates/mails/layout', }, 
        (error, html, config) => {
            if(error) {
                return callback(error);
            }
            mailer.sendMail(userEmail, subject, text, html);
            mailer.destroy();
            callback(null);
        }
    );
}

module.exports = InviteTools;