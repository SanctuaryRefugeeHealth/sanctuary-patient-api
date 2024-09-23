const isDevelopment = process.env.NODE_ENV === "development";

export const port = process.env.BACKEND_PORT || 8080;
export const protocol = isDevelopment ? "http" : "https";
export const bodyLimit = "100kb";
export const corsHeaders = ["Link"];
export const twilioConfig = {
  number: process.env.TWILIO_NUMBER,
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
};
export const jwtConfig = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtTokenExpiry: process.env.JWT_TOKEN_EXPIRY || 43200,
};
export const scheduler = {
  cron: "0 0 * * * *", // Run every hour
  timezone: "America/Toronto",
};
