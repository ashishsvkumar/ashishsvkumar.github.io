#!/usr/bin/env bash

cd /var/www/current/dist

pm2 stop all
sleep 3

pm2 delete all
sleep 3
