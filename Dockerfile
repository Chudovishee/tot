FROM debian

RUN apt-get update
RUN apt-get install -y dpkg debconf debhelper lintian curl
RUN apt-get upgrade -y

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs

RUN mkdir -p /tot/backend
RUN mkdir -p /tot/frontend

COPY ./backend/package.json /tot/backend
COPY ./frontend/package.json /tot/frontend

WORKDIR /tot/backend
RUN npm install --only=production

WORKDIR /tot/frontend
RUN npm install

COPY ./backend /tot/backend
COPY ./frontend /tot/frontend

RUN npm run build

RUN mkdir -p /tot/build
WORKDIR /tot/build
COPY ./build/templates ./templates
COPY ./build/entrypoint-build.sh .

ARG USER_ID
RUN chown -R ${USER_ID} /tot/build
CMD ["/tot/build/entrypoint-build.sh"]