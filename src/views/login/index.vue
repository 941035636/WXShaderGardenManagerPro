<template>
  <div class="login-container">
    <div class="login-row" justify="center">
      <div class="login-col">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <div class="title-tips">{{ title }}</div>
          <el-form-item style="margin-top: 40px" prop="userName">
            <span class="svg-container svg-container-admin">
              <font-awesome-icon :icon="['fas', 'user']" />
            </span>
            <el-input
              v-model.trim="form.userName"
              v-focus
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :type="passwordType"
              tabindex="2"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            />
            <span
              v-if="passwordType === 'password'"
              class="show-password"
              @click="handlePassword"
            >
              <font-awesome-icon :icon="['fas', 'eye-slash']" />
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <font-awesome-icon :icon="['fas', 'eye']" />
            </span>
          </el-form-item>
          <el-form-item prop="imgVerifyCode">
            <div class="input-flex">
              <div class="input-l">
                <span class="svg-container svg-container-admin">
                  <font-awesome-icon
                    :icon="['fas', 'user-shield']"
                  ></font-awesome-icon>
                </span>
                <el-input
                  v-model.trim="form.imgVerifyCode"
                  type="text"
                  placeholder="请输入图形验证码"
                  autocomplete="off"
                  maxlength="4"
                  show-word-limit
                  @keyup.enter.native="handleLogin"
                ></el-input>
              </div>
              <div class="input-r">
                <img
                  class="show-img verifi-code"
                  :src="captchaImgUrl"
                  @click="getCapchas"
                />
              </div>
            </div>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/user'
import { validateKey } from '@/utils/validateFrom'
export default {
  name: 'Login',
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  data() {
    const validateusername = (rule, value, callback) => {
      if ('' == value) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validateImgVerifyCode = (rule, value, callback) => {
      if ('' == value) {
        callback(new Error('图形验证不能为空'))
      } else {
        callback()
      }
    }
    return {
      nodeEnv: process.env.NODE_ENV,
      title: this.$baseTitle,
      form: {
        userName: '',
        password: '',
        imgVerifyCode: '',
        imgCodes: '', // haeder中传入
      },
      captchaImgUrl: '',
      rules: {
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: validateusername,
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validateKey,
          },
        ],
        imgVerifyCode: [
          {
            required: true,
            trigger: 'blur',
            validator: validateImgVerifyCode,
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || 'index'
      },
      immediate: true,
    },
  },
  created() {
    this.getCapchas()
    document.body.style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
  },
  mounted() {
    // this.handleExternaLogin()
  },
  methods: {
    async getCapchas() {
      // let res = await getCaptcha(new Date().getTime())
      let res = await getCaptcha()
      this.captchaImgUrl =
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      this.form.imgCodes = res.headers.imgcode
    },
    // handleExternaLogin() {
    //   // 外部跳转 如果带token就直接调用 外部登录方法
    //   if (this.$route.query.token) {
    //     this.$store
    //       .dispatch('user/externalLogin', this.$route.query.token)
    //       .then(() => {
    //         const routerPath =
    //           this.redirect === '/404' || this.redirect === '/401'
    //             ? '/'
    //             : this.redirect
    //         this.$router.push(routerPath).catch(() => {})
    //       })
    //   }
    // },
    handlePassword() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    reset() {
      // this.form.password = ''
      this.form.imgVerifyCode = ''
      this.getCapchas()
    },
    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', JSON.parse(JSON.stringify(this.form)))
            .then(() => {
              // 登录之后判定如果当前用户为企业用户 默认覆盖当前首页跳到我的服务首页
              const roles = window.sessionStorage.getItem('roles')
              if (roles != null && roles != undefined) {
                let rolesArr = []
                if (roles.indexOf(',') != -1) {
                  rolesArr = roles.split(',')
                } else {
                  rolesArr = [roles]
                }

                if (rolesArr.includes('RL1453251619998273537')) {
                  this.$router.push({
                    name: 'Enterprise',
                  })
                  this.loading = false
                  return
                } else {
                  this.$router.push({
                    path: '/',
                  })
                  return
                }
              }
              const routerPath =
                this.redirect === '/404' || this.redirect === '/401'
                  ? '/'
                  : this.redirect
              this.$router.push(routerPath).catch(() => {})
              this.loading = false
            })
            .catch(() => {
              this.reset()
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: url('~@/assets/login_images/background.png') center center fixed
    no-repeat;
  background-size: cover;

  .title {
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }

  .title-tips {
    display: flex;
    justify-content: center;
    font-size: 22px;
    color: $base-color-default;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
  }

  .login-btn {
    display: inherit;
    height: 40px;
    width: 100%;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .login-row {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;

    .login-col {
      box-shadow: 0px 0px 14px 7px rgba(0, 0, 0, 0.31);
    }
  }

  .login-form {
    // position: relative;
    max-width: 700px;
    // margin: calc((100vh - 425px) / 2) 10% 10%;
    overflow: hidden;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }

    .verifi-code {
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #fff;
      border-radius: 3px;
    }

    .input-flex {
      display: flex;

      .input-l {
        width: 70%;
      }

      .input-r {
        width: 35%;
        box-sizing: border-box;
        border: 1px solid #cecece;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-left: 6px;
        cursor: pointer;

        .show-img {
          // position: absolute;
          // top: 12px;
          // right: 20px;
          // font-size: 16px;
          color: $base-font-color;
          user-select: none;
        }
      }
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $base-color-white;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 22px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 6px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: $base-color-blue;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    position: absolute;
    top: 6px;
    right: 25px;
    font-size: 16px;
    color: $base-color-blue;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__content {
        min-height: $base-input-height;
        line-height: $base-input-height;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: $base-font-size-small;
        line-height: 18px;
        color: $base-color-red;
      }

      .el-input {
        .el-input__count {
          .el-input__count-inner {
            background: transparent;
          }
        }
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 40px;
        padding-left: 45px;
        font-size: $base-font-size-default;
        line-height: 58px;
        color: $base-font-color;
        background: #fff;
        border: 1px solid #cecece;
        caret-color: $base-font-color;
      }
    }
  }
}
</style>
