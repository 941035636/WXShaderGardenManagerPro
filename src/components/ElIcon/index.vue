<template>
  <i
    :class="'eliconcur el-icon-' + iconName"
    :style="[{ color: iconColor }]"
  ></i>
</template>

<script>
  export default {
    // props: {
    //   label: {
    //     type: String,
    //     default: () => {
    //       return ''
    //     },
    //   },
    // },
    name: 'ElIcon',
    props: {
      iconName: {
        type: String,
        requires: true,
        default: () => {
          return ''
        },
      },
      iconColor: {
        type: String,
        requires: true,
        default: () => {
          return '#2c3e50'
        },
      },
    },
  }
</script>

<style lang="scss">
  .eliconcur {
    cursor: pointer;
    font-size: 16px;
  }
</style>
