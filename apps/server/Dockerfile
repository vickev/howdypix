FROM node:alpine

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm i @howdypix/server \
    && apk del build-dependencies

COPY config config

CMD ./node_modules/.bin/howdypix-server start ./config/default.yaml