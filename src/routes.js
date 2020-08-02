
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const Winston = require('winston');
const WinstonSNS = require('winston-sns');
const httpContext = require('express-http-context');
const createError = require('http-errors');

const swaggerDocument = require('../docs/v1/activityScheme.json');
const config = require('../config/general');
const logLevels = require('./constants/logLevels');

const Logger = require('./services/LogService');
const Activity = require('./controllers/activityController');

const logger = new Logger(Winston, WinstonSNS, config, httpContext, logLevels);
const TokenService = require('./services/validateTokenService');
const ActivityService = require('./services/activityService');
const RestService = require('./services/restService');
const restService = new RestService(axios, config);
const activityService = new ActivityService(config, restService);
const tokenService = new TokenService(axios);

const activityController = new Activity(
    logger,
    config,
    createError,
    tokenService,
    activityService,
);

// eslint-disable-next-line new-cap
const routes = express.Router();
routes.use('/docs', swaggerUi.serve);
routes.get('/docs', swaggerUi.setup(swaggerDocument));

routes.get('/activities',
    activityController
        .getActivities
        .bind(activityController));


routes.get('/health', function(req, res, next) {
  return res.status(200).json({status: 'UP'});
});

routes.get('/live', function(req, res, next) {
  return res.status(200).send({message: 'connected'});
});

routes.use(function(err, req, res, next) {
  res.status(err.status || 500).send({message: err.message});
});


module.exports = routes;
