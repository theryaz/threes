#!/bin/bash

npm run build

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 351575273764.dkr.ecr.us-east-1.amazonaws.com

docker build -t 351575273764.dkr.ecr.us-east-1.amazonaws.com/threes/server:$1 .
docker push 351575273764.dkr.ecr.us-east-1.amazonaws.com/threes/server:$1