#!/bin/bash

BACKEND_JSON="../backend/package.json"
SYSTEM_JSON="../system/package.json"
FRONTEND_JSON="../frontend/package.json"

VERSION=`/usr/bin/node -p -e "require (\"$BACKEND_JSON\"). version" 2>/dev/null`

VERSION_1=$(echo "${VERSION}" | cut -d '.' -f1)
VERSION_2=$(echo "${VERSION}" | cut -d '.' -f2)
VERSION_3=$(echo "${VERSION}" | cut -d '.' -f3)

[ "x$VERSION_1" = "x" -o "x$VERSION_2" = "x" -o  "x$VERSION_3" = "x" ] && echo "Failed to parse version" >&2 && exit 1

NEXT_VER3=$[ $VERSION_3 + 1 ]
NEXT_VER="$VERSION_1.$VERSION_2.$NEXT_VER3"

[ "x$1" != "x--inc" ] && echo $VERSION && exit 0

/usr/bin/sed -e "s,\"version\": \".*,\"version\": \"$NEXT_VER\"\,,g" -i $BACKEND_JSON
/usr/bin/sed -e "s,\"version\": \".*,\"version\": \"$NEXT_VER\"\,,g" -i $SYSTEM_JSON
/usr/bin/sed -e "s,\"version\": \".*,\"version\": \"$NEXT_VER\"\,,g" -i $FRONTEND_JSON
