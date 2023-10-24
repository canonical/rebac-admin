# syntax=docker/dockerfile:experimental

# Build stage: Install yarn dependencies
# ===
FROM node:20 AS yarn-dependencies

WORKDIR /srv

COPY .yar[n] ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn config set httpProxy $HTTP_PROXY
RUN yarn config set httpsProxy $HTTPS_PROXY
RUN yarn install

# Build stage: Run "yarn run build-js"
# ===
FROM yarn-dependencies AS build-js
ADD . .
RUN yarn run build-demo

ENTRYPOINT ["./entrypoint"]
