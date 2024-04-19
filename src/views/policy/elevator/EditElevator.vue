<template>
<div>

    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false"  append-to-body>
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="编号类型" :label-width="formLabelWidth"  v-if="eleTemplate!='4'">
                <el-radio-group v-model="form.radio" @change="changeRadio" :disabled='disabledFlag'>
                    <el-radio :label="1">设备代码</el-radio>
                    <el-radio :label="2">出厂编号</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.radio=='1' ||  eleTemplate=='4'" label="设备代码" :label-width="formLabelWidth" prop="equipmentsCode" >
                <el-input class="ts-ele-input" v-model.trim="form.equipmentsCode" autocomplete="off" placeholder="设备代码(必填)" @input="analysisNumber" :disabled='disabledFlag'></el-input>
            </el-form-item>
            <el-form-item v-if="form.radio=='2' ||  eleTemplate=='4'" label="出厂编号" :label-width="formLabelWidth" prop="licenceNo" >
                <el-input class="ts-ele-input" v-model.trim="form.licenceNo" autocomplete="off" :disabled='disabledFlag' @change="detectionChanges"></el-input>
            </el-form-item>
            <el-form-item label="电梯类型" :label-width="formLabelWidth">
                <el-radio-group v-model="form.elevatorType">
                    <el-radio :label="1">直梯</el-radio>
                    <el-radio :label="2">扶梯</el-radio>
                    <el-radio v-if=" eleTemplate =='2'" :label="3">货梯</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="电梯坐落地址" :label-width="formLabelWidth" prop="selectedOptions">
					<el-cascader v-if="options.lenght != 0" expand-trigger="hover" :options="options" v-model="form.selectedOptions" change-on-select  @change="handleChange" style="width: 100x">
					</el-cascader>
            </el-form-item>
             <el-form-item label="电梯使用年限" :label-width="formLabelWidth" prop="elevatorYear">
                <el-input class="ts-ele-input" v-model.number="form.elevatorYear" autocomplete="off"  ></el-input>
            </el-form-item>
            <el-form-item v-if="eleTemplate !='7' &&  eleTemplate !='6' && eleTemplate !='1' && eleTemplate !='2' && form.elevatorType=='1' " label="载重" :label-width="formLabelWidth" prop="weight">
                <el-input class="ts-ele-input" v-model="form.weight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="eleTemplate !='7' &&  eleTemplate !='6' && eleTemplate !='1' && eleTemplate !='2'  && form.elevatorType=='2' " label="提升高度" :label-width="formLabelWidth" prop="height">
                <el-input class="ts-ele-input" v-model="form.height" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="eleTemplate !='7' &&  eleTemplate !='6'"  label="电梯使用场所" :label-width="formLabelWidth" prop="elevatorSiteCode">
                <el-select class="ts-ele-input" v-model="form.elevatorSiteCode" placeholder="请选择">
                    <el-option :label="item.value" :value="item.code" v-for="(item ,key) in elevatorSite.list" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="eleTemplate =='2'|| eleTemplate== '5'" label="电梯安全等级" :label-width="formLabelWidth" prop="elevatorLevelCode">
                <el-select class="ts-ele-input" v-model="form.elevatorLevelCode" placeholder="请选择" v-if="elevatorLevel !=undefined">
                    <el-option :label="item.value" :value="item.code" v-for="(item ,key) in elevatorLevel.list" :key="key"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="电梯型号"  v-if="eleTemplate =='4'" :label-width="formLabelWidth" prop="elevatorYear">
                <el-input class="ts-ele-input" v-model.trim="form.elevatorModel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="有无专职人员管理" :label-width="formLabelWidth" prop="isManaged"  v-if="eleTemplate =='4'"  >
                <el-radio-group v-model="form.isManaged">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">有</el-radio>
                </el-radio-group>
            </el-form-item>
           
            <el-form-item v-if="eleTemplate !='1' && eleTemplate !='8'"  label="电梯生产商" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model.trim="form.producerName" autocomplete="off" placeholder="请输入电梯生产商"></el-input>
            </el-form-item>
            <el-form-item v-if="eleTemplate !='7' &&  eleTemplate !='2' && eleTemplate !='8'"   :prop="eleTemplate=='1'?'useOfUnit':''"   label="使用单位名称" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model.trim="form.useOfUnit" autocomplete="off" placeholder="使用单位名称"></el-input>
            </el-form-item>
              <el-form-item v-if="eleTemplate !='7' &&  eleTemplate !='1' && eleTemplate !='8'"  label="其他说明" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model.trim="form.otherSiteDes" autocomplete="off" placeholder="其他场所说明"></el-input>
            </el-form-item>
             <el-form-item v-if="eleTemplate =='1'"  label="详细地址" :label-width="formLabelWidth"  prop="useOfAddress">
                <el-input class="ts-ele-input" v-model.trim="form.useOfAddress" autocomplete="off" placeholder="详细地址"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="elementAdd('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import productService from "@/service/ProductService";
