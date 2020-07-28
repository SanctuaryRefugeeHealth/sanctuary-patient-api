module.exports = {
	port: process.env.PORT || 8080,
	bodyLimit: '100kb',
	corsHeaders: ['Link'],
	twilioConfig: {
		number: process.env.TWILIO_NUMBER,
		accountSid: process.env.TWILIO_ACCOUNT_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN
  },
  jwtConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtTokenExpiry: process.env.JWT_TOKEN_EXPIRY || 43200
  },
}
