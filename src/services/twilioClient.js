import { config } from "../config";

const twilio = require("twilio");
const countryCode = "+1";

export const webhook = twilio.webhook;

export const sendMessage = (phoneNumber, message) => {
  const client = twilio(
    config.twilioConfig.accountSid,
    config.twilioConfig.authToken
  );
  if (phoneNumber.length !== 10) {
    throw Error("Phone number must be 10 digits long.");
  }

  if (!/^\d+$/.test(phoneNumber)) {
    throw Error("Phone number must only contain digits.");
  }

  return client.messages.create({
    body: message,
    from: config.twilioConfig.number,
    to: `${countryCode}${phoneNumber}`,
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
