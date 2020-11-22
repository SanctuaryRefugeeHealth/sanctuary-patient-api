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
    
### Add a user

To add a user to the system, manually create an entry in the DB. Use https://repl.it/@KrisBraun/ScrawnyAgitatedBot to generate the password hash.

### Access the production DB

- Host: sanctuary-db.ckfr6vdnmy6d.ca-central-1.rds.amazonaws.com 
- Username: [your username from terraform]
- Database: sanctuary_db

### Deploy

First time setup:

- Make sure Docker is running
- Make sure there is a `[sanctuary]` section in `~/.aws/credentials` containing your AWS credentials (from the AWS console).
- You'll need an existing user to add your public SSH key to ~/.ssh/authorized_keys on ubuntu@ec2-52-60-78-19.ca-central-1.compute.amazonaws.com

Each time:

- Set `TAG` in `Makefile` (optional; you can redeploy using the previous version)
- `make deploy`
