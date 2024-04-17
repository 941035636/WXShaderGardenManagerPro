<template>
  <div id="labelList">
    <div v-if="short">
      {{ short }}
    </div>
    <div v-if="long">
      <el-tooltip effect="dark" :content="long" placement="top">
        <span style="white-space: nowrap">{{ long.slice(0, 5) }}：</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Label1',
  props: {
    short: {
      type: String,
      default: () => {
        return ''
      },
    },
    long: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
}
</script>

<style lang="scss" scoped>
#labelList {
  div {
    width: 94px;
    line-height: 40px;
    height: 40px;
    text-align: right;
    font-size: 14px;

    color: #666666;
  }
}
</style>
