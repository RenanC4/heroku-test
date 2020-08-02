/**
 * @typedef {import('../services/LogService')} LogService
 * @typedef {import('../services/validateTokenService')} TokenService
 * @typedef {import('../services/activityService')} ActivityService
 * @typedef {import('http-errors').CreateHTTPError} CreateHTTPError
 * @typedef {import('axios')} axios
 * @typedef {import('moment')} moment
 *
 * @typedef {Object} Config
 */

/** Activity Controller Class */
module.exports = class activityController {
  /**
   *
   * @param {LogService} logger
   * @param {Config} config
   * @param {CreateHTTPError} createError
   * @param {TokenService} tokenService
   * @param {ActivityService} activityService
   *
   */
  constructor(logger, config, createError, tokenService, activityService) {
    this._loggerService = logger;
    this._logger = logger.logger();
    this._config = config;
    this._createError = createError;
    this._tokenService = tokenService;
    this._activityService = activityService;
  }
  // TODO revisar config
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @return {Array} retorna um array com as urls dos materias
   */
  async getActivities(req, res, next) {
    try {
      const {authorization} = req.headers;
      const {type, shortname} = req.query;

      if (!authorization || !type) {
        return next(
            this._createError(
                401,
                `params missing`,
            ),
        );
      }
      const url = this._config.validateToken.url;
      const userInformations =
        await this._tokenService.getToken(url, authorization);

      if (!userInformations||
          !userInformations.data ||
          !userInformations.data[0]) {
        return res.status(403).json(`Usuário não autorizado`);
      }
      const username = userInformations.data[0].username;
      const activities =
        await this._activityService
            .getActivitiesFromMoodle(username, type, shortname);
      if (!activities) {
        return res.status(204).json(
            `Não foram encontrados atividades para ${username}`,
        );
      }

      return res.status(200).json(activities);
    } catch (e) {
      return next(this._createError(500, e));
    }
  }
};
