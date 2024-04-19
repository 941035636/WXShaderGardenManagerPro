<template>
    <div>
        <!-- 审核组件 -->
        <el-dialog title="发布新版本审核" :visible.sync="checkShow" width="600px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="审核类型：" prop="type">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="0">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核说明:" prop="opinion" v-if="ruleForm.type == '0'">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.opinion">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="unifyBut">
                <div></div>
                <div class="butBoxClass">
                    <div class="unifyButCancel" @click="() => checkShow = false">取消</div>
                    <div class="unifyButAffirm" @click="notarize">确认提交</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import CaseService from '@/service/CaseService.js';

export default {
    data() {
        return {
            caseService: new CaseService(),
            checkShow: false,
            ruleForm: {
                type: '',
                opinion: ''
            },
            rules: {
                type: [{ required: true, message: '请选择审核类型', trigger: 'change' }],
                opinion: [{ required: true, message: '请输入审核说明', trigger: 'blur' },
                { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }],
            },
            insuranceName: '',
            productCode: '',
            version: '',
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        openClick(e) {
            this.insuranceName = e.insuranceName;
            this.productCode = e.productCode;
            this.version = e.version,
            this.checkShow = true;
        },
        notarize() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.submit()
                }
            })
        },
        async submit() {
            let data = {
                auditorCode: window.sessionStorage.getItem("userCode"),
                auditorName: window.sessionStorage.getItem("userName"),
                insuranceName: this.insuranceName,
                pass: this.ruleForm.type == '1' ? true : false,
                productCode: this.productCode,
                // remark: this.ruleForm.opinion,
                examineReason: this.ruleForm.opinion,
                // version: parseInt(this.version) + 1,
            };
            let res = await this.caseService.examine(data);
            if (res.code === '0000') {
                this.$message({
                    message: '审核完成',
                    type: 'success'
                });
                this.$emit('auditing')
                this.checkShow = false;
            }
        },
    }
}
</script>
<style lang="less" scoped></style>