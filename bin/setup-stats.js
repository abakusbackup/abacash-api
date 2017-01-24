/*
 * Use this script to configure grafana and influxdb in dev.
 * You should setup the grafana backend and dashboard manually when running
 * in production.
 */

import 'isomorphic-fetch';
import config from '../src/config';
import { createDatabase } from '../src/stats';

const influx = config.influx;
const dashboard = require('../dashboard.json');
const grafanaBaseUrl = 'http://admin:admin@127.0.0.1:3000/api';

if (!influx) {
    throw new Error('You need to set the influx property in src/config.');
}

/**
 * Create the InfluxDB datasource in grafana.
 */
const createDatasource = () => fetch(`${grafanaBaseUrl}/datasources`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'abacash',
        type: 'influxdb',
        url: 'http://influxdb:8086',
        access: 'proxy',
        basicAuth: false,
        database: 'abacash',
        isDefault: true
    })
});

/**
 * Upload the dashboard to grafana.
 */
const createDashboard = () => fetch(`${grafanaBaseUrl}/dashboards/db`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        overwrite: true,
        dashboard
    })
});

createDatabase()
    .then(createDatasource)
    .then(createDashboard)
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
