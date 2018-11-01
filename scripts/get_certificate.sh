#!/usr/bin/env bash

# Get certbot
wget https://dl.eff.org/certbot-auto
mv certbot-auto certbot
chmod a+x certbot
sudo ./certbot --debug

# Get certificate
./certbot certonly --webroot -w ./static -d ipfs.nikeshnazareth.com

# Create reference to keys in project directory
sudo chown -R ec2-user /etc/letsencrypt/
mkdir -p sslcert
ln -s -T /etc/letsencrypt/live/ipfs.nikeshnazareth.com/fullchain.pem sslcert/fullchain.pem
ln -s -T /etc/letsencrypt/live/ipfs.nikeshnazareth.com/privkey.pem sslcert/privkey.pem

# Renew certificate
certbot renew
