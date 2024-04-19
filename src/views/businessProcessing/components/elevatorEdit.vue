<template>
    <div>
        <el-dialog title="设备信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="clearElementData">
            <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="编号类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.radio" @change="changeRadio">
                        <el-radio :label="1">设备代码</el-radio>
                        <el-radio :label="2" >出厂编号</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.radio=='1'" label="设备代码" :label-width="formLabelWidth" prop="equipmentsCode">
                    <el-input class="ts-ele-input" v-model.trim="form.equipmentsCode" autocomplete="off" placeholder="设备代码(必填)" @input="analysisNumber"></el-input>
                </el-form-item>
                <el-form-item v-if="form.radio=='2'" label="出厂编号" :label-width="formLabelWidth" prop="factoryNumber">
                    <el-input class="ts-ele-input" v-model.trim="form.factoryNumber" autocomplete="off" placeholder="出厂编号(必填)"></el-input>
                </el-form-item>
                <el-form-item label="电梯类型" :label-width="formLabelWidth" prop="elevatorType">
                    <el-radio-group v-model="form.elevatorType">
                        <el-radio :label="1">直梯</el-radio>
                        <el-radio :label="2">扶梯</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电梯坐落地址" :label-width="formLabelWidth" prop="selectedOptions">
                    <el-cascader v-if="options.lenght != 0" filterable expand-trigger="hover" :options="options" v-model="form.selectedOptions"  @change="handleChange" style="width: 100x">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" :label-width="formLabelWidth"  prop="useOfAddress">
                    <el-input class="ts-ele-input" v-model.trim="form.useOfAddress" autocomplete="off" placeholder="详细地址"></el-input>
                </el-form-item>
                <el-form-item prop="useOfUnit"  label="使用单位名称" :label-width="formLabelWidth">
                    <el-input class="ts-ele-input" v-model.trim="form.useOfUnit" autocomplete="off" placeholder="使用单位名称"></el-input>
                </el-form-item>
                <el-form-item label="批改类型" :label-width="formLabelWidth"  prop="pdType">
                    <el-select v-model="form.pdType" placeholder="请选择">
                        <el-option  label="批增" value="1"> </el-option>
                        <el-option  label="批减" value="2"> </el-option>
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
export default {
    name: 'elevatorEdit',
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
        var equipmentsNumber = (rule, value, callback) => {
    		const equipmentsCodeReg = /^[a-zA-Z0-9]{15,25}$/
    		if (!value) {
      			return callback(new Error('设备编号不能为空'))
            }
    		setTimeout(() => {
                if (equipmentsCodeReg.test(value)) {
          			callback()
        		} else {
          			callback(new Error('设备编号为15到25位的数字和字母'))
        		}
    		}, 100)
          };
          var licenceNoNumber = (rule, value, callback) => {
    		const licenceNoCodeReg = /^[\d.A-Za-z\u4e00-\u9fa5a./-]{1,100}$/
    		if (!value) {
      			return callback(new Error('请输入出厂编号'))
            }
    		setTimeout(() => {
                if (licenceNoCodeReg.test(value)) {
          			callback()
        		} else {
          			callback(new Error('请输入正确的出厂编号,特殊字符只能为./-'))
        		}
    		}, 100)
        };
		return {
            typeFlag: '',
            eleIndex:'',
            addEle:true,    // 防止重复添加
            editElevatorFlag: false,
            dialogFormVisible: false,
            form: {
                selectedOptions:[],      // 选中数据
                radio: 1,       // 出厂编号 ，还是电梯编号
                userCode: "", // 当前登录用户编号*
                equipmentsCode: "", // 电梯设备编号
                factoryNumber: "", // (生产编号)
                weight: "", // 重量
                height: "", // 长度
                elevatorType: 1, // 电梯类型标志1- 直梯；2-扶梯*
                useOfUnit: "", // 电梯使用单位
                useOfAddress: "", // 电梯坐落地址
                currentArea: "请选择", // 当前地点
                areaCodeFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaCodeSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaCodeThird: "", // 坐落地址第三级编码
                comment: "", // 备注
                areaValueFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaValueSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaValueThird: "", // 坐落地址第三级编码.trim
                elevatorLevel: "", // 电梯安全等级值
                elevatorLevelCode: "", //电梯安全等级编码
                elevatorModel : "", //电梯型号
                isManaged : "", //电梯有无专职人员管理
                otherSiteDes : "", // 其他场所说明

            },
            formLabelWidth: "150px",
            rules: {
                equipmentsCode: [
                    { validator: equipmentsNumber,required: true,trigger: 'blur' }
                ],
                factoryNumber: [
                    { validator: licenceNoNumber,required: true,trigger: 'change' }
                ],
                selectedOptions: [
                    {  required: true,  message: '坐落地址', trigger: 'change' }
                ],
                useOfUnit: [
                    {  required: true, message: '请输入电梯使用单位', trigger: 'change' }
                ],
                useOfAddress: [
                    {  required: true, message: '请填写详细地址', trigger: 'change' }
                ],
                pdType:[
                    {  required: true,  message: '请选择批改类型', trigger: 'change' }
                ],
                elevatorType:[
                    {  required: true,  message: '请选择电梯类型', trigger: 'change' }
                ]
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
                this.typeFlag = '';
                this.addEle=true;   // 重复点击按钮
                this.editElevatorFlag = false;
                this.form= {        // 清空
                    selectedOptions:[],
                    radio: 1,
                    userCode: "", // 当前登录用户编号*
                    equipmentsCode: "", // 电梯设备编号
                    factoryNumber: "", // (生产编号)
                    weight: "", // 重量
                    height: "", // 长度
                    elevatorType: 1, // 电梯类型标志1- 直梯；2-扶梯（自动货梯）3-扶梯 4-其他电梯*
                    useOfUnit: "", // 电梯使用单位
                    useOfAddress: "", // 电梯坐落地址
                    currentArea: "", // 当前地点
                    areaCodeFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                    areaCodeSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                    areaCodeThird: "", // 坐落地址第三级编码
                    comment: "", // 备注
                    areaValueFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                    areaValueSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                    areaValueThird: "", // 坐落地址第三级编码.trim
                    elevatorLevel: null, // 电梯安全等级值
                    elevatorLevelCode: null, //电梯安全等级编码
                    elevatorModel : "", //电梯型号
                    isManaged : "", //电梯有无专职人员管理
                    otherSiteDes:"",    // 其他场所说明
                };
            }
            this.dialogFormVisible = true;
        },
        // 编辑页面设置数据
        setElevator(form){
            this.form = JSON.parse(JSON.stringify(form));
            this.typeFlag = JSON.parse(JSON.stringify(form)).pdType;
            if(this.form.equipmentsCode==null || this.form.equipmentsCode==''){
                this.$set(this.form,'radio',2);
            }else{
                this.$set(this.form,'radio',1);
            };  
            this.form.elevatorType = Number(this.form.elevatorType);
            this.form.selectedOptions=[this.form.areaCodeFirst,this.form.areaCodeSecond,this.form.areaCodeThird];
            this.editElevatorFlag = true;
        },
        // 新增一部电梯
        async elementAdd(formName) {
            if(this.addEle){
                this.addEle=false;
                // 新增电梯，如果状态不为0000，说明必填项没有填全
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
        // 编辑保存电梯
        async elementEdit(formName) {
            // 新增电梯，如果状态不为0000，说明必填项没有填全
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
                selectedOptions:[],
                radio: 1,
                userCode: "", // 当前登录用户编号*
                equipmentsCode: "", // 电梯设备编号
                factoryNumber: "", // (生产编号)
                weight: "", // 重量
                height: "", // 长度
                elevatorType: 1, // 电梯类型标志1- 直梯；2-扶梯（自动货梯）3-扶梯 4-其他电梯*
                useOfUnit: "", // 电梯使用单位
                useOfAddress: "", // 电梯坐落地址
                currentArea: "", // 当前地点
                areaCodeFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaCodeSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaCodeThird: "", // 坐落地址第三级编码
                comment: "", // 备注
                areaValueFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaValueSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaValueThird: "", // 坐落地址第三级编码.trim
                elevatorLevel: null, // 电梯安全等级值
                elevatorLevelCode: null, //电梯安全等级编码
                elevatorModel : "", //电梯型号
                isManaged : "", //电梯有无专职人员管理
                otherSiteDes:"",    // 其他场所说明
            };
            this.$refs.ruleForm.resetFields()
            
        },
        // 设置电梯的坐落地址
        handleChange(val) {
            this.form.areaCodeFirst= val[0]; // 坐落地址第一级编码（适用行政区域省编码）
            this.form.areaCodeSecond= val[1]; // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
            this.form.areaCodeThird= val[2]; // 坐落地址第三级编码
            this.options.forEach(item =>{
                if(item.value == val[0]){
                    this.form.areaValueFirst= item.label
                    item.children.forEach(city=>{
                        if(city.value == val[1]){
                            this.form.areaValueSecond= city.label
                             city.children.forEach(area=>{
                                 if(area.value== val[2]){
                                     this.form.areaValueThird= area.label;
                                     return
                                 }
                             })
                        }
                    })
                }
                
            })  
        },
        // 解析编号
        analysisNumber(){
            if(this.form.equipmentsCode.length == 20){
                this.region();
                this.elevatorType();
                this.durable();
            }
        },
          // 电梯类型
        elevatorType(){
            var elevatorType = this.form.equipmentsCode.slice(0,2);
            if(elevatorType=="31" ||elevatorType=="32" ||elevatorType=="33"  ){
                this.form.elevatorType=1;
            }else if(elevatorType=="35" ||elevatorType=="36"){
                this.form.elevatorType=2;
            }else if(elevatorType=="34" && this.form.productCode==this.$globalProductCode.PRODUCT_CODE_XJ){
                this.form.elevatorType=3;
            }else if(elevatorType=="34" ){
                 this.form.elevatorType=1;
                 
            };
        },
        // 地区
        region(){
            this.form.selectedOptions=[]
            this.form.currentArea='';
            var elevatorArea = this.form.equipmentsCode.slice(4,10);
            var province = elevatorArea.slice(0,2)+'0000';
            var city = elevatorArea.slice(0,4)+'00';
            var area = elevatorArea;

             this.options.forEach(item =>{
                 if(item.value == province){
                     this.form.areaCodeFirst= province;
                    this.form.areaValueFirst= item.label
                    item.children.forEach(cityS=>{
                        if(cityS.value == city){
                            this.form.areaCodeSecond= city; 
                            this.form.areaValueSecond= cityS.label
                             cityS.children.forEach(areaS=>{
                                 if(areaS.value== area){
                                    this.form.areaCodeThird= areaS.value;
                                    this.form.areaValueThird= areaS.label;
                                     return
                                 }
                             })
                        }
                    })
                }
                
            })

            this.form.selectedOptions.push(province)
            this.form.selectedOptions.push(city)
            this.form.selectedOptions.push(area)
            
        },
        // 使用年限
        durable(){
            var elevatorTimer = this.form.equipmentsCode.slice(10,14);
            var month = this.form.equipmentsCode.slice(14,16);
            let timer =	moment(new Date()).format('YYYY');
            let nowMonth =moment(new Date()).format('MM');
            let year = nowMonth - month>=0 ?timer-elevatorTimer +0 :timer-elevatorTimer -1 ;
            this.form.elevatorYear= year ? year : '';
        },
        // 选择设备代码和出场编码时候，清空另一个号码
        changeRadio(e){
            if(e==1){
                this.form.factoryNumber= "";// (生产编号) 
            }else{
                this.form.equipmentsCode="";// 电梯设备编号
            }
        }
	},
}
</script>
<style lang="less" scoped>

</style>