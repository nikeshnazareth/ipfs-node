#!/usr/bin/env bash

# The IPFS daemon keeps shutting down unexpectedly
# As an workaround, this script will periodically restart stopped IPFS or node processes
while :
do
    IPFS=`pgrep ipfs`
    SERVER=`pgrep node`

    if [ "${IPFS:-null}" = null ]; then
            echo -n "RESTARTING IPFS:"
            date
            ipfs daemon --init
    fi

    if [ "${SERVER:-null}" = null ]; then
            echo -n "RESTARTING NODE:"
            date
            cd /home/ec2-user/ipfs-node
            sudo npm run serve
    fi

    sleep 10
done