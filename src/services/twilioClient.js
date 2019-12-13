'use strict';

const { twilioConfig } = require('../config');

const client = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

const sendMessage = function(phoneNumber, message) {

    return client.messages
        .create({
            body: message,
            from: twilioConfig.number,
            to: phoneNumber
        });
};

exports.sendMessage = sendMessage;
