<template>
    <div>
        <el-dialog title="人员信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="clearElementData" width="40%">
            <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idType">
                    <el-select v-model="form.idType" clearable placeholder="请选择证件类型" @change="getIdTypeCode" style="width:60%">
                        <el-option
                        v-for="item in  idType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="id">
                    <el-input v-model="form.id" autocomplete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="人员岗位" :label-width="formLabelWidth" prop="workType">
                    <el-select v-model="form.workType" clearable placeholder="请选择人员岗位" @change="getWorkTypeCode" style="width:60%">
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批改类型" :label-width="formLabelWidth"  prop="pdType">
                    <el-select v-model="form.pdType" placeholder="请选择" style="width:60%">
                        <el-option  label="批增" value="1"> </el-option>
                        <el-option  label="批减" value="2"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否有社保" :label-width="formLabelWidth"  prop="haveSocialSecurity" v-if="productCode == '21PR380984'">
                    <el-select v-model="form.haveSocialSecurity" placeholder="请选择" style="width:60%">
                        <el-option  label="有社保" value="1"> </el-option>
                        <el-option  label="无社保" value="0"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearElementData">取 消</el-button>
                <el-button v-if="!editElevatorFlag" type="primary" @click="elementAdd('ruleForm')">确 定</el-button>
                <el-button v-else-if="editElevatorFlag" type="primary" @click="elementEdit('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment'
import dataJson from '../../../../static/data/pdPerType.json'
export default {
    name: 'personEdit',
    props:{
        options:{
            type:Array,
            required:true,
            default: ()=>{
                return []
            }
        },
        productCode:{
            type:String,
            required:true,
            default: ()=>{
                return ''
            }
        },
    },
	data() {
		return {
            idType: dataJson.idType,
            typeOptions:dataJson.typeOptions,
            typeFlag: '',
            eleIndex:'',
            addEle:true,    // 防止重复添加
            editElevatorFlag: false,
            dialogFormVisible: false,
            form: {
                name:"",
                idType:"",
                id:"",
                workType:"",
                postCode:"",
                pdType:"",
                birthday:"",
                age:"",
                licenceCode:"",
                haveSocialSecurity:null
            },
            formLabelWidth: "150px",
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                id: [
                    { message: '请输入证件号码',required: true,  trigger: 'blur' },
                    { message: '证件号码限制22位',max: 22,  trigger: 'blur' }
                ],
                workType: [
                    { required: true, message: '请选择人员岗位', trigger: 'blur' }
                ],
                idType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                pdType:[
                    {  required: true,  message: '请选择批改类型', trigger: 'change' }
                ],
                haveSocialSecurity:[
                    {  required: true,  message: '请选择是否有社保', trigger: 'change' }
                ],
            },
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		
	},
	methods: {
        showDialog(index,form) {
            if(index !== undefined){ // 判断是新增人员还是编辑人员
                this.eleIndex = index;    // 索引
            } 
            if(form) {
                this.setElevator(form);
            } else {
                this.eleIndex = '';
                this.typeFlag = '';
                this.addEle=true;   // 重复点击按钮
                this.editElevatorFlag = false;
                this.form= {        // 清空
                    name:"",
                    idType:"",
                    id:"",
                    workType:"",
                    postCode:"",
                    pdType:"",
                    birthday:"",
                    age:"",
                    licenceCode:""
                };
            }
            this.dialogFormVisible = true;
        },
        // 编辑页面设置数据
        setElevator(form){
            this.form = JSON.parse(JSON.stringify(form));
            this.typeFlag = JSON.parse(JSON.stringify(form)).pdType;
            this.editElevatorFlag = true;
        },
        // 新增人员
        async elementAdd(formName) {
            console.log(this.form);
            if(this.addEle){
                this.addEle=false;
                // 新增人员，如果状态不为0000，说明必填项没有填全
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.$emit('insertData',this.form,undefined,false);
                        this.dialogFormVisible = false;
                    } else {
                        this.addEle=true;
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        // 编辑保存人员
        async elementEdit(formName) {
            // 新增人员，如果状态不为0000，说明必填项没有填全
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if(this.typeFlag == this.form.pdType) {
                        this.$emit('insertData',this.form,this.eleIndex,false);
                    } else {
                        this.$emit('insertData',this.form,this.eleIndex,true);
                    }
                    this.dialogFormVisible = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
		// 清空数据，并且初始化数据
        clearElementData(){
            this.eleIndex = '';
            this.typeFlag = '';
            this.addEle=true;   // 重复点击按钮
            this.dialogFormVisible = false; // 关闭弹弹窗
            this.editElevatorFlag=false;    // 编辑表示修改
            this.form= {        // 清空
                name:"",
                idType:"",
                id:"",
                workType:"",
                postCode:"",
                pdType:"",
                birthday:"",
                age:"",
                licenceCode:""
            };
            this.$refs.ruleForm.resetFields()
        },
        getIdTypeCode() {
            this.form.licenceCode = this.idType.find(item => item.label == this.form.idType).value
        },
        getWorkTypeCode() {
            this.form.postCode = this.typeOptions.find(item => item.label == this.form.workType).value
        },
	},
}
</script>
<style lang="less" scoped>

</style>