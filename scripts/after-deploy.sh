#!/bin/bash
REPOSITORY=/home/ubuntu/build
sudo pm2 kill
cd $REPOSITORY
cd server
sudo rm -rf node_modules
sudo yarn install --frozen-lockfile
sudo pm2 start dist