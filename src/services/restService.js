/** Res Service Class */
class RestService {
  /**
   *
   * @param {*} axios
   * @param {*} config
   */
  constructor(axios, config) {
    this._axios = axios;
    this._config = config;
  }
  /**
   *
   * @param {*} url
   * @param {*} headers
   * @return {*}
   */
  get(url, headers) {
    return this._axios.get(url, headers)
        .then(function(response) {
          return response;
        })
        .catch(function(e) {
          return e;
        });
  }

  /**
   *
   * @param {*} token
   * @return {*}
   */
  headers(token) {
    return {
      headers: {
        Authorization: token,
      },
    };
  }
}

module.exports = RestService;
