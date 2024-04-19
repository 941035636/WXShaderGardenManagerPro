<template>
    <div id="ChangePassword">
        <div class="title">
            修改密码
        </div>
        <div class="content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="oldPwd">
                    <el-input type="password" v-model="ruleForm.oldPwd" class="item1" placeholder="请输入当前密码"></el-input>
                </el-form-item>
                <el-form-item prop="newPwd">
                    <el-input type="password" v-model="ruleForm.newPwd" class="item1" placeholder="请输入新密码" @blur="diff"></el-input>
                </el-form-item>
                <el-form-item prop="secondPwd">
                    <el-input type="password" v-model="ruleForm.secondPwd" class="item1" placeholder="再次输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <div @click="submitForm('ruleForm')" class="item2">
                        提交
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :visible.sync="centerDialogVisible" width="30%" center title="提示">
            <div class="dialog-content">
                <p><i class="el-icon-success"></i></p>
                <p>已成功修改密码，请重新登录...</p>
                <p>{{time}}s后跳转登录页</p>
            </div>
        </el-dialog>
    </div> 
</template>
<script>
import UserService from '@/service/UserService'
import Menulist from '../js/Menulist.js';
import userPrivileges from '../js/userPrivileges.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
        var validatePass1 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入原密码'));
            }else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入新密码'));
            } else if (value == this.ruleForm.oldPwd) {
                callback(new Error('原密码与新密码一致,请重新输入'));
            } else {
                callback();
            }
        };
        var validatePass3 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.ruleForm.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
		return {
            UserService:new UserService(),
            Menulist:new Menulist(),
			userPrivileges:new userPrivileges(),
            ruleForm:{
                oldPwd:'',
                newPwd:'',
                secondPwd:'',
            },
            rules:{
                oldPwd: [{validator: validatePass1,trigger: 'blur'}],
                newPwd: [{validator: validatePass2,trigger: 'blur'},{pattern: /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,20}$/,message: '密码必须为8-20位大写或小写字母+数字+符号组合哦！'
						}],
                secondPwd: [{validator: validatePass3,trigger: 'blur'}],
            },
            centerDialogVisible:false,
            time:3,
            timer:null,
		}
    },
    computed: {
		...mapGetters('userInfo', {
			userInfoStore: 'renderUserInfo'
		})
	},
    beforeDestroy(){//清楚定时器
        clearInterval(this.timer);
        this.timer = null;
    },
    methods:{
        diff(){
            if (this.ruleForm.newPwd.length > 20 || this.ruleForm.newPwd.length < 8) {
                this.$message({message: '请设置密码8-20位大写或小写字母+数字+符号组合！', type: 'error'});
                return false
            }
            if (this.passwordLevel(this.ruleForm.newPwd) === 1 || this.passwordLevel(this.ruleForm.newPwd) === 2) {
                this.$message({message: '请设置密码8-20位大写或小写字母+数字+符号组合！', type: 'error'});
                return false
            }
        },
        passwordLevel (password) {
            var Modes = 0
            for (var i = 0; i < password.length; i++) {
                Modes |= this.CharMode(password.charCodeAt(i))
            }
            return this.bitTotal(Modes)
        },
        // CharMode函数
        CharMode (iN) {
            if (iN >= 48 && iN <= 57) { // 数字
                return 1
            }
            // if (iN >= 65 && iN <= 90) { // 大写字母
            //     return 2
            // }
            if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90)) { // 大小写
                return 4
            } else {
                return 8 // 特殊字符
            }
        },
        // bitTotal函数
        bitTotal (num) {
            var modes = 0
            for (var i = 0; i < 4; i++) {
            if (num & 1) modes++
            num >>>= 1
            }
            return modes
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.modifypassword();
            } else {
                return false;
            }
            });
        },
        async modifypassword(){
            if (this.ruleForm.newPwd.length > 20 || this.ruleForm.newPwd.length < 8) {
                this.$message({message: '请设置密码8-20位大写或小写字母+数字+符号组合！', type: 'error'});
                return false
            }
            if (this.passwordLevel(this.ruleForm.newPwd) === 1 || this.passwordLevel(this.ruleForm.newPwd) === 2) {
                this.$message({message: '请设置密码8-20位大写或小写字母+数字+符号组合！', type: 'error'});
                return false
            }
            let data = {
                'loginAccount': window.localStorage.getItem('loginAccount'),
                'newPwd': this.passwordFormat(this.ruleForm.newPwd),
                'oldPwd': this.passwordFormat(this.ruleForm.oldPwd),
                'secondPwd': this.passwordFormat(this.ruleForm.secondPwd),
                'userCode': window.sessionStorage.getItem('userCode'),
                "isCheck":1,
            };
            const res = await this.UserService.changepwd(data);
            if(res.code == '0000'){
                this.centerDialogVisible = true;
                this.timer = setInterval(()=>{
                    this.time --;
                    if(this.time ==0){
                        clearInterval(this.timer)
                        this.centerDialogVisible = false;
                        this.loginout();
                        if(this.$parent && this.$parent.$parent) {
                            this.$parent.$parent.dialogVisible = false;
                        }
                    }
                },1000);
            }
        },
        passwordFormat(password) {
            let md5Password = this.$md5(password);
            let passArray = md5Password.split('');
            for(let i = 1; i < passArray.length; i+=2) {
                let temporary = passArray[i];
                passArray[i] = passArray[i-1];
                passArray[i-1] = temporary;
            }
            let totalNumber = 0;
            passArray.forEach(item=> {
                totalNumber += parseInt(item, 16); });
            let lastChar = totalNumber%2;
            let result = passArray.join('')+lastChar;
            return result;
        },
        async logins(){
            let data = {
                "loginType": '0',
                "userName": window.localStorage.getItem('loginAccount'),
                "password": this.$md5(this.ruleForm.newPwd),
                "sysCode": "sys_sequip_man"
            }
            let user = await this.UserService.login(data);
            if(user.code == '0000'){
                this.$store.dispatch('userInfo/invokeUserdata',user.data);
                let userData = this.Menulist.userlists(user.data);
                let list = this.userPrivileges.users(user.data.resourceVMS);
                sessionStorage.setItem('navList',JSON.stringify(userData));
                sessionStorage.setItem('list',JSON.stringify(list));				
                let path = user.data.resourceVMS;
                this.$router.push({path:path[0].functionHierarchy?path[0].functionHierarchy:path[0].children[0].functionHierarchy});
            }
        },
        loginout(){
            localStorage.clear();
            sessionStorage.clear();
            this.$router.push('/login');
        },
    },
}
</script>

<style lang="less">
#ChangePassword{
    padding-bottom: 40px;
    box-sizing: border-box;
    .title{
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        font-size: 20px;
        color: #333333;
        font-weight: bold;
    }
    .content{
        padding-left: 10px;
        width: calc(100% - 40px);
        // min-height: 600px;
        background-color: #ffffff;
        margin-left: 20px;
        // padding: 40px;
        box-sizing: border-box;
        padding: 20px;
        .item1{
            width: 380px;
        }
        input{
            background:rgba(251,250,248,1);
        }
        .item2{
            width:160px;
            height:44px;
            background:rgba(201,152,74,1);
            border-radius:4px;
            font-size: 20px;
            color: #ffffff;
            cursor: pointer;
            text-align: center;
            line-height: 44px;
            margin-left: 160px;
        }
    }
    .dialog-content{
        width: 100%;
        height: 100%;
        text-align: center;
        p{
            line-height: 40px;
            .el-icon-success{
                font-size: 20px;
                color: #67C23A;
            }
            .item3{
                color: #409EFF;
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
}
</style>
