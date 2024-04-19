<template>
  <div id="Multi">
    <div class="multi">
      <el-form label-width="172px" label-position="right" :model="crossForm" :rules="rules" ref="crossForm" >
        <div v-if="dateMulti || dateMultiCZ">
           <p class="mb20 ml93"><span class="tips3"><i class="el-icon-warning mr10"></i>跨期业务 </span> </p>
          <el-form-item label="收入确认时点" prop="incomeDate" v-if="dateMulti">
            <el-date-picker
              v-model="crossForm.incomeDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
            <el-checkbox class="pl20" v-model="checked" @change="changeCheck">无法佐证跨期确认原因</el-checkbox>
          </el-form-item>
          <el-form-item label="佐证原因" v-if="(true || dateMultiCZ ) && typeName !='CZ'" prop="proofReason">
            <el-select v-model="crossForm.proofReason" placeholder="请选择佐证原因" size="small" clearable :disabled="checked" style="width:400px;">
              <el-option
                v-for="(item,index) in proofList"
                :key="index"
                :label="item.elementValues"
                :value="item.valuesCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="佐证原因:" v-if="(!checked || dateMultiCZ ) && typeName =='CZ'">
              <span class="ml20">{{proofReason}}</span> 
          </el-form-item>

          <el-form-item v-if="crossForm.proofReason == '08' " prop="proofReasonOther">
            <el-input size="small" v-model="crossForm.proofReasonOther" placeholder="请输入佐证原因" style="width:412px;"></el-input>
          </el-form-item>

          <el-form-item label="佐证文件" prop="proofFile" v-if="!checked && dateMulti" >
            <div class="updatamain">
              <el-upload
                ref="upload"
                :action="resourcesService.uploadFileUrl('sequip-svc','epolicy',0)"
                :data="upLoadData"
                :multiple="true"
                list-type="text"
                :on-success="otheruploadsuccess"
                :file-list="fileList"
                :limit="1"
                :auto-upload="true"
                name="files"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                class="upload-demo"
              >
                <el-button
                slot="trigger"
                size="small"
                type="primary"
                >上传文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：PDF.DOCX.JPG.DOC文件格式</div>
              </el-upload>
            </div>
          </el-form-item> 
        </div>
        
        <div v-if="dateCompare">
          <p class="tips3 mb20 ml93"><i class="el-icon-warning mr10"></i>签发日期晚于保险起期</p>
          <el-form-item label="原因" prop="proof">
            <el-select v-model="crossForm.proof" placeholder="请选择原因" size="small" clearable>
              <el-option
                v-for="(item,index) in issueList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div> 
      </el-form> 
    </div>
  </div>
