import Vue from "vue";
import Vuex from "vuex";
import api from "../api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    markets: [],
    exchanges: []
  },

  mutations: {
    SET_MARKETS(state, payload) {
      state.markets = payload;
    },

    SET_EXCHANGES(state, payload) {
      state.exchanges = payload;
    }
  },

  getters: {
    markets(state) {
      return state.markets;
    },

    exchanges(state) {
      return state.exchanges;
    },

    getExchangeById: state => id => {
      return state.exchanges.find(exchange => exchange.exchangeId === id);
    }
  },

  actions: {
    fetchMarkets({ commit }, params = {}) {
      return api.get("markets", { params }).then(res => {
        const response = res.data === undefined ? [] : res.data;
        commit("SET_MARKETS", response);
        return response;
      });
    },

    fetchExchanges({ commit }, params = {}) {
      return api.get("exchanges", { params }).then(res => {
        const response = res.data === undefined ? [] : res.data;
        commit("SET_EXCHANGES", response);
        return response;
      });
    }
  }
});
