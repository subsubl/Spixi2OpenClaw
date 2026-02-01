#!/usr/bin/env bash
RECIPIENT=$1
MESSAGE=$2
curl -G --data-urlencode "address=$RECIPIENT" --data-urlencode "message=$MESSAGE" --data-urlencode "channel=0" "http://localhost:8001/sendChatMessage"