</template>
<script>
import ResourcesService from "@/service/ResourcesService.js";
import CorrectionManagement from "@/service/CorrectionManagement.js";
import { elevator } from '@/server/accidenServer.js'
import store from "../../../store/index"
import moment from "moment";
export default {
  props:{
    // 时间判断条件
    multiData:{
      type:Object,
      required: true,
      default: ()=>{return {}}
    },
    // 提交form数据
    crossForm:{
      type:Object,
      required: true,
      default: ()=>{return {}}
    },
    // 不同功能传入标识
    typeName:{
      type:String,
      required: true,
      default: ()=>{return }
    },
    YEFlag:{
      type:Boolean,
      required: false,
      default: ()=>{return }
    },
  },
  store,
  data(){
    return{
      resourcesService: new ResourcesService(),
      CorrectionManagement: new CorrectionManagement(),
      proofReason:'',
      adsService:new elevator(),
      checked:false, // 勾选状态
      periodData:{}, // 业管系统当前会计期间
      dateMulti:false, // 控制签发日期是否跨期展示
      dateCompare:false, // 控制签发日期晚于保险起期的展示
      dateMultiCZ:false, // 冲正展示控制
      fileList: [],
      upLoadData: {
        channelcode: this.$route.query.appCode,
        resCode: "A002"
      },
      proofList:[],
      issueList:[
         {
          label:"保险公司出具延迟",
          value:"01"
        },
        {
          label:"框架协议/保险协议签署流程延迟",
          value:"02"
        },
        {
          label:"先出暂保单后出正式保单",
          value:"03"
        },
        {
          label:"协议约定",
          value:"04"
        },
        {
          label:"其他",
          value:"05"
        },
      ],
      rules:{
        incomeDate: [{type: "string",required: true,message: "请选择日期",trigger: "change"}],
        proofReason: [{type: "string",required: true,message: "请选择原因",trigger: "change"}],
        proofFile: [{ required: true, message: "请上传文件", trigger: "blur" }],
        proof: [{type: "string",required: true,message: "请选择原因",trigger: "change"}],
        proofReasonOther: [{type: "string",required: true,message: "请输入具体原因",trigger: "change,blur"}]
      },
    }
  },
  watch:{
    multiData:{
      handler(curVal,oldVal){
        if(curVal.startDate && curVal.validDate && this.typeName !="CZ" &&  this.typeName !="CZPD"){
          curVal.validDate = moment(curVal.validDate).format("YYYY-MM-DD 00:00:00")
          this.dateCompare = curVal.validDate >= curVal.startDate; // 签单日期大于保险起期
          //区间起期大于签单日期或者区间止期小于签单日期
          this.dateMulti = this.periodData.fperiodStart > curVal.validDate || this.periodData.fperiodEnd < curVal.validDate
          if(this.YEFlag) {
            if(this.proofList.findIndex(i => i.valuesCode == '04') != -1 ) {
              this.proofList.splice(this.proofList.findIndex(i => i.valuesCode == '04'),1);
            }
            if(this.proofList.findIndex(i => i.valuesCode == '07') != -1 ) {
              this.proofList.splice(this.proofList.findIndex(i => i.valuesCode == '07'),1);
            }
          }
        }else if(curVal.validDate && this.typeName =="CZPD") {
          //区间起期大于签单日期或者区间止期小于签单日期
          this.dateMulti = this.periodData.fperiodStart > curVal.validDate || this.periodData.fperiodEnd < curVal.validDate
        }
        else if(curVal.validDate && this.typeName =="CZ") {
          let obj ={};
          if(curVal.orderType == 1) { //保单
            obj = {
              applyCode:curVal.appCode,
              policyNo:curVal.correctNo,
              policyType:1,
              signTime:moment(curVal.validDate).format("YYYYMMDD")
            }
          } else if(curVal.orderType == 2) { //保单
            obj = {
              endorsementApplyNo:curVal.appCode,
              policyType:2,
              signTime:moment(curVal.validDate).format("YYYYMMDD")
            }
          }
          this.CorrectionManagement.putSearchKQFlag(obj).then(rest => {
            if(rest.code == '0000') {
              this.dateMultiCZ = false
              this.crossForm.proofReason = ''
              this.proofReason = ''
            } else if(rest.code == '1111') {
              this.dateMultiCZ = true
              this.crossForm.proofReason = '05'
              this.proofReason = '冲正调整重新确认数据'
            } else {
              if(curVal.kuaQiFlag) {
                let data = moment(curVal.validDate).format("YYYY-MM-DD 00:00:00")
                this.dateMultiCZ = this.periodData.fperiodStart > data || this.periodData.fperiodEnd < data
                if(this.dateMultiCZ) {
                  this.crossForm.proofReason = '05'
                  this.proofReason = '冲正调整重新确认数据'
                } else {
                  this.crossForm.proofReason = ''
                  this.proofReason = ''
                }
              } else {
                let mouth = (new Date(curVal.signTime).getMonth() + 1) > 10 ? (new Date(curVal.signTime).getMonth() + 1) : '0' + (new Date(curVal.signTime).getMonth() + 1);
                let str = new Date(curVal.signTime).getFullYear().toString() + mouth;
                let fperiodStart = moment(new Date(curVal.signTime).setDate(1)).format("YYYY-MM-DD 00:00:00");
                let fperiodEnd = new Date(curVal.signTime);
                fperiodEnd.setMonth(new Date(curVal.signTime).getMonth()+1);
                fperiodEnd.setDate(0); 
                fperiodEnd = moment(fperiodEnd).format("YYYY-MM-DD 23:59:59");
                this.adsService.getPeriod({'fperiod':str}).then(rest => {
                  if(rest.code == "0000" && rest.list){
                    fperiodStart = moment(new Date(curVal.signTime).setDate(1)).format("YYYY-MM-DD 00:00:00");
                    fperiodEnd = moment(new Date(rest.list[0].fperiodEnd)).format("YYYY-MM-DD 23:59:59"); 
                  }
                  let data = moment(curVal.validDate).format("YYYY-MM-DD 00:00:00")
                  this.dateMultiCZ = (this.periodData.fperiodStart <= data && this.periodData.fperiodEnd > data) || (fperiodStart <= data && fperiodEnd > data) ? false:true;
                  if(this.dateMultiCZ) {
                    this.crossForm.proofReason = '05'
                    this.proofReason = '冲正调整重新确认数据'
                  } else {
                    this.crossForm.proofReason = ''
                    this.proofReason = ''
                  }
                })
              }
            } 
          })
        } else {
          this.dateMulti = false; // 控制签发日期是否跨期展示
          this.dateCompare = false; // 控制签发日期晚于保险起期的展示
          this.dateMultiCZ = false; // 冲正展示控制
        } 
      },
      deep:true
    }
  },
  created(){
    this.getPeriodData();
    this.getSelectData();
    if(this.$route.query.flag == 'again') {
			this.setEditDate()
		}
  },
  methods:{
    async checkDate(data) {
      await this.getPeriodData();
      this.multiData.validDate = data;
      if(!data) {
        this.crossForm.proofReason = ''
      }
    },
    setEditDate() {
      let data = this.$store.getters.cross;
      if(!data) {
        return
      }
      if(data.incomeDate) {
        this.dateMulti = true;
        if(!data.proofReason) {
          this.checked = true;
          this.crossForm.proofReason= "";
          this.crossForm.proofReasonOther= "";
          this.crossForm.proofFile= [];
          this.crossForm.incomeDate = data.incomeDate
        }
        this.crossForm = data;
        this.fileList = data.proofFile;
      } else {
        this.dateMulti = false;
      }
      if(data.proof) {
        this.dateCompare = true;
        this.crossForm.proof = data.proof;
      } else {
        this.dateCompare = false;
        this.crossForm.proof = '';
      }
    },
    async getPeriodData(){ // 区间时间处理
      var firstDate = new Date();
      firstDate.setMonth(firstDate.getMonth()-1);
      firstDate.setDate(1); //第一天
      var endDate = new Date();
      endDate.setMonth(new Date().getMonth()+1);
      endDate.setDate(0); 
      let firsTime = moment(firstDate).format("YYYY-MM-DD 00:00:00"); // 当月第一天
      let lastTime = moment(endDate).format("YYYY-MM-DD 23:59:59"); // 当月最后一天
      let year = firsTime.substring(0,7).split('-')[0]; // 分隔时间获取年
      let month = firsTime.substring(0,7).split('-')[1];// 分隔时间获取月
      let data = {
        fperiod:year+month
      }
      this.periodData.fperiodStart = moment(new Date().setDate(1)).format("YYYY-MM-DD 00:00:00");  // 区间开始时间
      // 区间结束时间接口获取的止期，如果接口为空，就使用当月的最后一天作为区间止期
      let rest = await this.adsService.getPeriod(data)
      if(rest.code == "0000" && rest.list && moment(new Date(rest.list[0].fperiodEnd)).format("YYYY-MM-DD 23:59:59") > moment(new Date()).format("YYYY-MM-DD HH:mm:ss")){
        this.periodData.fperiodStart = firsTime;
        this.periodData.fperiodEnd = moment(rest.list[0].fperiodEnd).format("YYYY-MM-DD 23:59:59"); 
      }else{
        this.periodData.fperiodStart = moment(new Date().setDate(1)).format("YYYY-MM-DD 00:00:00");
        this.periodData.fperiodEnd = lastTime;
      }
    },
    async getSelectData() {
      let rest = await this.adsService.getSelectData();
      if(rest.code == '0000') {
        console.log(rest)
        this.proofList = rest.data.orgElementRelaValuesVMList;
      }
    },
    changeCheck(){ // 勾选
      if(this.checked){
        this.crossForm.incomeDate = this.multiData.validDate;
        this.crossForm.proofReason= "12";
        this.crossForm.proofReasonOther= "";
        this.crossForm.proofFile= [];
      }else{
        this.crossForm.incomeDate = "";
        this.crossForm.proofReason= "";
      }  
    },
     // 判断上传附件格式
    beforeUpload(file) {
      //const isLt2M = file.size / 1024 / 1024 < 30;
      console.log(file);
      var fileName = file.name;
      var suffixIndex = fileName.lastIndexOf(".");
      var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
      // doc、docx、pdf、jpg
      if (
        suffix != "doc" &&
        suffix != "docx" &&
        suffix != "pdf" &&
        suffix != "jpg" &&
        suffix != "png" &&
        suffix != "zip" &&
        suffix != "rar" &&
        suffix != "pptx" &&
        suffix != "xlsx" &&
        suffix != "xls"
      ) {
        this.$message.error(
          "只能上传doc、docx、pdf、jpg、png、zip、rar、pptx、xlsx、xls"
        );
        return false;
      }
    },
    otheruploadsuccess(response, file, fileList) {
      this.myfileList = [];
      for (let i = 0; i < fileList.length; i++) {
        this.myfileList.push({
          id: fileList[i].response.list[0].fileId,
          type: fileList[i].response.list[0].resCode,
          name: file.name
        });
      }
      this.crossForm.proofFile = this.myfileList;
    },
    handleRemove(file, fileList) {
      if (file.response) {
        let removeId = file.response.list[0].fileId;
        let n = this.myfileList.findIndex(it => it.id == removeId); //获取匹配到的id在数组中的下标
        if (n != -1) {
          this.myfileList.splice(n, 1); //删除匹配项
        }
      }
    },
    sava() {
      //验证页面必填项
      let flag = false;
      this.$refs["crossForm"].validate(valid => {
        flag = valid;
      });
      return flag;
    },
  }
}
</script>
<style lang="less">
  #Multi{
    .multi{
      margin:20px 0 0 40px;
      padding-bottom: 40px;
    }
    .tips3{
      color:#FF7875;
    }
    .upload-demo {
      .el-upload__tip {
        color: #8C97C8;
        margin-top: 0;
        position: absolute;
        top:0;
        left:100px;
      }
      .el-upload--text{
        width: 80px !important;
        height: 40px !important;
        border:none !important;
      }
    }
    .ml93 {
      margin-left: 93px;
    }
  }
</style>