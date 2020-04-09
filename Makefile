# AWS credentials must be set via environment variable
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
# OR AWS_PROFILE

NAME                       := sanctuary/api
REPOSITORY                 := 990864907642.dkr.ecr.ca-central-1.amazonaws.com
TAG                        := v0.0.1
IMG                        := ${NAME}:${TAG}
LATEST                     := ${NAME}:latest
REPOSITORY_IMG             := ${REPOSITORY}/${IMG}
LOGIN                      := $$(aws ecr get-login --no-include-email --region ca-central-1)

build:
	@docker build -t ${IMG} -t ${LATEST} -t ${REPOSITORY_IMG} .

push:
	@docker push ${REPOSITORY_IMG}

login:
	@${LOGIN}
