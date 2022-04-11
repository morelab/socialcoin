#!/bin/bash

# convert docker-compose into k8s resources
kompose convert --volumes hostPath -o k8s

# deploy to cluster
kubectl apply -f k8s/