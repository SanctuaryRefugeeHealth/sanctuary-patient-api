# sanctuary-api

### Setup Dev Environment

Add `.env` file with appropriate values for these environment variables

```
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
```

### Run Locally

    docker-compose build
    docker-compose up

### Docker Build Image

    docker build -t sanctuary/api .
