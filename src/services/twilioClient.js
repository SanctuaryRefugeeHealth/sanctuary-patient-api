import { twilioConfig } from "../config";

const twilio = require("twilio")
const client = twilio(
  twilioConfig.accountSid,
  twilioConfig.authToken
);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const countryCode = "+1";

export const webhook = twilio.webhook;

export const sendMessage = (phoneNumber, message) => {
  if (phoneNumber.length !== 10) {
    throw Error("Phone number must be 10 digits long.");
  }

  if (!/^\d+$/.test(phoneNumber)) {
    throw Error("Phone number must only contain digits.");
  }

  console.log(phoneNumber);

  return client.messages.create({
    body: message,
    from: twilioConfig.number,
    to: `${countryCode}${phoneNumber}`,
  });
};

export const getMessageResponse = (
  message = "Thank you for your confirmation!"
) => {
  const twiml = new MessagingResponse();
  twiml.message(message);

  return twiml.toString();
};
