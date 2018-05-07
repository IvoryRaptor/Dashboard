#!/bin/bash


Version=v18.1.23

echo start build Version: $Version

docker build -t reg.libratone.com/cloudadmin:$Version .

docker push reg.libratone.com/cloudadmin:$Version
