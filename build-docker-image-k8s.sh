#!/bin/bash
set -e

HOST=$1

# Validate inputs
if [ -z "$HOST" ]; then
    echo "Usage: $0 <host>"
    exit 1
fi

docker build -t algo-trial-frontend-k8s-local --build-arg NEXT_PUBLIC_API_URL="http://$HOST:8080/v1/" .
