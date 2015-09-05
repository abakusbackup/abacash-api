/**
 * Main application routes
 */
 
'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  app.use('/auth', require('./auth'));

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/systems', require('./api/system'));

  // There routes have a connectionManager middleware that changes the system database based on a cookie token.
  app.use('/api/products', require('./api/product'));
  app.use('/api/transactions', require('./api/transaction'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/auth', require('./api/authToken'));

  app.use(errors[404]);
};
