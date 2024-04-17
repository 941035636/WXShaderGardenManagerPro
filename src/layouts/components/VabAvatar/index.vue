<template>
  <div>
    <el-dropdown @command="handleCommand">
      <span class="avatar-dropdown">
        <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
        <!-- <img class="user-avatar" :src="avatar" alt="" /> -->
        <div class="user-name">
          <el-tooltip
            v-if="username.length > 4"
            class="item"
            effect="dark"
            :content="username"
            placement="left"
          >
            <span>{{ username.slice(0, 4) }}...</span>
          </el-tooltip>
          <span v-if="username.length < 4">{{ username }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isFlag" command="enterpriseInformation">
          企业资料
        </el-dropdown-item>
        <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <modify-pass ref="ModifyPass" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { recordRoute } from '@/config'
import ModifyPass from '@/views/sys/accountManage/components/ModifyPass'

export default {
  name: 'VabAvatar',
  components: {
    ModifyPass,
  },
  data() {
    return {
      isFlag: false,
      dialogVisible: true,
      ruleForm: {},
      rules: {},
    }
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
    }),
  },
  created() {
    const roles = window.sessionStorage.getItem('roles')
    if (roles != null && roles != undefined) {
      let rolesArr = []
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }

      if (rolesArr.includes('RL1453259613846778543')) {
        this.isFlag = true
      }
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'enterpriseInformation':
          this.$router.push({
            path: '/enterpriseInformation',
            query: {
              orgId: window.sessionStorage.getItem('orgId'),
            },
          })
          break
        case 'updatePassword':
          this.updatePassword()
          break
        case 'personalCenter':
          this.personalCenter()
          break
      }
    },
    personalCenter() {
      this.$router.push('/personalCenter/personalCenter')
    },
    logout() {
      this.$baseConfirm(
        '您确定要退出' + this.$baseTitle + '吗?',
        null,
        async () => {
          await this.$store.dispatch('user/logout')
          if (recordRoute) {
            const fullPath = this.$route.fullPath
            this.$router.push(`/login?redirect=${fullPath}`)
          } else {
            this.$router.push('/login')
          }
          window.sessionStorage.clear('roles')
          window.sessionStorage.clear('servOrganizationResp')
          window.sessionStorage.clear('orgId')
          window.sessionStorage.clear('userCode')
          window.sessionStorage.clear('loginAccount')
          await this.$store.dispatch('tabsBar/delAllRoutes')
        }
      )
    },
    updatePassword() {
      this.$refs.ModifyPass.dialogModifyPass = true
      this.$refs.ModifyPass.ruleForm.userCode =
        window.sessionStorage.getItem('userCode')
      this.$refs.ModifyPass.ruleForm.loginAccount =
        window.sessionStorage.getItem('loginAccount')
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
