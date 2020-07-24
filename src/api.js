import axios from "axios";

export default {
  apiUrl: "https://api.coincap.io/v2/",
  wsUrl: "wss://ws.coincap.io/",

  wsConnection: null,

  ws(endpoint) {
    this.wsConnection = new WebSocket(`${this.wsUrl}${endpoint}`);
    return this.wsConnection;
  },

  closeWs() {
    this.wsConnection.close();
  },

  request(method, endpoint, params = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    return axios[method](url, params)
      .then(({ data }) => data)
      .catch(e => Promise.reject(e));
  },

  async get(endpoint, params = {}) {
    return this.request("get", endpoint, params);
  }
};
