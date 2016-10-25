#! /bin/sh
echo "Welcome!"

export MONGO_URL="nope"

cd "$(dirname $0)"

meteor "$@"