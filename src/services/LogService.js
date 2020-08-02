/**
 * Logger service class
 */
class LoggerService {
  /**
   * Log Service construtctor
   * @param {*} winston
   * @param {*} winstonSns
   * @param {*} config
   * @param {*} httpContext
   * @param {*} logLevels
   */
  constructor(winston, winstonSns, config, httpContext, logLevels) {
    this._winston = winston;
    this._winstonSns = winstonSns;
    this._config = config;
    this._httpContext = httpContext;
    this._logLevels = logLevels;
  }
  /**
 * @return {Object} logger
 */
  logger() {
    const options = {
      subscriber: this._config.logger.subscriber,
      topic_arn: this._config.logger.topic_arn,
      level: this._config.logger.level,
      json: true,
      message: '%m',
    };

    const snsTransport = new this._winstonSns(options);

    const logger = this._winston.createLogger({
      format: this._winston.format.combine(
          this._winston.format.timestamp(),
          this._winston.format.json(),
      ),
      defaultMeta: {
        service: 'ava30-microapp-extemporaneous-date',
        description: 'responsável pela criação de data extemporanea',
      },
      transports: [
        snsTransport,
        new this._winston.transports.Console(),
      ],
    });
    return logger;
  }
  /**
  * @return {Object}
  */
  gethttpContext() {
    return this._httpContext.get('requestId');
  }
  /**
  *@return {Object}
  */
  traceHeader() {
    return this._httpContext.get('traceHeaders');
  }
}

module.exports = LoggerService;
