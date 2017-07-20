'use strict';

const nodemailer = require('nodemailer');

function Mailer() {

    this.transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'shinytext@gmail.com',
            pass: 'qyr4uco9'
        }
    });
}

Mailer.prototype.sendMail = function (recipient, subject, text, html) {
    var message = {
        from: 'Game Of Farms',
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    this.transport.sendMail(message);
}

Mailer.prototype.destroy = function() {
    this.transport.close();
    this.transport = null;
} 

module.exports = Mailer;