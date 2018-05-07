#!/usr/bin/env bash

if [ -z "$1" ]; then
    IMAGE_VERSION="v`date +%y.%m.%d`"
else
    IMAGE_VERSION="v`date +%y.%m.%d`.$1"
fi

SERVER="reg.birdytone.com:5000"

NAME=${PWD##*/}

echo docker build $SERVER/$NAME:$IMAGE_VERSION

docker build -t $SERVER/$NAME:$IMAGE_VERSION .
docker push $SERVER/$NAME:$IMAGE_VERSION
