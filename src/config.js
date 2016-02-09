const config = {
    port: process.env.PORT || 9000,
    pgUrl: process.env.PG_URL || 'postgres://localhost/abacash',
    nodeEnv: process.env.NODE_ENV || 'production',
    defaultCustomerRole: process.env.DEFAULT_CUSTOMER_ROLE || 'customer',
    nerd: {
        url: 'https://abakus.no/api/',
        apiKey: '689ee7683b8f28abf041a4df9c3a022679c58317'
    },
    secret: 'super-secret-abacash-secret',
    jwtExpiresIn: '7 days',
    // TODO: Use private key instead of secret?
    jwtSecret: process.env.JWT_SECRET || 'hemmelig'
};

export default config;
