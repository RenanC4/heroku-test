require('dotenv/config');

module.exports = {
  moodle: {
    url: process.env.WS_MOODLE_URL,
    token: process.env.WS_MOODLE_TOKEN,
    function: process.env.WS_MOODLE_FUNCTION,
    format: process.env.WS_MOODLE_FORMAT,
  },
  validateToken: {
    url: process.env.TOKEN_VALIDATOR_URL,
  },
  app: {
    PORT: process.env.APP_PORT,
  },
  logger: {
    susbcriber: process.env.SUBSCRIBER,
    topic_arn: process.env.LOGGER_ARN,
    level: process.env.LEVEL,
  },
};
