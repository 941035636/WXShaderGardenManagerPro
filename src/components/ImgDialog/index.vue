<template>
  <div id="imgDialog">
    <el-dialog
      width="600px"
      title=""
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="enlarge-img">
        <img :src="imgSrc" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ImgDialog',
    components: {},
    data() {
      return {
        innerVisible: false,
        imgSrc: '',
      }
    },
    mounted() {},
    methods: {
      open(url) {
        this.imgSrc = url
        this.innerVisible = true
      },
    },
  }
</script>

<style scoped lang="scss">
  .enlarge-img {
    width: 560px;
    height: 580px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
