/**
 * @typedef {import('../services/restService')} RestService
 * @typedef {Object} Config
 */

/**
 * Activity Service Class
 */
module.exports = class ActivityService {
  /**
   *
   * @param {Config} config
   * @param {RestService} rest
   */
  constructor(config, rest) {
    this._restService = rest;
    this._config = config;
  }

  /**
   *
   * @param {String} username
   * @param {String} type
   * @param {String} shortname
   *  * @return {Array} retorna o que foi encontrado no moodle
   */
  async getActivitiesFromMoodle(username, type, shortname) {
    const paramsMoodleWS = [
      `wstoken=${this._config.moodle.token}`,
      `wsfunction=${this._config.moodle.function}`,
      `moodlewsrestformat=${this._config.moodle.format}`,
      `username=${username}`,
      `typeactivity=${type}`,
    ];
    if (shortname) {
      paramsMoodleWS.push(
          `shortname=${shortname}`,
      );
    }

    const url = `${this._config.moodle.url}?${paramsMoodleWS.join('&')}`;
    try {
      const activities = await this._restService.get(url, null);
      return activities.data;
    } catch (e) {
      return new Error(e.message);
    }
  }
};
