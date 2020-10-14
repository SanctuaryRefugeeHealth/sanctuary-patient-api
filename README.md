# sanctuary-api

### Setup Dev Environment

Add `.env` file and copy contents of `.env.template` to it with appropriate values for these environment variables

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

For testing Twilio replies locally use [ngrok](https://www.twilio.com/blog/2013/10/test-your-webhooks-locally-with-ngrok.html).

### Run Locally
To run the API locally you need first run `npm install`.

Then to build and run the docker container:

    docker-compose up --build

The API will be available on port 8080 (`http://localhost:8080/api/`).

### Access the API

    npm run seed
    POST http://localhost:8080/api/auth
    {
      "email": "one@test.com",
      "password": "sanctuary"
    }

In subsequent requests, add the token from the response of the above request to your headers:

    Authorization: Bearer `token`

### Access the production DB

- Host: sanctuary-db.ckfr6vdnmy6d.ca-central-1.rds.amazonaws.com 
- Username: [your username from terraform]
- Database: sanctuary_db

### Deploy

- Make sure Docker is running
- Make sure there is a `[sanctuary]` section in `~/.aws/credentials` containing your AWS credentials (from the AWS console).
- Set `TAG` in `Makefile` (optional; you can redeploy using the previous version)
- `make deploy`
