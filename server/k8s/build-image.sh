#!/bin/bash

function main() {
  source deployment.env

  cd ..

  IMAGE_NAME="socialcoin-api" 
  IMAGE_TAG="latest"

  docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

  # upload to private registry
  REGISTRY_HOST="registry.apps.deustotech.eu"
  REGISTRY_NS="socialcoin"

  docker login \
    --username='socialcoin' \
    --password=${REGISTRY_SECRET} \
    $REGISTRY_HOST

  docker tag ${IMAGE_NAME}:${IMAGE_TAG} "${REGISTRY_HOST}"/"${REGISTRY_NS}"/${IMAGE_NAME}:${IMAGE_TAG}
  docker push "${REGISTRY_HOST}"/"${REGISTRY_NS}"/${IMAGE_NAME}:${IMAGE_TAG}
}

main