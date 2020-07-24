export default {
  data() {
    return {
      hasMore: true,
      isLoading: false,
      perPage: 20,
      currentPage: 0,
      items: [],
      query: "",
      filters: {}
    };
  },

  methods: {
    load() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;

      const data = {
        ...this.filters,
        limit: this.perPage,
        offset: this.perPage * this.currentPage
      };

      this.action(data)
        .then(res => {
          this.isLoading = false;
          this.hasMore = res.length >= this.perPage;
          this.items = [...this.items, ...res];
          if (this.hasMore) this.currentPage++;
        })
        .catch(e => {
          this.isLoading = false;
          this.hasMore = false;
          let message = "Something went wrong";
          if (e.response && e.response.data) {
            message = e.response.data;
          }
          this.$bus.$emit("snackbar", {
            text: message,
            status: "red"
          });
        });
    }
  }
};
