# AbaCash API [![Build Status](https://ci.abakus.no/api/badges/abakusbackup/abacash-api/status.svg)](https://ci.abakus.no/abakusbackup/abacash-api) [![Coverage Status](https://coveralls.io/repos/github/abakusbackup/abacash-api/badge.svg?branch=master)](https://coveralls.io/github/abakusbackup/abacash-api?branch=master)

> Node backend for AbaCash

## Setup
Install npm modules
```bash
npm install -g yarn
yarn
```

## Getting Started
```bash
# Start required backend services with docker-compose
$ docker-compose up

# With reloading (development):
$ yarn start:watch

# Or without reloading (production):
$ yarn build
$ yarn start
```

## Tests
```bash
$ yarn test
```

To run tests with file watch:
```bash
$ yarn test:watch
```

To run a test a subset of the tests:
```bash
$ yarn test -- -g *pattern*
```
Here, *pattern* is a regex for the test descriptions. This also works on `yarn test:watch`.

## Linting
ESLint is used to maintain high code quality and a unified code style.
To run the linter, use:

```bash
$ yarn lint
```

## Load database with test data
```
$ yarn load-db
```
Will fill the `abacash` postgres database with fixtures from `./fixtures/`. Connection string can be set by setting environment variable `PG_URL`. Contents in the `fixtures` are not (and should not be) used for automatic testing, which means the fixtures can be edited to test the client.

## Setup the stats backend
```
$ yarn setup-stats
```
This command prepares InfluxDB and Grafana for stats ingestion.
You can visit Grafana at http://127.0.0.1:3000. Credentials admin:admin.
