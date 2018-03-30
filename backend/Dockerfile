FROM node

RUN mkdir -p /usr/src/backend
RUN mkdir -p /var/log/backend

WORKDIR /usr/src/backend

COPY ./config /etc/backend
COPY ./package.json .
RUN npm install

COPY ./src ./src
COPY ./index.js .

ENTRYPOINT ["npm", "start"]
