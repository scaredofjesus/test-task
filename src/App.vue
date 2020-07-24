<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn to="/" text>
        Exchanges
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <snackbar />
  </v-app>
</template>

<script>
import Snackbar from "./components/Snackbar";

export default {
  name: "App",

  components: {
    Snackbar
  },

  data() {
    return {
      drawer: false
    };
  }
};
</script>
