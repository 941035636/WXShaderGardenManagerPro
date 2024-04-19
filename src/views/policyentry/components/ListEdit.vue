<template>
    <div>
        <el-dialog title="人员信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="clearElementData">
            <el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="licenceType">
                    <el-select v-model="form.licenceType" clearable placeholder="请选择证件类型" @change="getIdTypeCode" style="width:60%">
                        <el-option
                        v-for="item in  idType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code" autocomplete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="投保房屋地址" :label-width="formLabelWidth" prop="selectedOptions">
                    <el-cascader v-if="options.lenght != 0" filterable expand-trigger="hover" :options="options" v-model="form.selectedOptions"  @change="handleChange" style="width: 100x">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" :label-width="formLabelWidth"  prop="houseLocation">
                    <el-input class="ts-ele-input" v-model.trim="form.houseLocation" style="width:60%" autocomplete="off" placeholder="详细地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearElementData">取 消</el-button>
                <el-button v-if="!editElevatorFlag" type="primary" @click="elementAdd('form')">确 定</el-button>
                <el-button v-else-if="editElevatorFlag" type="primary" @click="elementEdit('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ListEdit',
    props:{
        options:{
            type:Array,
            required:true,
            default: ()=>{
                return []
            }
        },
    },
	data() {
		return {
            idType: [
                {
                    "value": "cardType_0",
                    "label": "中国居民身份证"
                },
                {
                    "value": "cardType_1",
                    "label": "护照"
                },
            ],
            eleIndex:'',
            addEle:true,    // 防止重复添加
            editElevatorFlag: false,
            dialogFormVisible: false,
            form: {
                type: '40',//房屋(40)
                houseProvinceName:'',//房屋地址省名称
                houseProvinceCode:'',//房屋地址省编码
                houseCityCode:'',//房屋地址市编码
                houseCountyName:'',//房屋地址县名称
                houseCountyCode:'',//房屋地址县编码
                houseCityName:'',//房屋地址市名称
                houseLocation:'',//房屋详细地址
                licenceType:'',//人员证件类型
                licenceTypeNo:'',//人员证件类型编号
                licenceTypeNo:'',//人员证件类型编号
                name:'',//人员姓名
                code:'',//证件号码

            },
            formLabelWidth: "150px",
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                code: [
                    { message: '请输入证件号码',required: true,  trigger: 'blur' },
                    { message: '证件号码限制22位',max: 22,  trigger: 'blur' }
                ],
                licenceType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                selectedOptions: [
                    {  required: true,  message: '坐落地址', trigger: 'change' }
                ],
                houseLocation: [
                    {  required: true, message: '请填写详细地址', trigger: ['change','blur'] }
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
            if(index !== undefined){ // 判断是新增电梯还是编辑电梯
                this.eleIndex = index;    // 索引
            } 
            if(form) {
                this.setElevator(form);
            } else {
                this.eleIndex = '';
                this.addEle=true;   // 重复点击按钮
                this.editElevatorFlag = false;
                this.form = { 
                    selectedOptions:[],       // 清空
                    type: '40',//房屋(40)
                    houseProvinceName:'',//房屋地址省名称
                    houseProvinceCode:'',//房屋地址省编码
                    houseCityCode:'',//房屋地址市编码
                    houseCountyName:'',//房屋地址县名称
                    houseCountyCode:'',//房屋地址县编码
                    houseCityName:'',//房屋地址市名称
                    houseLocation:'',//房屋详细地址
                    licenceType:'',//人员证件类型
                    licenceTypeNo:'',//人员证件类型编号
                    name:'',//人员姓名
                    code:'',//证件号码
                };
            }
            this.dialogFormVisible = true;
        },
        // 编辑页面设置数据
        setElevator(form){
            this.form = JSON.parse(JSON.stringify(form));
            this.form.selectedOptions=[this.form.houseProvinceCode,this.form.houseCityCode,this.form.houseCountyCode];
            this.editElevatorFlag = true;
        },
        // 新增一部电梯
        async elementAdd(formName) {
            if(this.addEle){
                this.addEle=false;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        if(this[formName].licenceTypeNo == "cardType_0" && !this.$stringHelper.isCardtValid(this[formName].code)) {
                            this.$message({
                                type: 'error',
                                message: '中国居民身份证输入有误，请重新输入中国居民身份证!'
                            });
                            return false;
                        }
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
        // 编辑保存电梯
        async elementEdit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if(this[formName].licenceTypeNo == "cardType_0" && !this.$stringHelper.isCardtValid(this[formName].code)) {
                        this.$message({
                            type: 'error',
                            message: '中国居民身份证输入有误，请重新输入中国居民身份证!'
                        });
                        return false;
                    }
                    this.$emit('insertData',this.form,this.eleIndex);
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
            this.addEle=true;   // 重复点击按钮
            this.dialogFormVisible = false; // 关闭弹弹窗
            this.editElevatorFlag=false;    // 编辑表示修改
            this.form= {        // 清空
                selectedOptions:[],       // 清空
                type: '40',//房屋(40)
                houseProvinceName:'',//房屋地址省名称
                houseProvinceCode:'',//房屋地址省编码
                houseCityCode:'',//房屋地址市编码
                houseCountyName:'',//房屋地址县名称
                houseCountyCode:'',//房屋地址县编码
                houseCityName:'',//房屋地址市名称
                houseLocation:'',//房屋详细地址
                licenceType:'',//人员证件类型
                licenceTypeNo:'',//人员证件类型编号
                name:'',//人员姓名
                code:''
            };
            this.$refs.form.resetFields()
            
        },
        // 设置电梯的坐落地址
        handleChange(val) {
            this.form.houseProvinceCode= val[0]; // 坐落地址第一级编码（适用行政区域省编码）
            this.form.houseCityCode= val[1]; // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
            this.form.houseCountyCode= val[2]; // 坐落地址第三级编码
            this.options.forEach(item =>{
                if(item.value == val[0]){
                    this.form.houseProvinceName= item.label
                    item.children.forEach(city=>{
                        if(city.value == val[1]){
                            this.form.houseCityName= city.label
                             city.children.forEach(area=>{
                                 if(area.value== val[2]){
                                     this.form.houseCountyName= area.label;
                                     return
                                 }
                             })
                        }
                    })
                }
                
            })  
        },
        getIdTypeCode() {
            this.form.licenceTypeNo = this.idType.find(item => item.label == this.form.licenceType).value
        },
	},
}
</script>
<style lang="less" scoped>

</style>