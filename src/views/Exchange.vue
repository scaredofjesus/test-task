<template>
  <v-row>
    <v-col>
      <v-card>
        <div v-infinite-scroll="load">
          <v-card>
            <v-card-title>
              {{ title }}
              <v-spacer></v-spacer>
              <v-text-field
                v-model="query"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              ref="list"
              :loading="isLoading"
              :headers="headers"
              :items="items"
              :search="query"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:item.rate="{ item }">
                {{ getPriceOrRateValue(item.priceQuote) }}
              </template>
              <template v-slot:item.priceUsd="{ item }">
                <span v-if="item.priceUsd !== null"
                  >${{ getPriceOrRateValue(item.priceUsd) }}</span
                >
                <span v-else>-</span>
              </template>
              <template v-slot:item.volumeUsd24Hr="{ item }">
                <span v-if="item.volumeUsd24Hr !== null">{{
                  $formatNumber(parseFloat(item.volumeUsd24Hr)).format(
                    "($0.00a)"
                  )
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:item.tradesCount24Hr="{ item }">
                <span v-if="item.tradesCount24Hr !== null">{{
                  $formatNumber(parseFloat(item.tradesCount24Hr)).format(
                    "(0,0)"
                  )
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:item.percentExchangeVolume="{ item }">
                <span v-if="item.percentExchangeVolume !== null"
                  >{{
                    parseFloat(item.percentExchangeVolume).toFixed(2)
                  }}%</span
                >
                <span v-else>-</span>
              </template>
              <template v-slot:item.pair="{ item }">
                {{ item.baseSymbol }}/{{ item.quoteSymbol }}
              </template>
              <template v-slot:item.chart="{ item }">
                <router-link
                  class="text-decoration-none"
                  :to="{
                    name: 'chart',
                    params: {
                      exchangeId: item.exchangeId,
                      baseId: item.baseId,
                      quoteId: item.quoteId
                    }
                  }"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </router-link>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Queue from "js-queue";
import tableMixin from "../mixins/table";

export default {
  name: "Exchange",

  mixins: [tableMixin],

  data() {
    return {
      headers: [
        { text: "Pair", value: "pair" },
        { text: "Rate", value: "rate", align: "right" },
        { text: "Price", value: "priceUsd", align: "right" },
        { text: "Trades (24Hr)", value: "tradesCount24Hr", align: "right" },
        { text: "Volume (24Hr)", value: "volumeUsd24Hr", align: "right" },
        { text: "Volume (%)", value: "percentExchangeVolume", align: "right" },
        { text: "Chart", value: "chart", align: "center" }
      ],
      params: {
        exchange: "",
        interval: "d1",
        baseId: "",
        quoteId: ""
      },
      exchange: {},
      tradeWs: null,
      queue: null,
      timeout: null
    };
  },

  computed: {
    ...mapGetters(["exchanges", "getExchangeById"]),

    title() {
      return (
        this.$route.params.exchangeId.charAt(0).toUpperCase() +
        this.$route.params.exchangeId.slice(1)
      );
    }
  },

  methods: {
    ...mapActions({
      action: "fetchMarkets",
      fetchRates: "fetchRates",
      fetchExchanges: "fetchExchanges"
    }),

    getPriceOrRateValue(value) {
      const limit = 8;
      const valueFl = parseFloat(value);
      if (valueFl < 1) {
        const valueStr = valueFl.toString().split(".")[1];
        if (valueStr && valueStr.length > limit) {
          return parseFloat(valueFl.toFixed(limit));
        }
        return valueFl;
      }
      return parseFloat(valueFl.toFixed(2));
    },

    rowClasses(item) {
      if (item.direction) {
        return item.direction;
      }
      return "";
    },

    updateMarkets(stack) {
      const items = this.$refs.list.$el.querySelectorAll("tbody tr");
      let itemsToFlash = [];

      stack.forEach(data => {
        const item = this.items.find(
          item => item.baseId === data.base && item.quoteId === data.quote
        );

        if (item) {
          const delta = (data.timestamp - item.updated) / 1000;
          if (delta > 5) {
            const itemRate = this.getPriceOrRateValue(item.priceQuote);
            const dataRate = this.getPriceOrRateValue(data.price);
            const itemPrice = this.getPriceOrRateValue(item.priceUsd);
            const dataPrice = this.getPriceOrRateValue(data.priceUsd);
            const update = itemRate !== dataRate || itemPrice !== dataPrice;
            const tr = items[this.items.indexOf(item)];

            if (update && tr) {
              tr.classList.add(data.direction);
              itemsToFlash.push(tr);
              item.updated = data.timestamp;
              item.priceQuote = data.price;
              item.priceUsd = data.priceUsd;
            }
          }
        }
      });

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        itemsToFlash.forEach(item => item.removeAttribute("class"));
        itemsToFlash = [];
        this.queue.next();
      }, 600);
    }
  },

  beforeDestroy() {
    this.$api.closeWs();
  },

  async created() {
    this.queue = new Queue();

    this.filters.exchangeId = this.$route.params.exchangeId;

    if (this.exchanges.length === 0) {
      await this.fetchExchanges();
    }

    this.exchange = this.getExchangeById(this.$route.params.exchangeId);

    if (this.exchange.socket) {
      this.tradeWs = this.$api.ws(`trades/${this.title.toLowerCase()}`);
      let stack = [];

      this.tradeWs.onmessage = msg => {
        const data = JSON.parse(msg.data);
        stack.push(data);
        if (stack.length === 150) {
          this.queue.add(() => this.updateMarkets(stack));
          stack = [];
        }
      };
    }
  }
};
</script>

<style lang="scss">
table tbody tr {
  transition: background 0.3s;
}
.sell {
  background: rgba(24, 198, 131, 0.25);
}
.buy {
  background: rgba(244, 67, 54, 0.25);
}
</style>
