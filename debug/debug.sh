#!/bin/bash

REVISION=`cat ../build/revision`
VERSION=`../build/version.sh`
[ "x$?" != "x0" ] && exit 1

FULL_VERSION="${VERSION}-${REVISION}"

echo "debug: ${FULL_VERSION}"

mkdir -p "$(pwd)/data/var/lib/tot"
mkdir -p "$(pwd)/data/var/lib/prometheus"
mkdir -p "$(pwd)/data/var/log/tot"
mkdir -p "$(pwd)/data/etc/tot/backend"
mkdir -p "$(pwd)/data/etc/tot/system"
mkdir -p "$(pwd)/data/etc/nginx/conf.d/"

cp -r -n ../backend/config/* "$(pwd)/data/etc/tot/backend"
if [[ ! -e "$(pwd)/data/etc/tot/backend/local.json" ]]; then
  echo "{}" > "$(pwd)/data/etc/tot/backend/local.json"
fi

cp -r -n ../system/config/* "$(pwd)/data/etc/tot/system"
if [[ ! -e "$(pwd)/data/etc/tot/system/local.json" ]]; then
  echo "{}" > "$(pwd)/data/etc/tot/system/local.json"
fi

cp ../build/templates/nginx.tmpl "$(pwd)/data/etc/nginx/conf.d/tot-backend.conf"

docker image build -f ../Dockerfile.debug -t "tot_debug:${FULL_VERSION}" ../

docker run -it --rm \
  -p 8888:8888 \
  -p 8080:8080 \
  -p 8081:8081 \
  -p 9229:9229 \
  -p 9090:9090 \
  -v "$(pwd)/data/var/lib/tot":"/var/lib/tot" \
  -v "$(pwd)/data/var/lib/prometheus":"/var/lib/prometheus" \
  -v "$(pwd)/data/var/log/tot":"/var/log/tot" \
  -v "$(pwd)/data/etc/tot/backend":"/etc/tot/backend" \
  -v "$(pwd)/data/etc/tot/system":"/etc/tot/system" \
  -v "$(pwd)/data/etc/nginx/conf.d":"/etc/nginx/conf.d" \
  -v "$(pwd)/../backend/src":"/tot/backend/src" \
  -v "$(pwd)/../backend/test":"/tot/backend/test" \
  -v "$(pwd)/../system/src":"/tot/system/src" \
  -v "$(pwd)/../system/test":"/tot/system/test" \
  -v "$(pwd)/../frontend/src":"/tot/frontend/src" \
  -v "$(pwd)/../frontend/src":"/tot/frontend/test" \
  --name tot_debug \
  "tot_debug:$FULL_VERSION"
