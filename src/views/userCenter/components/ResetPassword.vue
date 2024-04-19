<template>
    <el-dialog
        title="重置密码"
        :visible.sync="dialogVisible"
        @close="close"
        width="536px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="ruleFormSetPass">
            <div class="product-spilt">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <div>{{name}}</div>
                </el-form-item>
            </div>
            <el-form-item label="设置密码" :label-width="formLabelWidth" prop="password">
                <el-input v-model="ruleForm.password" autocomplete="off" class="w290" size="mini"></el-input>
                <el-button size="mini" type="warning" @click="randomPasswords" >随机生成</el-button>
            </el-form-item>
            <div class="color-red mt10" style="margin-left:100px">注：密码由8-20位大写或小写字母+数字+符号组合</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
  export default {
      data() {
        var validatePass = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入新密码"));
            } else if(value.length > 20 || value.length < 8 || this.$stringHelper.passwordLevel(value) !=3){
                callback(new Error("密码为8-20位包含字母、数字及符号三种组合！"));
            }else{
                callback();
            }
        };
        return {
            Elevator:new elevator(),
            dialogVisible: false,
            name:"",
            ruleForm:{
                name:'',
                password:'',
            },
            formLabelWidth: '100px',
            rules: {
                password: [
                    {  required: true,  message: '请填写密码', trigger: 'blur' },
                    { validator: validatePass, trigger: "blur"},
                ],
            },
        }
      },
      methods: {
          open(val) {
              this.name=val.custFullName
              this.ruleForm.userCode=val.userCode
              this.ruleForm.loginId=val.userloginId
              this.ruleForm.password=''
              this.dialogVisible = true
          },
          close() {
              this.dialogVisible = false
              this.$refs.ruleForm.resetFields();
          },
          randomPasswords() {
            let password = this.$numberHelper.RandomCipher(8);
            this.ruleForm.password = password
          },
          submitForm(formName) {
              this.$refs[formName].validate(valid => {
                  if (valid) {
                  this.resetPassword();
                  } else {
                  return false;
                  }
              });
          },
          async resetPassword() {
              let data = {
                  loginId: this.ruleForm.loginId,
                  password: this.$stringHelper.passwordFormat(this.ruleForm.password),
                  userCode: this.ruleForm.userCode,
                  "isCheck": "1",
              };
              const res = await this.Elevator.resetPassword(data);
              if (res.code == "0000") {
                  this.$message({message: "重置成功",type: "success"});
                  this.dialogVisible = false
              }
          },
      }
  }

</script>

<style scoped>
.ruleFormSetPass {
    margin: 0 10px;
}
.product-spilt {
  border-bottom: 2px dashed #ccc;
  margin-bottom: 22px;
}
.w290 {
    width: 290px;
}
</style>
