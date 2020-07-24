<template>
  <v-snackbar v-model="snackbar" bottom :color="status" :timeout="5000">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      text: "",
      status: ""
    };
  },

  created() {
    this.$bus.$on("snackbar", ({ status, text }) => {
      this.status = status ? status : "success";
      this.text = text;
      this.snackbar = true;
    });
  }
};
</script>
