module.exports = {
	port: 8080,
	bodyLimit: '100kb',
	corsHeaders: ['Link'],
	twilioConfig: {
		number: process.env.TWILIO_PHONE_NUMBER,
		accountSid: process.env.TWILIO_ACCOUNT_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN
	}
}
