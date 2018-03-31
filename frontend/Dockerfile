FROM node

RUN mkdir -p /usr/src/frontend

WORKDIR /usr/src/frontend

COPY ./package.json .
RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "copy-to-nginx"]
