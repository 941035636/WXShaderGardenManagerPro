<template>
  <div id="TipsText">
    <span v-if="text.length <= length">
      {{ text }}
    </span>
    <span v-if="text.length > length">
      <el-tooltip effect="dark" :content="text" placement="top">
        <span>{{ text.slice(0, length) }}...</span>
      </el-tooltip>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'TipsText',
    props: {
      short: {
        type: String,
        default: () => {
          return ''
        },
      },
      length: {
        type: Number,
        default: () => {
          return 15
        },
      },
      text: {
        type: String,
        default: () => {
          return ''
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  #TipsText {
    display: inline;
  }
</style>
