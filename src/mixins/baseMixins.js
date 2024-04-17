export const baseMixin = {
  created() {},
  methods: {
    // 设置路由
    async toThisTag(path) {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      if (path) {
        this.$router.push({
          path,
        })
      } else {
        this.$router.go(-1)
      }
      return
    },
    // 返回上级
    back() {
      this.toThisTag()
    },
  },
}
