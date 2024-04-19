<template>
  <div id="step-style">
    <el-steps :active="activeNum" align-center class="mt20 mb20">
      <el-step
        :title="'事故预防控制中心主任'"
        style="float: left; width: 33%"
      ></el-step>
      <el-step title="分支机构负责人" style="float: left; width: 33%"></el-step>
      <el-step title="完成" style="float: left; width: 33%"></el-step>
    </el-steps>
  </div>
</template>

<script>
  export default {
    props: {
      activeNum: {
        type: Number,
        default: () => {
          return 1
        },
      },
    },
  }
</script>

<style scoped lang="less">
  #step-style {
    background-color: #fff;
    .el-step__icon {
      width: 48px;
      height: 48px;
    }
    .el-step__icon.is-text {
      font-size: 24px;
    }
    .el-step.is-horizontal .el-step__line {
      height: 6px;
      top: 26px;
      background-color: #e6e6e6;
    }
    .el-step__icon-inner[class*='el-icon']:not(.is-status) {
      font-size: 50px;
    }
    .el-step__line-inner {
      height: 6px;
      color: #c9984a;
      border-color: #c9984a;
      background-color: #c9984a;
    }
    .el-step__head.is-process {
      color: #c0c4cc;
      border-color: #c0c4cc;
    }
    .el-step__title.is-process {
      font-weight: 700;
      color: #c0c4cc;
    }
  }
</style>
