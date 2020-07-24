<template>
  <v-row>
    <v-col>
      <div v-infinite-scroll="load">
        <v-card>
          <v-card-title>
            Exchanges
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
            class="row-pointer"
            :loading="isLoading"
            :headers="headers"
            :items="items"
            :search="query"
            @click:row="details"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item.tradesCount24Hr="{ item }">
              <span v-if="item.tradesCount24Hr !== null">{{
                $formatNumber(parseFloat(item.tradesCount24Hr)).format("(0,0)")
              }}</span>
              <span v-else>-</span>
            </template>
            <template v-slot:item.percentTotalVolume="{ item }">
              <span v-if="item.percentTotalVolume !== null"
                >{{ parseFloat(item.percentTotalVolume).toFixed(2) }}%</span
              >
              <span v-else>-</span>
            </template>
            <template v-slot:item.volumeUsd="{ item }">
              <span v-if="item.volumeUsd !== null">{{
                $formatNumber(parseFloat(item.volumeUsd)).format("($0.00a)")
              }}</span>
              <span v-else>-</span>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import tableMixin from "../mixins/table";

export default {
  name: "Exchanges",

  mixins: [tableMixin],

  data() {
    return {
      headers: [
        { text: "Rank", value: "rank" },
        { text: "Name", value: "name" },
        { text: "Trading pairs", value: "tradingPairs", align: "right" },
        { text: "Volume", value: "volumeUsd", align: "right" },
        { text: "Total (%)", value: "percentTotalVolume", align: "right" }
      ]
    };
  },

  methods: {
    ...mapActions({
      action: "fetchExchanges"
    }),

    details(value) {
      this.$router.push({
        name: `exchange`,
        params: {
          exchangeId: value.exchangeId
        }
      });
    }
  }
};
</script>

<style lang="scss">
.row-pointer tbody tr:hover {
  cursor: pointer;
}
</style>
