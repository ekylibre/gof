'use strict';

const nodemailer = require('nodemailer');

function Mailer() {

    this.transport = nodemailer.createTransport({
	sendmail: true,
	newline: 'unix',
	path: '/usr/sbin/sendmail'
    });
}

Mailer.prototype.sendMail = function (recipient, subject, text, html) {
    var message = {
        from: 'no-reply@game-of-farms.com',
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    this.transport.sendMail(message);
}

Mailer.prototype.destroy = function() {
    this.transport.close();
} 

module.exports = Mailer;
