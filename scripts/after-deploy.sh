#!/bin/bash
REPOSITORY=/home/ubuntu/build
sudo pm2 kill
cd $REPOSITORY

sudo rm -rf node_modules
sudo yarn install --frozen-lockfile
sudo npx prisma generate
sudo pm2 start dist