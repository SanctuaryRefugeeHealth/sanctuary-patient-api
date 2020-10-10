import { twilioConfig } from "../config";

export const webhook = () => {
  const twilio = require("twilio");
  return twilio.webhook;
};

export const sendMessage = (phoneNumber, message) => {
  const twilio = require("twilio");
  const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  const countryCode = "+1";

  if (phoneNumber.length !== 10) {
    throw Error("Phone number must be 10 digits long.");
  }

  if (!/^\d+$/.test(phoneNumber)) {
    throw Error("Phone number must only contain digits.");
  }

  return client.messages.create({
    body: message,
    from: twilioConfig.number,
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
