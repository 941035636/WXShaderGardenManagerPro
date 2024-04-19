<template>
    <div>
        <!-- Form -->
        <el-dialog title="添加投保人员" :visible.sync="dialogFormVisible" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="licenceType">
                    <el-select v-model="form.licenceType" clearable placeholder="请选择证件类型">
                        <el-option
                        v-for="item in  idType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="id">
                    <el-input class="ts-ele-input" v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="人员岗位" :label-width="formLabelWidth" prop="post">
                    <el-select v-model="form.post" clearable placeholder="请选择人员岗位">
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" v-if="form.post == '其他'">
                    <el-input class="ts-ele-input" v-model="form.postDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary"  @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            flag:false,
            dialogFormVisible: false,
            idType: [{
                value: 'cardType_0',
                label: '中国居民身份证'
            },
            {
                value: 'cardType_12',
                label: '澳门身份证'
            },
            {
                value: 'cardType_1',
                label: '护照'
            },
            {
                value: 'cardType_2',
                label: '军官证'
            }],
            typeOptions:[{
                value: '1',
                label: '安装工'
            },{
                value: '2',
                label: '维保工'
            },{
                value: '3',
                label: '改造工'
            },{
                value: '4',
                label: '内勤人员'
            },{
                value: '5',
                label: '其他'
            }],
            form: {
                name: '',
                id: '',
                post: '',
                postDesc: '',
                licenceType: ''
            },
            formLabelWidth: '120px',
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                id: [
                    { message: '请输入证件号码',required: true,  trigger: 'blur' }
                ],
                post: [
                    { required: true, message: '请选择人员岗位', trigger: 'blur' }
                ],
                licenceType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
            },
            personList:[],
        }
    },
    methods:{
        handleClose() {
            this.resetForm('form');
        },
        flagTrue(){
            this.dialogFormVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this[formName].licenceType == "中国居民身份证") {
                    if(this.$stringHelper.isIdCard(this[formName].id)) {
                        this.setSession(this.form);
                        this.resetForm(formName);
                    } else {
                        this.$message({
                            type: 'error',
                            message: '中国居民身份证输入有误，请重新输入中国居民身份证!'
                        });
                    }
                } else {
                    this.setSession(this.form);
                    this.resetForm(formName);
                }
                
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        setSession(data) {
            let list = [];
            if(window.sessionStorage.getItem('personList')) {
                list = JSON.parse(window.sessionStorage.getItem('personList'));
            } 
            list.push(data);
            window.sessionStorage.setItem('personList',JSON.stringify(list));
            this.$parent.computedPerson();
        },
        resetForm(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        }

    }
}
</script>

<style>
.ts-ele-input{
    width: 458px;
}
.el-select {
    width: 460px;
}
</style>
