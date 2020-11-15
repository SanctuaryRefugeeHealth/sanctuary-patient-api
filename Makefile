# AWS credentials must be set via environment variable
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
# OR AWS_PROFILE

TAG                        := v1.0.1
CONTAINER_NAME             := sanctuary_api
IMG_NAME                   := sanctuary/api
REPOSITORY                 := 990864907642.dkr.ecr.ca-central-1.amazonaws.com
IMG                        := ${IMG_NAME}:${TAG}
LATEST                     := ${IMG_NAME}:latest
REPOSITORY_IMG             := ${REPOSITORY}/${IMG}
SERVER                     := ubuntu@ec2-52-60-78-19.ca-central-1.compute.amazonaws.com

build:
	@docker build -t ${IMG} -t ${LATEST} -t ${REPOSITORY_IMG} .

push:
	@docker push ${REPOSITORY_IMG}

login:
	@aws --profile sanctuary ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin ${REPOSITORY}

remote-migrate:
	ssh ${SERVER} "docker exec ${CONTAINER_NAME} yarn run migrate"

remote-deploy:
	ssh ${SERVER} "\
		aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin ${REPOSITORY} ;\
		docker pull ${REPOSITORY_IMG} ;\
		docker stop ${CONTAINER_NAME} ;\
		docker wait ${CONTAINER_NAME} ;\
		docker container rm ${CONTAINER_NAME} ;\
		docker run --name ${CONTAINER_NAME} -d -p 127.0.0.1:8080:8080/tcp --env-file /home/ubuntu/.env ${REPOSITORY_IMG} ;\
	"

deploy: build login push remote-deploy
