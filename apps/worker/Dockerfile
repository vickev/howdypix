FROM node:alpine

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm i @howdypix/worker \
    && apk del build-dependencies

COPY config config

CMD ./node_modules/.bin/howdypix-worker start ./config/default.yaml