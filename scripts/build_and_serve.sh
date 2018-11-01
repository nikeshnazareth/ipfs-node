#!/usr/bin/env bash

# remove the logs from the previous build
rm log/*

# Forward http traffic to our web server
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000

# launch the express server
node www