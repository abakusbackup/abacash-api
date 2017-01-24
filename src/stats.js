import Influx from 'influx';
import config from './config';

const influx = config.influx ? new Influx.InfluxDB({
    host: config.influx,
    database: config.influxDatabase
}) : null;

export function createEvent(points) {
    return influx ? influx.writePoints(points) : Promise.resolve();
}

export function createDatabase() {
    return influx ? influx.createDatabase(config.influxDatabase) : Promise.resolve();
}
