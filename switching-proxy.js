var http = require('http'),
  request = require('request'),
  url = require('url');

var target = process.env.TARGET,
  nojsFallback = process.env.FALLBACK;

var app = http.createServer(function (req, resp) {
  if (!target) {
    return resp.end("No target set, `heroku config:add TARGET=http://t.com`");
  }
  if (!nojsFallback) {
    return resp.end("No nojsFallback set, `heroku config:add FALLBACK=http://t.com`");
  }

  var needsJsFallback = req.url.match(/[\?&](nojs=true|_escaped_url_fragment=)/);
  var host = (needsJsFallback) ? nojsFallback : target;

  req.headers.host = target.replace(/^https?:\/\//, '');
  var opts = {
      url: host + req.url,
      headers: req.headers
    };
  request(opts).pipe(resp);
});

var port = process.env.PORT || 8999;
app.listen(port, function () {
  console.log("Listening on " + port);
});
