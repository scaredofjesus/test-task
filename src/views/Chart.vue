<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="interval"
            :items="intervals"
            item-text="name"
            item-value="id"
            label="Interval"
          ></v-select>
        </v-col>
      </v-row>
      <v-card>
        <div id="chart" class="chart"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Highcharts from "highcharts/highstock";

export default {
  data() {
    return {
      params: {
        exchange: "",
        interval: "",
        baseId: "",
        quoteId: ""
      },
      chartData: [],
      intervals: [
        {
          id: "m1",
          name: "One Minute"
        },
        {
          id: "m5",
          name: "Five Minutes"
        },
        {
          id: "m15",
          name: "Fifteen Minutes"
        },
        {
          id: "m30",
          name: "Thirty Minutes"
        },
        {
          id: "h1",
          name: "One Hour"
        },
        {
          id: "h2",
          name: "Two Hours"
        },
        {
          id: "h4",
          name: "Four Hours"
        },
        {
          id: "h8",
          name: "Eight Hours"
        },
        {
          id: "h12",
          name: "Twelve Hours"
        },
        {
          id: "d1",
          name: "One Day"
        },
        {
          id: "w1",
          name: "One Week"
        }
      ],
      interval: "w1"
    };
  },

  computed: {
    title() {
      return `${this.params.exchange} | ${this.params.baseId}/${this.params.quoteId}`;
    }
  },

  methods: {
    fetchMarketByExchangeId() {
      return this.$api
        .get("markets", {
          params: this.$route.params
        })
        .then(res => {
          return res.data[0] ? res.data[0] : {};
        })
        .catch(() => {
          this.$bus.$emit("snackbar", {
            text: "There was an error obtaining market information",
            status: "red"
          });
        });
    },

    fetchCandles() {
      return this.$api
        .get("candles", {
          params: this.params
        })
        .then(res => {
          return res.data;
        })
        .catch(() => {
          this.$bus.$emit("snackbar", {
            text: "There was an error obtaining chart data",
            status: "red"
          });
        });
    },

    renderChart() {
      Highcharts.stockChart("chart", {
        rangeSelector: {
          selected: 2
        },
        title: {
          text: this.title
        },
        series: [
          {
            type: "candlestick",
            name: this.title,
            data: this.chartData
          }
        ]
      });
    },

    async initChart() {
      this.params.interval = this.interval;
      const data = await this.fetchCandles();
      this.chartData = data.map(item => {
        const open = parseFloat(item.open);
        const high = parseFloat(item.high);
        const low = parseFloat(item.low);
        const close = parseFloat(item.close);
        const volume = parseFloat(item.volume);
        return [item.period, open, high, low, close, volume];
      });
      this.renderChart();
    }
  },

  async created() {
    const exchange = await this.fetchMarketByExchangeId();
    this.params.exchange = exchange.exchangeId;
    this.params.baseId = exchange.baseId;
    this.params.quoteId = exchange.quoteId;
    this.initChart();
  },

  watch: {
    interval() {
      this.initChart();
    }
  }
};
</script>

<style lang="scss">
.chart {
  width: 100%;
  height: 400px;
}
</style>
