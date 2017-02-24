export default {
    port: process.env.PORT || 9000,
    web: process.env.WEB_URL || 'localhost:4000',
    pgUrl: process.env.PG_URL || 'postgres://abacash:@localhost/abacash',
    nodeEnv: process.env.NODE_ENV || 'development',
    defaultCustomerRole: process.env.DEFAULT_CUSTOMER_ROLE || 'customer',
    nerd: {
        url: process.env.NERD_URL || 'https://abakus.no/api/',
        apiKey: process.env.NERD_TOKEN
    },
    secret: process.env.SECRET || 'secret',
    jwtExpiresIn: process.env.JWT_EXPIRE || '7 days',
    jwtSecret: process.env.JWT_SECRET || 'hemmelig',
    smtpUrl: process.env.SMTP_URL || 'smtp://127.0.0.1:25',
    sentryDsn: process.env.SENTRY_DSN || null,
    influx: process.env.INFLUX || null,
    influxDatabase: process.env.INFLUX_DATABASE || 'abacash',
    databaseVersion: process.env.PG_VERSION | '9.5'
};
