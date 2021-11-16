const Joi = require("@hapi/joi");
const isDevelopment = process.env.NODE_ENV === "development";

const config = {
  port: process.env.PORT || 8080,
  protocol: isDevelopment ? "http" : "https",
  bodyLimit: "100kb",
  corsHeaders: ["Link"],
  twilioConfig: {
    number: process.env.TWILIO_NUMBER,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
  jwtConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtTokenExpiry: process.env.JWT_TOKEN_EXPIRY || "43200",
  },
  scheduler: {
    cron: "0 0 * * * *", // Run every hour
    timezone: "America/Toronto",
  },
};

module.exports.config = config;

module.exports.validateConfig = () => {
  const { error } = Joi.object({
    port: Joi.number().required(),
    protocol: Joi.string().required().valid("http", "https"),
    bodyLimit: Joi.string().required(),
    corsHeaders: Joi.array().items(Joi.string()).required(),
    twilioConfig: Joi.object({
      number: Joi.string().required(),
      accountSid: Joi.string().required(),
      authToken: Joi.string().required(),
    }).required(),
    jwtConfig: Joi.object({
      jwtSecret: Joi.string().required(),
      jwtTokenExpiry: Joi.string().required(),
    }).required(),
    scheduler: Joi.object({
      cron: Joi.string().required(),
      timezone: Joi.string().required(),
    }).required(),
  }).validate(config);

  if (error) throw new Error(error.message);
};
