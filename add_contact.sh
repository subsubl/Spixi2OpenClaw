#!/usr/bin/env bash
ADDRESS=$1
if [ -z "$ADDRESS" ]; then
  echo "Usage: ./add_contact.sh <IxianAddress>"
  exit 1
fi
curl -G --data-urlencode "address=$ADDRESS" "http://localhost:8001/addContact"
