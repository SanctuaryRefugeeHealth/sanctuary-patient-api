# sanctuary-api

### Setup Dev Environment

Add `.env` file and copy contents of `.env.template` to it with appropriate values for these environment variables

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

### Run Locally
To run the API locally you need first to build and run docker container:

    docker-compose build
    docker-compose up

Then from a seperate terminal window you need to run `npm run dev` to watch the changes.

Now you can acess the API through `http://localhost:8080/api`.

### Docker Build Image

    docker build -t sanctuary/api .
