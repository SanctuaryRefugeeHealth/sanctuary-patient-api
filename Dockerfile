FROM node:18.20.4-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./src ./src

COPY babel.config.js ./

RUN npm run build


# RUNTIME IMAGE

FROM node:18.20.4-alpine as prod

WORKDIR /app

COPY package.json ./

COPY knex* ./

COPY migrations ./migrations

COPY wait-for.sh ./

COPY --from=build /app/node_modules node_modules

COPY --from=build /app/dist dist

EXPOSE 8080

CMD ["node", "dist"]
