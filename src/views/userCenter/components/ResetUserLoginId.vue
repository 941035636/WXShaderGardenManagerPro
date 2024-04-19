<template>
    <el-dialog
        title="变更登录账号"
        :visible.sync="dialogVisible"
        @close="close"
        width="536px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="ruleFormSetPass">
              <el-form-item label="原用户账号:" :label-width="formLabelWidth">
                  <div>{{ruleForm.loginId}}</div>
              </el-form-item>
            <el-form-item label="新用户账号：" :label-width="formLabelWidth" prop="afterLoginId">
                <el-input v-model="ruleForm.afterLoginId" autocomplete="off" class="w290" size="mini"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import UserService from '@/service/UserService'
    export default {
        data() {
            var validateUserLoginId = (rule, value, callback) => {
                if (value == "") {
                    callback(new Error("请输入账号"));
                } else if(this.$stringHelper.Mobile(value) || this.$stringHelper.Email(value) || this.$stringHelper.CheckSocialCreditCode(value)){
                    callback();
                }else{
                  callback(new Error("账号支持手机号、邮箱、营业执照编号"));
                }
            };
            return {
                userManageService: new UserService(),
                dialogVisible: false,
                ruleForm:{
                    loginId:'',
                    afterLoginId:'',
                },
                formLabelWidth: '120px',
                rules: {
                    afterLoginId: [
                        {  required: true,  message: '请输入账号', trigger: 'blur' },
                        { validator: validateUserLoginId, trigger: "blur"},
                    ],
                },
            }
        },
        methods: {
            open(val) {
                this.ruleForm.userCode=val.userCode
                this.ruleForm.loginId=val.userloginId
                this.ruleForm.userCode=val.userCode
                this.ruleForm.name=val.name
                this.ruleForm.password=''
                this.dialogVisible = true
            },
            close() {
                this.dialogVisible = false
                this.$refs.ruleForm.resetFields();
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                    this.resetUserLgoin();
                    } else {
                    return false;
                    }
                });
            },
            // 更改登录账号
            async resetUserLgoin() {
                let data = {
                    afterAccount: this.ruleForm.afterLoginId,
                    beforeAccount: this.ruleForm.loginId,
                    userCode: this.ruleForm.userCode,
                    adminName: this.ruleForm.name,
                };
                const res = await this.userManageService.replaceAccount(data);
                console.log(res);
                if (res.code == "0000") {
                    this.$message({message: "重置成功",type: "success"});
                    this.dialogVisible = false
                    this.$emit('successCallback')
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
