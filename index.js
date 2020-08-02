const bodyParser = require('body-parser');
const express = require('express');
const httpContext = require('express-http-context');
const routes = require('./routes');
const cors = require('cors');
const app = express();
const config = require('../config/general');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(httpContext.middleware);
app.use((req, res, next) => {
  const headers = req.headers || {};
  const traceHeaders = {
    'x-request-id': headers['x-request-id'] || '',
    'x-b3-traceid': headers['x-b3-traceid'] || '',
    'x-b3-parentspanid': headers['x-b3-parentspanid'] || '',
    'x-b3-spanid': headers['x-b3-spanid'] || '',
    'x-b3-sampled': headers['x-b3-sampled'] || '',
    'x-b3-flags': headers['x-b3-flags'] || '',
    'x-ot-span-context': headers['x-ot-span-context'] || '',
  };
  httpContext.set('traceHeaders', traceHeaders);
  httpContext.set('requestId', traceHeaders['x-request-id']);
  next();
});
app.use(routes);

app.listen(config.app.PORT, (err) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  console.log(`listening on port: ${config.app.PORT}`);
});
