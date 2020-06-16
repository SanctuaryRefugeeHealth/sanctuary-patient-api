# sanctuary-api

### Setup Dev Environment

Add `.env` file and copy contents of `.env.template` to it with appropriate values for these environment variables

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

### Run Locally
To run the API locally you need first to build and run docker container:

    docker-compose up --build

### Docker Build Image

    docker build -t sanctuary/api .
    
### Publish the Image

Locally:
```
aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin 990864907642.dkr.ecr.ca-central-1.amazonaws.com
docker tag <image_id> 990864907642.dkr.ecr.ca-central-1.amazonaws.com/sanctuary/api
docker push 990864907642.dkr.ecr.ca-central-1.amazonaws.com/sanctuary/api
```
On server:
```
ssh ubuntu@ec2-52-60-78-19.ca-central-1.compute.amazonaws.com
aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin 990864907642.dkr.ecr.ca-central-1.amazonaws.com
docker pull 990864907642.dkr.ecr.ca-central-1.amazonaws.com/sanctuary/api:latest
docker run <image_id>
```

### Access the API

    npm run seed
    POST http://localhost:80/api/auth
    {
      "email": "one@test.com",
      "password": "sanctuary"
    }

  In subsequent requests, add the token from the response of the above request to your headers

    Authorization: Bearer `token`
