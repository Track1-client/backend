#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo yarn install --frozen-lockfile

sudo pm2 start dist