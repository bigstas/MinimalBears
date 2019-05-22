#! /bin/sh
echo "Welcome!"

export MONGO_URL="nope"
export TEST_WATCH = 1

cd "$(dirname $0)"

meteor test --driver-package meteortesting:mocha --port 3100 "$@"