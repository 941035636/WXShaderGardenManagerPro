<template>
  <div id="moreCon">
    <span v-if="data && data.length > length">
      {{ data.slice(0, length) }}...
      <el-popover placement="top" width="300" v-model="visible">
        <p>{{ data }}</p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="mini" @click="visible = false">
            确定
          </el-button>
        </div>
        <el-button type="text" class="downloadfile ml5" slot="reference">
          更多
        </el-button>
      </el-popover>
    </span>

    <span v-else>{{ data }}</span>
  </div>
</template>

<script>
export default {
  name: 'Label1',
  props: {
    data: {
      type: String,
      default: () => {
        return ''
      },
    },
    length: {
      type: Number,
      default: () => {
        return 10
      },
    },
  },
  data() {
    return {
      visible: false,
    }
  },
}
</script>

<style lang="scss" scoped>
#moreCon {
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
