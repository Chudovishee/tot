#!/bin/bash

REVISION=`cat revision`
REVISION=$[ $REVISION + 1 ]
VERSION=`./version.sh`
[ "x$?" != "x0" ] && exit 1

FULL_VERSION="${VERSION}-${REVISION}"

BUILD_DIR="$(pwd)/tot_${FULL_VERSION}"

echo "build: ${FULL_VERSION}"
echo $REVISION > revision

docker image build ../ -t "tot:${FULL_VERSION}" \
  --build-arg USER_ID="$(id -u)"

docker run --user $(id -u) \
  -v "$(pwd)":"/tmp/build" \
  -e "VERSION=${VERSION}" \
  -e "REVISION=${REVISION}" \
  tot:$FULL_VERSION
