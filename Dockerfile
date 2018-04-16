FROM node:9
MAINTAINER Abakus Webkom <webkom@abakus.no>

ARG RELEASE

RUN mkdir -p /app
WORKDIR /app

COPY yarn.lock yarn.lock
COPY package.json package.json
COPY src src

# Build image
RUN yarn
RUN yarn build

ENV NODE_ENV production
ENV RELEASE $RELEASE
ENTRYPOINT ["yarn", "start"]
