<template>
  <div class="login-wrap" id="Login">
    <div class="ms-title"></div>
    <div class="ms-login">
      <div class="login-header">后台管理系统<span></span><span></span></div>
      <!-- <div class="tapClass">
        <div class="passwordLoginClass" @click="passwordLoginClick" :class="loginType == 0 ? 'pitchOnclass' : ''">用户密码登录</div>
        <div class="noteLoginClass" @click="noteLoginClick" :class="loginType == 1 ? 'pitchOnclass' : ''">短信验证码登录</div>
      </div> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
        v-if="loginType == 1"
      >
        <el-form-item prop="username" label-width="0px">
          <el-input
            v-model.trim="ruleForm.username"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" label-width="0px">
          <el-col :span="14">
            <el-input
              type="text"
              placeholder="图形验证码"
              v-model.trim="ruleForm.code"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <img class="codeImg" :src="codeImg" alt="" id="img" />
          </el-col>
          <el-col :span="4" id="imgDom">
            <el-button type="text" @click="changeImg()">
              <i class="el-icon-refresh"></i>换一张</el-button
            >
          </el-col>
          <!-- <code-img class="codeImg" ref="codeImg"></code-img> -->
        </el-form-item>
        <el-form-item prop="messageAuthenticationCode" label-width="0px">
          <el-col :span="14">
            <el-input
              type="text"
              placeholder="请输入短信验证码"
              v-model.trim="ruleForm.messageAuthenticationCode"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <div style="widows: 100%; margin-left: 20px">
              <el-button type="success" :disabled="numTime" @click="getNoteverificationCodeClick">{{
                numTime ?  num + 's后获取' : "获取验证码" 
              }}</el-button>
            </div>
          </el-col>
          <el-col :span="6" id="imgDom"> </el-col>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </div>
        <div class="question-a">
          <p class="p-style"><span class="zm-sz zm-sz-q">Q</span><span class="question-title">收不到短信验证码？</span></p>
          <p class="p-style"><span class="zm-sz zm-sz-a">A</span><p class="question-an">请检查手机网络并且核实手机是否屏蔽系统短信，如均正常请重新获取稍后再试。</p></p>
        </div>
      </el-form>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
        v-if="loginType == 0"
      >
        <el-form-item prop="username" label-width="0px">
          <el-input
            v-model.trim="ruleForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label-width="0px">
					<el-input
						type="password"
						placeholder="密码"
						v-model.trim="ruleForm.password"
						@keyup.enter.native="submitForm('ruleForm')"
					></el-input>
				</el-form-item>
        <el-form-item prop="code" label-width="0px">
          <el-col :span="14">
            <el-input
              type="text"
              placeholder="请输入图片验证码"
              v-model.trim="ruleForm.code"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <img class="codeImg" :src="codeImg" alt="" id="img" />
          </el-col>
          <el-col :span="4" id="imgDom">
            <el-button type="text" @click="changeImg()">
              <i class="el-icon-refresh"></i>换一张</el-button
            >
          </el-col>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="login-footer">
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <span class="tip-text"
        >您的密码已经使用90天了，为了保障您账户的安全，请您在更改密码后再使用。</span
      >
      <changePwd></changePwd>
    </el-dialog>
  </div>
</template>

