import { twilioConfig } from "../config";

const twilio = require("twilio");

export const webhook = twilio.webhook;

export const sendMessage = (phoneNumber, message) => {
  const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

  return client.messages.create({
    body: message,
    from: twilioConfig.number,
    to: phoneNumber,
  });
};

export const getMessageResponse = (
  message = "Thank you for your confirmation!"
) => {
  const MessagingResponse = require("twilio").twiml.MessagingResponse;
  const twiml = new MessagingResponse();
  twiml.message(message);

  return twiml.toString();
};
