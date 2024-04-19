<template class='template'>
	<div class="wrapper" id="AcciInventory">
		<div class="wrapper-content">
      <el-dialog class="box-aler" :title="title" :visible.sync="centerDialogVisible" width="800px" center>
        <div class="ibox-content">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
            <el-form-item label="检查表编码：" v-if="ruleForm.templateCode">
              <span>{{ruleForm.templateCode}}</span>
            </el-form-item>
            <el-form-item label="检查表名称：" prop="title">
              <el-input placeholder="请输入模板名称" v-model.trim="ruleForm.title" maxlength="30" class="wit41"></el-input>
            </el-form-item>
            <el-form-item label="检查表类型：" prop="templateType">  
              <el-select v-model="ruleForm.templateType" class="wit41" multiple :multiple-limit="10" @change="$forceUpdate()">  
                <el-option v-for="(item,index) in typeList" :key="index" :label="item.name"
                :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用地区：" prop="areaCode" >
              <!-- <el-cascader :options="options" placeholder="请选择" v-model="area" class="wid250" clearable @change="getIndustryData"></el-cascader> -->
              <el-select v-model="ruleForm.areaCode" class="wid250" @change="getIndustryData">
                <el-option v-for="(item,index) in options" :key="index" :label="item.label"
                :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用行业：" prop="oneInd">
              <el-select v-model="ruleForm.oneInd" class="wid250" @change="selectOne">
                <el-option v-for="(item,index) in industryData" :key="index" :label="item.elementValues"
                :value="item.valuesCode" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="twoInd" :rules="!twoIndustry?[{ required: false, message: '请输入二级行业', trigger: 'change' }]:rules.twoInd">
              <el-select class="wit41" v-model="ruleForm.twoInd" multiple placeholder="请选择" :multiple-limit="10" @change="$forceUpdate()" size="small">
                <el-option
                  v-for="item in twoIndustry"
                  :key="item.valuesCode"
                  :label="item.elementValues"
                  :value="item.valuesCode">
                </el-option>
              </el-select>
              <el-button @click="allIndustry">全选</el-button>
            </el-form-item>
            <el-form-item label="模板状态：" prop="templateStatus">
              <el-switch
                v-model="ruleForm.templateStatus"
                active-color="#6783D6"
                active-text="当前状态:"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
              <span class="swi-status" v-if="ruleForm.templateStatus">启用</span>
              <span class="swi-status" v-if="!ruleForm.templateStatus">停用</span>
            </el-form-item>
            <div class="dialog-footer" style="text-align:center;">
              <el-button round @click="centerDialogVisible = false">取消</el-button>
              <el-button type="primary" round @click="goList">提交</el-button>
            </div>
          </el-form>
        </div>
      </el-dialog>
		</div>
	</div>