<script>
import UserService from "../service/UserService.js";
// import codeImg from './components/CodeImg'
import Menulist from "./js/Menulist.js";
import userPrivileges from "./js/userPrivileges.js";
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import changePwd from "../views/AccountSettings/ChangePassword";
export default {
  data: function () {
    return {
      loginType:1,
      dialogVisible: false,
      imgCode: "",
      codeImg: "",
      ruleForm: {
        username: "",
        password: "",
        code: "",
        codeImg: "",
        messageAuthenticationCode:''
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        messageAuthenticationCode:[{required: true, message: "请输入短信验证码",trigger: "blur"}]
      },
      cheekedUser: true,
      UserService: new UserService(),
      Menulist: new Menulist(),
      userPrivileges: new userPrivileges(),
      num:60,
      numTime:false
    };
  },
  components: {
    changePwd,
    // 'code-img': codeImg
  },
  computed: {
    ...mapGetters("userInfo", {
      userInfoStore: "renderUserInfo",
    }),
  },
  created() {
    this.getCodeImg();
  },
  methods: {
    passwordLoginClick(){
      this.ruleForm.username = ''
      this.ruleForm.code = ''
      this.ruleForm.messageAuthenticationCode = ''
      this.ruleForm.password = ''

      this.loginType = 0
      this.rules.username = [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
      ]
      this.rules.password = [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
      ]
      this.rules.code = [
          {
            required: true,
            message: "请输入图片验证码",
            trigger: "blur",
          },
      ]
    },
    noteLoginClick(){
      this.ruleForm.username = ''
      this.ruleForm.code = ''
      this.ruleForm.messageAuthenticationCode = ''
      this.ruleForm.password = ''
      this.loginType = 1
      this.rules.username = [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern:/^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
      ]
      this.rules.password = []
      this.rules.code = []
    },
    ...mapActions("userInfo", [
      //userInfo是指modules文件夹下的userInfo.js
      "invokeUserdata", //userInfo.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ]),
    submitForm(ruleForm) {
      //表单验证
      const self = this;
      self.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.loginValidate();
        } else {
          return false;
        }
      });
    },
    passwordFormat(password) {
      let md5Password = this.$md5(password);
      let passArray = md5Password.split("");
      for (let i = 1; i < passArray.length; i += 2) {
        let temporary = passArray[i];
        passArray[i] = passArray[i - 1];
        passArray[i - 1] = temporary;
      }
      let totalNumber = 0;
      passArray.forEach((item) => {
        totalNumber += parseInt(item, 16);
      });
      let lastChar = totalNumber % 2;
      let result = passArray.join("") + lastChar;
      return result;
    },
    async loginValidate() {
      //获取登录返回的数据
      let data = {}
      if(this.loginType == 1){
        data = {
          loginType: "1",
          sysCode: "sys_sequip_man",
          phoneNum: this.ruleForm.username,
          kaptchaCode: this.ruleForm.messageAuthenticationCode,
        };
      }else{
        data = {
          loginType: "0",
          userName: this.ruleForm.username,
          isCheck: "1",
          password: this.$stringHelper.passwordFormat(this.ruleForm.password),
          sysCode: "sys_sequip_man",
          imageVerificationCode: this.ruleForm.code,
        };
      }
      // let data = {
      //   loginType: "1",
      //   phoneNum: this.ruleForm.username,
      //   // password: this.passwordFormat(this.ruleForm.password),
      //   sysCode: "sys_sequip_man",
      //   // isCheck: 1,
      //   imageVerificationCode: this.ruleForm.code,
      //   kaptchaCode: this.ruleForm.messageAuthenticationCode
      // };
      let user = await this.UserService.login(data, {
        headers: { imgcode: this.imgCode },
      });
      if (user.code == "0000") {
       

        window.localStorage.removeItem("data");
        window.localStorage.removeItem("index");
        this.$store.dispatch("userInfo/invokeUserdata", user.data);
        let userData = this.Menulist.userlists(user.data); // 菜单列表
        let list = this.userPrivileges.users(
          user.data.resourceVMS[user.data.resourceVMS.length - 1].children
        ); // 按钮权限list
        sessionStorage.setItem("navList", JSON.stringify(userData));
        sessionStorage.setItem("list", JSON.stringify(list));
        var resIP = await this.UserService.getIP();
        if (resIP.code == "0000") {
          window.sessionStorage.setItem("userIp", resIP.data);
        }
        console.log(userData, list);
        // let path = user.data.resourceVMS[user.data.resourceVMS.length-1].children;
        // console.log(path,path[0].functionHierarchy?path[0].functionHierarchy:path[0].children[0].functionHierarchy);
        // this.$router.push({path:path[0].functionHierarchy?path[0].functionHierarchy:path[0].children[0].functionHierarchy});

        let path = "";
        let data = {
          value1: "",
          index1: "",
          value2: "",
          index2: "",
          value3: "",
          index3: "",
        };
        if (userData[0].subs) {
          if (userData[0].subs[0].sub) {
            path = userData[0].subs[0].sub[0].index;
            data.value1 = userData[0].title;
            data.index1 = userData[0].index;
            data.value2 = userData[0].subs[0].title;
            data.index2 = userData[0].subs[0].index;
            data.value3 = userData[0].subs[0].sub[0].title;
            data.index3 = userData[0].subs[0].sub[0].index;
          } else {
            path = userData[0].subs[0].index;
            data.value1 = userData[0].title;
            data.index1 = userData[0].index;
            data.value2 = userData[0].subs[0].title;
            data.index2 = userData[0].subs[0].index;
          }
        } else {
          path = userData[0].index;
          data.value1 = userData[0].title;
          data.index1 = userData[0].index;
        }
        let obj = {
          userCode: user.data.userCode,
          sysCode: "sys_sequip_man",
        };
        let authData = await this.UserService.getAuth(obj);
        if (authData.code == "0000") {
          let authBranch =
            authData.data.dataPopedom.jtBranchs == "000000"
              ? "JT0000"
              : authData.data.dataPopedom.jtBranchs;
          sessionStorage.setItem("authDataInfo", authBranch);
          sessionStorage.setItem("authBranchDataInfo", authData.data.dataPopedom.jtBranchs);
          sessionStorage.setItem(
            "authDataArea",
            authData.data.dataPopedom.dataArea
          );
        }
        window.sessionStorage.setItem("luyou", JSON.stringify(data));
        this.$router.push({ path: path });
      } else if (user.code == "9001") {
        window.localStorage.removeItem("data");
        window.localStorage.removeItem("index");
        window.sessionStorage.setItem(
          "tokenExpireTime",
          user.data.tokenExpireTime
        );
        window.sessionStorage.setItem("authorization", user.data.token);
        window.sessionStorage.setItem("userCode", user.data.userCode);
        window.localStorage.setItem("loginAccount", user.data.loginAccount);
        this.dialogVisible = true;
        this.getCodeImg();
      } else {
        this.getCodeImg();
      }
    },
    handleClose(done) {
      window.sessionStorage.clear();
      done();
    },
    async getCodeImg() {
      //获取验证码
      let data = await this.UserService.getImgCode();
      this.codeImg = data.data;
      this.imgCode = data.header.imgcode;
    },
    changeImg() {
      this.getCodeImg();
    },
    //获取短信验证码的点击事件
    async getNoteverificationCodeClick() {
      if (!this.ruleForm.username) {
        this.$message.error("请输入手机号");
      } else if (!this.checkModbile(this.ruleForm.username)) {
        this.$message.error("请输入正确的手机号");
      }else if(!this.ruleForm.code){
        this.$message.error("请输入图片验证码");
      } else {
        var data = {
          phoneNum:this.ruleForm.username,
          imageVerificationCode:this.ruleForm.code
        }
        let res = await this.UserService.getSMSCode(data, { imgcode: this.imgCode });
        if(res.code === '0000'){
          this.numTime = true
          this.timing()
        } else {
          this.getCodeImg();
        }
      }
    },
    //计时器定时事件
    timing() {
      var interval = setInterval(() => {
          --this.num
      }, 1000)
      setTimeout(() => {
          clearInterval(interval)
          this.numTime = false
          this.num = 60
          this.changeImg();
      }, 60000)
    },
    //JS使用正则表达式校验电话号码
    checkModbile(mobile) {
      var re =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
      var result = re.test(mobile);
      if (!result) {
        return false; //若手机号码格式不正确则返回false
      }
      return true;
    },
  },
};
</script>

