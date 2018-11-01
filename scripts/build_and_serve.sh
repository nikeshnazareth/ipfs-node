#!/usr/bin/env bash

# remove the logs from the previous build
rm log/*

# Forward http traffic to our web server
sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 3000

# Create acme-challenge directory
mkdir -p static/.well-known/acme-challenge

# launch the express server
node www