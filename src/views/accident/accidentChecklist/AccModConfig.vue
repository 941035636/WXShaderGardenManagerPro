<template>
  <div id="AccModConfig">
    <div class="wrapper-content">
    <ProjectBasic @creatInfo="creatInfo" :topicList="list" :topicBasic="basicForm" :psState="queState"></ProjectBasic>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" center width="600px">
      <el-form :model="siteForm" :rules="rules" ref="siteForm">
        <el-form-item label="检查项目名称" label-width="120px" prop="placeName">
          <el-input
            maxlength="30"
            placeholder="请输入检查项目名称"
            v-model.trim="siteForm.placeName"
            size="small"
            class="wid7"
          ></el-input>
        </el-form-item>
        <div class="dialog-footer" style="text-align:center;">
          <el-button round @click="dialogFormVisible = false">取 消</el-button>
          <el-button round type="primary" @click="submitForm('siteForm')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    </div>
  </div>
</template>
<script>
import accidentCheckService from "@/service/accidentCheckService.js";
import ProjectBasic from "./ProjectBasic";  // 项目的基本信息
import {CodeToText,} from 'element-china-area-data'
export default {
  data(){
    return{
      accidentCheck:new accidentCheckService(), // Service
      dialogFormVisible:false,
      title:"",
      total:"0",
      list:[],  // 检查项集合
      state:"", // 检查项状态（编辑或创建）
      queState:"", // 子组件页面字段控制
      siteObj:"", // 编辑当前的检查项集合
      siteForm:{
        placeName:"",
      },
      basicForm:{},
      rules:{
        placeName:[{required: true, message: "请输入检查项目名称", trigger: "blur" }]
      }
    }
  },
  components:{
    ProjectBasic,
  },
  created(){
    this.getData();
  },
  methods:{
    async getData(){
      let res = await this.accidentCheck.dilsCheckTep(this.$route.query.id) // 获取模板详情接口
      if(res.code=="0000"){
        var detail = res.data;
        let industry = JSON.parse(detail.industry)  // 转换返回的json字符串
        detail['Ind']= industry.map(it=>{  // 行业用逗号拼接，方便展示
            return it.name
          }).join(",")
        if(detail.areaCode == "000000"){    // 自定义全国编码
          detail['areaName'] = "全国"
        }else{
          detail['areaName'] = CodeToText[detail.areaCode];  // 地区编码转换，展示使用
        }    
        this.basicForm = detail;
      }
      this.getTopList();
    },
    async getTopList(){ // 获取题目列表
      let data = {
        templateCode:this.basicForm.templateCode  
      }
      let rest = await this.accidentCheck.getChecList(data) // 获取添加的检查项列表
      if(rest.code == "0000"){
        this.list = rest.list;
        this.total = rest.total;  
      }
    },
    async creatGroup(){   // 创建检查项
      let data = [{
        createBy:sessionStorage.getItem("userCode"),  //创建人 ,
        name :this.siteForm.placeName, // 检查项名称 ,
        sort :this.total +1 , // 排序 ,
        templateCode :this.basicForm.templateCode, // 
      }]
      let res = await this.accidentCheck.subCheckGroup(data)  // 创建检查项接口
      if(res.code == "0000"){
        this.dialogFormVisible = false;
        this.getTopList();
      }
    },
    async siteData(){  // 编辑检查项
      let data = [{
        name:this.siteForm.placeName, // 活动名称
        id:this.siteObj.id,  
        templateCode :this.basicForm.templateCode,  // 模板code
        groupCode:this.siteObj.groupCode,  // 检查项code
        sort:this.siteObj.sort,   // 排序
      }]
      let res = await this.accidentCheck.putCheckGroup(data)  // 修改接口
      if(res.code == "0000"){
        this.dialogFormVisible = false;
        this.getTopList();  // 修改后重新获取列表接口
      }
    },
    rulesName(){  // 验证添加的名称是否存在，
      let resName = true; 
      console.log("1213333",this.list)
      if(this.list.length>0){
        this.list.forEach(item=>{
        if(item.name == this.siteForm.placeName){
            resName=false;
          }
        })
      }
      return resName;
    },
    submitForm(){  // 提交按钮
      this.$refs["siteForm"].validate(valid => {
        if(valid && this.rulesName()){
          if(this.state == "2"){  
            this.creatGroup();  //创建
          }else{
            this.siteData();   // 编辑
          }
        }else{
          this.$message({ message: '名称不可重复',type: 'error'})
        }
      })
    },
    creatInfo(val){
      if(val == "2"){
        this.dialogFormVisible = true;
        this.title = "创建检查项目"
        this.state = val;
        this.siteForm.placeName = "";
      }else{
        this.dialogFormVisible = true;
        this.title = "编辑检查项目"
        this.siteObj = val
        this.state = "";
        this.siteForm.placeName = val.name;
      }
    }
  }
};
</script>
<style lang='less' scoped>
	#AccModConfig {
		margin: 20px;
		.wid7{
			width:70%;
		}
		.skyblue {
			color: #E6A23C;
			cursor: pointer;
		}
	}
</style>