<style lang="less">
@import "../assets/styles/public.less";
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  // background: @login_bg;
  background-image:url('../../static/img/dyImage.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#Login {
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -200px;
    height: 340px;
    text-align: center;
    font-size: 30px;
    // background: @login_logo;
    color: #fff;
  }
  .ms-login {
    position: absolute;
    box-sizing: border-box;
    left: 60%;
    top: 50%;
    width: 482px;
    height: auto;
    margin: -270px 0 0 0;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    .codeImg {
      vertical-align: middle;
    }
    .login-header {
      width: 100%;
      text-align: center;
      font-size: 24px;
      font-family: SourceHanSansCN-Bold;
      color: rgba(51, 51, 51, 1);
      margin: 0 0 39px 0;
      position: relative;
      span {
        height: 0px;
        width: 54px;
        border-top: 1px solid #666666;
        position: absolute;
        top: 15px;
      }
      span:last-child {
        right: 20px;
      }
      span:first-child {
        left: 20px;
      }
    }
    .tapClass{
      display: flex;
      width: 100%;
      height: 40px;
      margin-top: 10px;
      margin-bottom: 20px;
      cursor:pointer;
      .passwordLoginClass{
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }
      .noteLoginClass{
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }
      .pitchOnclass{
        // color: #fff;
        font-weight: 500;
        // background-color: #43aa7b;
        border-bottom:4px solid #43aa7b;
      }
    }
  }
  .login-footer {
    position: fixed;
    font-size: 14px;
    width: 100%;
    left: 0;
    bottom: 100px;
    color: #d0d0d0;
    text-align: center;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 40px;
    font-weight: bold;
    margin: 16px 0 0 0;
  }
  .question-a {
    // margin-left: 40px;
    .p-style {
      margin-top: 15px;
    }
    .zm-sz {
      color: #fff;
      border-radius: 50% 50% 50% 0;
      padding: 4px 8px;
      margin-right: 10px;
    } 
    .zm-sz-q {
      background-color: #2c8ffc;
    }
    .zm-sz-a {
      background-color: #fd9941;
    }
    .question-title {
      font-weight: 700;
      color: #000;
    }
    .question-an {
      font-weight: 500;
      color: #78899d;
      margin-left: 38px;
      margin-top: -20px;
    }
  }
  .tip-text {
    font-size: 20px;
    color: #ff4d24;
  }
}
</style>
