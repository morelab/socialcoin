#!/bin/bash

# kubectl apply -f deployment.yaml --namespace socialcoin

function createConfigMaps() {
  # environment variables for api and database
  kubectl delete secret socialcoin-api-properties --namespace ${NS}
  kubectl create secret generic socialcoin-api-properties \
    --from-env-file=properties.env \
    --namespace ${NS}
  
  # create config map with config file for api
  # TODO

  # login to private registry
  kubectl delete secret socialcoin-registry --namespace ${NS}
  kubectl create secret generic socialcoin-registry \
    --from-file=.dockerconfigjson=/home/dani/.docker/config.json \
    --type=kubernetes.io/dockerconfigjson \
    --namespace=socialcoin
}

function main() {
  source deployment.env

  # create config maps
  createConfigMaps

  # deploy database
  kubectl apply -f kubernetes/database.yaml --namespace ${NS}
  kubectl wait --for=condition=available --timeout=600s deployment/socialcoin-api-database --namespace ${NS}

  # deploy api
  kubectl apply -f kubernetes/api.yaml --namespace ${NS}
  kubectl wait --for=condition=available --timeout=600s deployment/socialcoin-api-app --namespace ${NS}

  # deploy ingresss
  export subdomain=$subdomain
  kubectl apply -f <(envsubst < kubernetes/ingress.yaml) --namespace ${NS}
}

main