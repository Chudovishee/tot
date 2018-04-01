FROM node

RUN mkdir -p /usr/src/backend
RUN mkdir -p /var/lib/backend
RUN mkdir -p /var/log/backend

WORKDIR /usr/src/backend

COPY ./package.json .
COPY ./config /etc/backend
RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]
