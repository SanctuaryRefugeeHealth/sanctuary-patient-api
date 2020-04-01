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

The API will be available on port 80 (`http://localhost:80/api/`).

### Docker Build Image

    docker build -t sanctuary/api .
