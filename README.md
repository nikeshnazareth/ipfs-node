# IPFS REST INTERFACE

## Overview

I am currently running an IPFS node on an Amazon EC2 instance.

This project is a web server running on the same instance to provide a REST interface that adds json to the IPFS node (pinned)

## Build and Deploy

1. Run the `initialise.sh` script
1. Use the npm script commands to build/serve the server

## Extend

1. Add new routes to `server.js` appropriate
1. Update the `api/api.yaml` file to match

## Client usage

The Amazon instance is available at https://ipfs.nikeshnazareth.com

The swagger documentation is available at `/api`