import ElevatorNorm from "./ElevatorNorm";
import moment from 'moment'

export default {
    data() {
        var weightNumber = (rule, value, callback) => {
    		const weightReg = /^\d+(\.\d{0,1})?$/
    		if (!value) {
      			return callback(new Error('电梯载重不能为空'))
            }
            if(value > 9999){
                return callback(new Error('电梯载重不能大于9999'))
            }
    		setTimeout(() => {
                if (weightReg.test(value)) {
          			callback()
        		} else {
          			callback(new Error('请输入正确的格式,只能保留小数点后一位'))
        		}
    		}, 100)
          };
          var heightNumber = (rule, value, callback) => {
    		const heightReg = /^\d+(\.\d{0,1})?$/
    		if (!value) {
      			return callback(new Error('提升高度不能为空'))
            }
            if(value > 9999){
                return callback(new Error('提升高度不能大于9999'))
            }
    		setTimeout(() => {
                if (heightReg.test(value)) {
          			callback()
        		} else {
          			callback(new Error('请输入正确的格式,只能保留小数点后一位'))
        		}
    		}, 100)
  		};
        return {
            productService: new productService(),
            ElevatorNorm: new ElevatorNorm(),   // 电梯校验
            elevatorMessage:{},  // 缓存数据
            flag: false,
            options:[], // 电梯数据
            disabledFlag:true, // 电梯出厂编号 修改标识
            dialogFormVisible: false,
            elevatorSite: {'list':[]}, // 电梯使用场所，初始化
            elevatorLevel: [], // 电梯安全等级，初始化
            form: {
                selectedOptions:[],      // 选中数据
                radio: 1,       // 出厂编号 ，还是电梯编号
                userCode: "", // 当前登录用户编号*
                equipmentsCode: "", // 电梯设备编号
                licenceNo: "", // (生产编号)
                weight: "", // 重量
                height: "", // 长度
                elevatorType: 1, // 电梯类型标志1- 直梯；2-扶梯*
                elevatorSite: "", // 电梯使用场所编号（存储产品中心配置的关于坐落地址的编号*
                elevatorSiteCode: "", // 电梯使用场所编号（存储产品中心配置的关于坐落地址的编号*
                elevatorYear: "", // 电梯使用年龄*
                producerName: "", // 生产商名称
                useOfUnit: "", // 电梯使用单位
                productCode: "", // 产品编号（与产品中心对应）*
                useOfAddress: "", // 电梯坐落地址
                currentArea: "请选择", // 当前地点
                areaCodeFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaCodeSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaCodeThird: "", // 坐落地址第三级编码
                comment: "", // 备注
                areaValueFirst: "", // 坐落地址第一级编码（适用行政区域省编码）
                areaValueSecond: "", // 坐落地址第二级编码（行政区域最精确编码，可为市编码或区县编码）
                areaValueThird: "", // 坐落地址第三级编码.trim
                elevatorLevelCode: "", //电梯安全等级编码
                elevatorLevel: "", // 电梯安全等级值
                elevatorModel : "", //电梯型号
                isManaged : "", //电梯有无专职人员管理
            },
            formLabelWidth: "150px",
            rules: {
                    equipmentsCode: [
                        { required: true, message: '请输入注册代码', trigger: 'change' },
                        { min: 18, max: 25, message: '请输入正确的设备代码（18-25位）', trigger: 'blur' }
                    ],
                    licenceNo: [
                        { required: true, message: '请输入出厂编号', trigger: 'change' },
                        { min: 0, max: 100, message: '请输入正确的出厂编号', trigger: 'blur' }
                    ],
                    selectedOptions: [
                        {  required: true,  message: '坐落地址', trigger: 'change' }
                    ],
                    weight: [
                        {validator: weightNumber,required: true,trigger: 'blur' }
                    ],
                    height: [
                        {validator: heightNumber,required: true,trigger: 'blur' }
                    ],
                    elevatorSiteCode: [
                        { required: true, message: '请选择电梯使用场所', trigger: 'change' }
                    ],
                    elevatorLevelCode: [
                        { required: true, message: '请选择电梯安全等级', trigger: 'change' }
                    ],
                    elevatorYear: [
                        { required: true, message: '请输入使用年限', trigger: 'blur' },
                        { min: 0, max: 99, type: 'number', required: true, message: '请输入正确使用年限（0~99）', trigger: ['change','blur'] }
                    ],
                    useOfUnit: [
                        {  required: true, message: '请输入电梯使用单位', trigger: 'change' }
                    ],
                    elevatorModel: [
                        {  required: true, message: '请输入电梯型号', trigger: 'change' }
                    ],
                    isManaged: [
                        {  required: true, message: '请选择有无专职人员管理', trigger: 'change' }
                    ],
                    useOfAddress: [
                        {  required: true, message: '请填写详细地址', trigger: 'change' }
                    ]
            },
            eleTemplate:0,  // 模版
        };  
    },
    methods: {
        detectionChanges(val){
            this.form.licenceNo = val.replace(/[^\d.A-Za-z\u4e00-\u9fa5a./-]/g, "");
        },
        flagTrue(productCode,index) {
            let status = this.ElevatorNorm.template(productCode);   // 模版
            this.eleTemplate= status   // 模版       
            this.eleIndex=index;    // 索引
            this.productDisplay(productCode,index); // 获取产品元素，以及对应的因子
            this.getArea()
                         
        },
        // 获取地区
        async getArea(){
            
            var response = await this.productService.getArea();
            this.options = response.data
          
        },
        // 获取产品元素
        async productDisplay(productCode,index) {
            this.form.productCode = productCode;
            const params = await this.productService.productDisplay(productCode);
            let {
                code,
                data
            } = params;
            if (code == "0000") {
                const {productClassifyList} = JSON.parse(window.sessionStorage.getItem('productClassifyList'))?JSON.parse(window.sessionStorage.getItem('productClassifyList')):'';
                const theElevatorSpace=data.list[data.list.map(item => item.sign).indexOf("theElevatorSpace")]; //获取电梯使用场所因子
                if( this.form.productCode ==this.$globalProductCode.PRODUCT_CODE_NJ && productClassifyList[0].code=="19FA149436"){  // 广东产品
                    theElevatorSpace.list.forEach(item=>{
                        if(item.code !='2204'){
                            this.elevatorSite.list.push(item)
                        }
                    })
                }else if( this.form.productCode ==this.$globalProductCode.PRODUCT_CODE_NJ && productClassifyList[0].code=="19FA408124"){
                     theElevatorSpace.list.forEach(item=>{
                        if(item.code =='2204'){
                            this.elevatorSite.list.push(item)
                        }
                    })
                }else{
                    this.elevatorSite =data.list[data.list.map(item => item.sign).indexOf("theElevatorSpace")]; //获取电梯使用场所因子
                }
                this.elevatorLevel =data.list[data.list.map(item => item.sign).indexOf("theElevatorSafety")]; //获取电梯安全等级
                this.dialogFormVisible = true;
                this.elevatorMessage =  JSON.parse(window.sessionStorage.getItem('elevatorMessage'));
                this.form=this.elevatorMessage[index];
                if(this.form.equipmentsCode==null || this.form.equipmentsCode==''){
                    this.$set(this.form,'radio',2);
                }else{
                    this.$set(this.form,'radio',1);
                };       
                this.form.elevatorType=this.form.elevatorType-0;
                this.form.selectedOptions=[this.form.areaCodeFirst,this.form.areaCodeSecond,this.form.areaCodeThird];
                if(this.form.template){
                    this.disabledFlag=false;
                }else{
                    this.disabledFlag=true;
                };
            }
        },
        async elementAdd(formName) {
            // 新增电梯，如果状态不为0000，说明必填项没有填全
             this.$refs[formName].validate(async (valid) => {
                if (valid) {
                  let status =  this.ElevatorNorm.area(this.form);
                    if(status=='0000'){
                        this.form.elevatorSite = this.form.elevatorSiteCode==""?"": this.elevatorSite.list[this.elevatorSite.list.map(item=>item.code).indexOf(this.form.elevatorSiteCode)].showValue;
                        if(this.elevatorLevel){
                            this.form.elevatorLevel = !this.form.elevatorLevelCode?'': this.elevatorLevel.list[this.elevatorLevel.list.map(item=>item.code).indexOf(this.form.elevatorLevelCode)].showValue;
                        }
                        this.elevatorMessage.splice(this.eleIndex,1,this.form);
                        window.sessionStorage.setItem('elevatorMessage',JSON.stringify(this.elevatorMessage));
                         this.dialogFormVisible = false;
                         this.elevatorSite={};      // 清空电梯使用场所
                         this.$emit('flagTrue')
                        
                    }else{
                        this.$message.error(status)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });



            
        },
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
            console.log(this.form);
            
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
            this.form.elevatorYear= nowMonth - month>=0 ?timer-elevatorTimer +0 :timer-elevatorTimer -1;
        },
        changeRadio(e){
            if(e==1){
                this.form.licenceNo= "";// (生产编号) 
            }else{
                this.form.equipmentsCode="";// 电梯设备编号
                
            }
        }
    }
};
</script>

<style>
.ts-ele-input {
    width: 458px ;
}
</style>
