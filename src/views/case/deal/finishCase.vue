<template>
  <div id="finishCase">
    <div class="header">
      <el-steps process-status="finish" :active="2" simple>
        <el-step title="填写出险信息">
          <span slot="icon">1</span>
        </el-step>
        <el-step title="填写结案信息">
          <span slot="icon">2</span>
        </el-step>
        <el-step title="提交完成">
          <span slot="icon">3</span>
        </el-step>
      </el-steps>
      <div class="headerTip color-blue">
        请填写真实有效的信息，对于您的信息我们会严格保密
      </div>
    </div>
    <div class="main">
      <i class="el-icon-circle-check"></i>
      <p class="fb f20 mb30">您的理赔信息已提交成功！</p>
      <div class="text-center">
        <el-button class="mr40" @click="back">返回列表页</el-button>
        <el-button type="primary" @click="toAdd">继续添加</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'finishCase',

  data() {
    return {}
  },

  created() {},
  methods: {
    async back() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      await this.$store.dispatch('tabsBar/delVisitedRoute', {
        path: '/case/caseUpdate',
      })
      await this.$store.dispatch('tabsBar/delVisitedRoute', {
        path: '/case/caseAdd',
      })
      this.$router.push({
        path: 'caseList',
      })
    },
    async toAdd() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      this.$router.push({
        path: 'caseAdd',
      })
    },
  },
}
</script>

<style lang='scss'>
#finishCase .el-step__icon {
  width: 26px;

  height: 26px;
  font-size: 16px;
}
</style>
<style lang='scss' scoped>
#finishCase {
  background-color: #f6f8f9;
}

#finishCase .header {
  padding-top: 20px;
  display: flex;

  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: #fff !important;
  height: 130px;

  .el-steps {
    width: 70%;
  }

  .headerTip {
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    background-color: #cce7ff;
    text-align: center;
  }

  .el-steps--simple {
    background-color: #fff;
  }
}

#finishCase .main {
  display: flex;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  height: 300px;
  justify-content: center;
  margin-top: 20px;

  p {
    word-spacing: 10px;
  }

  i {
    font-size: 50px;
    color: #fa8c16;
    font-weight: bold;
  }
}
</style>