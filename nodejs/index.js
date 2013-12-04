var http = require('http');

http.createServer(function (req, res) {
  res.write('Express.js application');
  res.end();
}).listen(3000);
