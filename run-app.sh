#! /bin/sh
echo "Welcome!"
export POSTGRESQL_URL="postgres://127.0.0.1/minbears"
export PACKAGE_DIRS="$(dirname $0)/packages/"
export MONGO_URL="nope"

cd "$(dirname $0)"

meteor "$@"