/** Token Service Class */
class tokenService {
  /**
   * Token service constructor
   * @param {axios} axios
   */
  constructor(axios) {
    this._axios = axios;
  }

  /**
 * @param {String} url
 * @param {String} token
 * @return {Object}
 */
  async getToken(url, token) {
    const headers = await this._headers(token);
    const userInformations = await this._axios.get(url, headers)
        .then(function(response) {
          return response;
        })
        .catch(function(e) {
          return e;
        });
    return userInformations.data;
  }

  /**
  * @param {String} token
  * @return {Object}
  */
  _headers(token) {
    return {
      headers: {
        Authorization: token,
      },
    };
  }
}

module.exports = tokenService;
