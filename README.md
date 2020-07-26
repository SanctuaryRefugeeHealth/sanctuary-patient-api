# sanctuary-api

### Setup Dev Environment

Add `.env` file and copy contents of `.env.template` to it with appropriate values for these environment variables

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

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

  In subsequent requests, add the token from the response of the above request to your headers

    Authorization: Bearer `token`

### Deploy

    - Set `TAG` in `Makefile`.
    - `make deploy`
