FROM node:alpine

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm i @howdypix/webapp \
    && apk del build-dependencies

COPY config config

CMD DEBUG=app:*,-lib:* ./node_modules/.bin/howdypix-webapp start ./config/default.yaml