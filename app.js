// Dependent modules
const app = require('express')();
const http = require('http').Server(app);
const socket = require('./lib/socket')(http);
const tier = require('config').get('tier');
const config = require('config').get(tier);

// Default route (if no route provided in url)
app.use('/', function (req, res) {
  res.send('Sample Chat Server');
});

// How we start listening will depend on whether we are in development or not
if (tier === 'development') {
  // For development, run on port 3000
  http.listen(3000, function () {
    if (!process.testing) { // Avoid unnecessary log output when unit testing
      console.log('Example app listening on port 3000!');
    }
  });
} else {
  // Otherwise, let the host provide the port
  http.listen(process.env.PORT);
}
http.emit('serverStarted');

module.exports = app;
