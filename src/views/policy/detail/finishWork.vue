<template>
  <div id="finishWork">
    <div class="header">
      <el-steps process-status="finish" :active="2" simple>
        <el-step title="填写保单">
          <span slot="icon">1</span>
        </el-step>
        <el-step title="预览并提交">
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
      <p class="fb f20 mb30">您的保单已提交成功！</p>
      <div class="text-center">
        <el-button class="mr40" @click="back">返回列表页</el-button>
        <el-button type="primary" @click="toAdd">继续添加</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'finishWork',

  data() {
    return {}
  },

  created() {},
  methods: {
    async back() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      // this.$router.push({
      //   path: 'list',
      // })

      const roles = window.sessionStorage.getItem('roles')
      let rolesArr = []
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }

      if (rolesArr.includes('RL1453259613846778543')) {
        this.$router.push({
          name: 'MyPolicyLists',
        })
      } else {
        this.$router.push({
          path: 'list',
        })
      }
    },
    async toAdd() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)

      const roles = window.sessionStorage.getItem('roles')
      let rolesArr = []
      if (roles != undefined && roles != undefined) {
        if (roles.indexOf(',') != -1) {
          rolesArr = roles.split(',')
        } else {
          rolesArr = [roles]
        }

        if (rolesArr.includes('RL1453259613846778543')) {
          this.$router.push({
            name: 'AddPolicys',
          })
          return
        } else {
          this.$router.push({
            path: 'addPolicy',
          })
          return
        }
      }
      this.$router.push({
        path: 'addPolicy',
      })
    },
  },
}
</script>

<style lang='scss'>
#finishWork .el-step__icon {
  width: 26px;

  height: 26px;
  font-size: 16px;
}
</style>
<style lang='scss' scoped>
#finishWork {
  background-color: #f6f8f9;
}

#finishWork .header {
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

#finishWork .main {
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