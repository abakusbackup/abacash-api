FROM node:6
MAINTAINER Abakus backup <backup@abakus.no>

# Create app directory
RUN mkdir -p /app
WORKDIR /app

EXPOSE 9000

# Copy application
COPY . /app

# Build image
RUN npm install yarn -g
RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn", "start"]
