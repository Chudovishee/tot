FROM node

RUN mkdir -p /usr/src/backend
RUN mkdir -p /var/lib/backend
RUN mkdir -p /var/log/backend

WORKDIR /usr/src/backend

COPY ./package.json .
RUN npm install

COPY ./config /etc/backend
COPY ./index.js .
COPY ./src ./src

ENTRYPOINT ["npm", "start"]
