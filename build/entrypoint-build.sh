#!/bin/bash
ARCH=`dpkg --print-architecture`
FULL_VERSION="${VERSION}-${REVISION}"
BUILD_DIR="$(pwd)/tot_${FULL_VERSION}_${ARCH}"

mkdir -p "${BUILD_DIR}/DEBIAN"
mkdir -p "${BUILD_DIR}/etc/tot/backend"
mkdir -p "${BUILD_DIR}/etc/nginx/conf.d/"
mkdir -p "${BUILD_DIR}/usr/bin"
mkdir -p "${BUILD_DIR}/usr/src/tot/backend"
mkdir -p "${BUILD_DIR}/usr/src/tot/frontend"
mkdir -p "${BUILD_DIR}/var/lib/tot"
mkdir -p "${BUILD_DIR}/var/log/tot"
mkdir -p "${BUILD_DIR}/lib/systemd/system"

cat ./templates/control.tmpl | \
	sed -e "s/<%version%>/${FULL_VERSION}/g" | \
	sed -e "s/<%arch%>/${ARCH}/g" \
	> "${BUILD_DIR}/DEBIAN/control"

cp -r /tot/frontend/dist/* "${BUILD_DIR}/usr/src/tot/frontend"
cp -r /tot/backend/src "${BUILD_DIR}/usr/src/tot/backend"
cp -r /tot/backend/node_modules "${BUILD_DIR}/usr/src/tot/backend"
cp /tot/backend/package.json "${BUILD_DIR}/usr/src/tot/backend"
cp -r /tot/backend/config/* "${BUILD_DIR}/etc/tot/backend"
cp ./templates/tot-backend.tmpl "${BUILD_DIR}/usr/bin/tot-backend"
cp ./templates/nginx.tmpl "${BUILD_DIR}/etc/nginx/conf.d/tot-backend.conf"
cp ./templates/tot-backend.service.tmpl "${BUILD_DIR}/lib/systemd/system/tot-backend.service"
cp ./templates/dirs.tmpl "${BUILD_DIR}/DEBIAN/dirs"
cp ./templates/postinst.tmpl "${BUILD_DIR}/DEBIAN/postinst"

fakeroot dpkg-deb --build "${BUILD_DIR}"

cp "${BUILD_DIR}.deb" /tmp/build
