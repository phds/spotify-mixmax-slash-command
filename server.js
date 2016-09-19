var express = require('express');
var cors = require('cors');

var app = express();

var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

app.get('/', function (req, res) {
  res.send('hello world');
});
app.get('/api/suggestions/', cors(corsOptions), require('./api/suggestions'));
app.get('/api/resolver/', cors(corsOptions), require('./api/resolver'));

app.listen(process.env.PORT || 1412);

module.exports = app;
