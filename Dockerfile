FROM node:12.13.1-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

COPY babel.config.js ./

RUN npm install

COPY ./src ./src

RUN npm run build


# RUNTIME IMAGE

FROM node:12.13.1-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080

CMD [ "npm", "start" ]