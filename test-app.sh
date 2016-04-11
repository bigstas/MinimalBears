#! /bin/sh
export POSTGRESQL_URL="postgres://127.0.0.1/minbears"
export PACKAGE_DIRS="$(dirname $0)/packages/"
export MONGO_URL="nope"

cd "$(dirname $0)"

meteor test --driver-package practicalmeteor:mocha --port 3001 "$@"