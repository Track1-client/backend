#!/bin/bash
REPOSITORY=/home/ubuntu/build
sudo pm2 kill
cd $REPOSITORY

sudo yarn install --frozen-lockfile
sudo npx prisma generate
sudo pm2 start dist