</template>
<script>
import policyService from "@/service/policyService.js";
import statisticsService from "@/service/statisticalStatement.js";
import accidentCheckService from "@/service/accidentCheckService.js";
import industryDataAll from '../../../static/data/industryDataAll.json';
export default {
  data() {
    return {
      centerDialogVisible:false,
      title:"",
      policyService: new policyService(), // 获取地区使用Service
      StaticData: new statisticsService(), // 获取用户中心行业Service
      accidentCheck:new accidentCheckService(), // 获取创建模板Service
      options:[], //省市区条件暂存数组
      industryData:[], // 行业暂存数据
      twoIndustry:"", // 二级行业暂存（数组）
      typeList:[{name:"专家检查表",code:1},{name:"企业检查表",code:2},{name:"行管检查表",code:4}],
      ruleForm:{
        templateType:[],
        title:"1",
        templateStatus:1,
        areaCode:"", // 选择的省市区集合
        oneInd:"", // 选择的一级行业类型
        twoInd:[], // 选择的二级行业类型（数组）
      },
      oldForm:{}, // 编辑是暂存数据，为了对比数据是否修改过
      rules:{
        // { pattern:/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: "模板名称为数字、字母或中文", trigger: "change" },
        title:[{ required: true, message: "请输入检查表名称", trigger: "change" }],
        templateType:[{ required: true, message: "请选择检查表类型", trigger: "change" }],
        areaCode:[{ required: true, message: "请选择适用地区", trigger: "change" }],
        oneInd:[{ required: true, message: "请选择适用行业", trigger: "change" }],
        twoInd:[{ required: true, message: "请选择二级行业", trigger: "change" }],
        templateStatus:[{ required: true, message: "请选择检查表状态", trigger: "change" }],
      },  
    };
  },
  watch:{
    'ruleForm.oneInd':{ // 二级行业集合赋值(初始化使用)
      handler(culVal,oldVal){
        this.twoIndustry = this.ruleForm.oneInd?this.industryData.find(item => item.valuesCode == this.ruleForm.oneInd).children:[];
     },
      deep:true,
    },
    oldForm:{
      handler(culVal,oldVal){
        this.ruleForm = JSON.parse(JSON.stringify(culVal)); // 深拷贝给form，为了对比是否修改过数据
      }
    }
  },
  created() {
    this.getArea();
    this.getIndustryData();
    console.log("123123",this.ruleForm)
  },
  methods: {
    async getArea(){// 获取地区
      var response = await this.policyService.getArea();
      response.data.unshift({label: "全国", value: "000000"})
      this.options = response.data;
    },
    async getIndustryData() {// 获取行业领域数据
      this.industryData = JSON.parse(JSON.stringify(industryDataAll.list)); // 配置文件读取全国行业
      // let res = await this.StaticData.getIndustry({elementRelaConfId: 6});
    },
    allIndustry(){ // 二级行业全部选择
      if(this.ruleForm.oneInd){
        this.ruleForm.twoInd = this.twoIndustry.map(item => {
          return item.valuesCode;
        })
      }else{
        this.$message({ message: '请先选择一级行业',type: 'error'})
      }
    },
    selectOne(){  
      this.$forceUpdate();
      this.ruleForm.twoInd = [];  // 选择一级行业清空二级行业
      this.twoIndustry = this.ruleForm.oneInd?this.industryData.find(item => item.valuesCode == this.ruleForm.oneInd).children:[]; // 二级行业字段重新赋值
      let elementValues = this.industryData.find(item => item.valuesCode == this.ruleForm.oneInd).elementValues; // 获取选择的一级行业对应的中文名称
      let obj={
        code:this.ruleForm.oneInd,
        name:elementValues
      }
      return obj;
    },
    selectIndAll(){ // 获取选择的二级行业对应的中文名称
      let arr = [];
      arr = this.ruleForm.twoInd.map(item=>{
        return {
          code :item,
          name : this.twoIndustry.find(it=> it.valuesCode == item).elementValues
        }
      })
      arr.unshift(this.selectOne());
      return arr;
    },

    templateTypeAll(){ //获取检查表类型
      let arr = 0;
      this.ruleForm.templateType.map(item=>{
        arr=arr+Number(item)
      })
      return arr;
    },


    mbleData(){  // 组装请求创建或修改的报文
      let Data ={
        title :this.ruleForm.title,
        areaCode:this.ruleForm.areaCode,
        branchCode:sessionStorage.getItem("branchCode"),
        channelCode:"safety",
        createBy:sessionStorage.getItem("userName"),
        templateStatus:this.ruleForm.templateStatus,
        templateType :this.templateTypeAll(),
        checkType :"1", // 1代表事故预防检查表，郭宏伟让写死传1
        industrys:this.selectIndAll(),
      }
      return Data;
    },
    async subData(){ // 组装接口请求数据

      
      let res= await this.accidentCheck.subCheckTep(this.mbleData());
     
      if(res.data.code=="0000"){
        this.$emit("upData",true);
        this.$message({ message: '创建成功',type: 'success'})
      }
    },
    async putData(){  //  修改模板接口
      let Data = this.mbleData();
      Data.id=this.ruleForm.id;
      let rest = await this.accidentCheck.putCheckTep(Data);
      if(rest.data.code == "0000"){
        this.$emit("upData",true);
        this.$message({ message: '修改成功',type: 'success'})
      }
    },
    formContrast(){  // 表单对比
      let contrast = false;
      let oldForm =  JSON.stringify(this.oldForm); // 旧表单数据
      let culForm = JSON.stringify(this.ruleForm); // 是否修改表单数据
      if(oldForm != culForm){
        contrast = true;
      }
      return contrast;
    },
    goList(){
      this.$refs["ruleForm"].validate(valid => {
        if(valid){
          if(this.ruleForm.templateCode){
            if(this.formContrast()){
              this.putData();
              this.centerDialogVisible = false;
            }else{
              this.$message({ message: '请修改内容再提交',type: 'error'})
            }
            console.log(this.formContrast());
            
          }else{
            this.subData();
            this.centerDialogVisible = false;
          }
          
        }
      })
    },
  }
}

</script>
<style lang="less">
	#AcciInventory {
    .ibox-content{
      width:700px;
    }
    .wit41{
      width:410px;
    }
    .wid250{
      width:250px;
    }
    .swi-status{
      vertical-align: middle;
    }

	}

</style>
