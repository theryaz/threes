#!/bin/bash

npm run build

$(aws ecr get-login --no-include-email --region us-east-1)

docker build -t threes/server .
docker tag threes/server:latest 192407005904.dkr.ecr.us-east-1.amazonaws.com/threes/server:latest
docker push 192407005904.dkr.ecr.us-east-1.amazonaws.com/threes/server:latest