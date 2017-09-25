'use strict';

const nodemailer = require('nodemailer');
const config = require('config');

function Mailer() {
    this.transport = nodemailer.createTransport(config.get('Nodemailer.transport'));
}

Mailer.prototype.sendMail = function (recipient, subject, text, html, callback) {
    var message = {
        from: 'no-reply@game-of-farms.ekylibre.com',
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    this.transport.sendMail(message, callback);
}

Mailer.prototype.destroy = function() {
    this.transport.close();
} 

module.exports = Mailer;
