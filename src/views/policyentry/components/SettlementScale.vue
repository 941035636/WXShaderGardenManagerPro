<template>
  <div id="SettlementScale">
    <el-form :model="settForm" label-width="130px" label-position="left">
      <el-form-item label="保单保费" required>
        <el-row>
          <el-col :span="22">
            <el-row>
              <el-col :span="3">
                <span>{{cost}}元</span>
              </el-col>
              <el-col :span="6" v-if="settForm.isPayType == '2'">
                <span>是否分别转付</span>
                <el-radio-group v-model="settForm.transfer" v-for="(item,index) in transferList" :key="index">
                  <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="8" v-if="settForm.isPayType == '2' && settForm.transfer =='2'">
                <span>转付公司</span>
                <el-select
                  v-model="settForm.transferCompany"
                  filterable
                  remote
                  default-first-option
                  reserve-keyword
                  placeholder="请输入承保公司"
                  :remote-method="remoteMethod"
                  @change="dealCompany()"
                  class="w70p"
                  size="small"
                  @focus="dealChange"
                >
                  <el-option
                    v-for="(item, index) in companyList"
                    :key="index"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6" v-if="settForm.isPayType == '2' && settForm.transfer =='2'">
                <span>转付保费</span>
                <el-input style="width:50%" v-model="cost" size="small" :disabled="true"></el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" style="text-align: center;" v-if="$parent.viewFlag">
            <el-button size="small" @click="$parent.reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass" :span-method="objectSpanMethod">
      <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
      <el-table-column  label="承保公司" align="center" min-width="150"> 
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column  label="转付公司" align="center" min-width="200" v-if="settForm.isPayType == '2' && settForm.transfer =='1'">
        <template slot-scope="scope">
          <RemoteSelects
            v-model="scope.row.name"
            :settRow="scope.row"
            :echoSize="'small'"
            :echoUnderwritingCompany="scope.row.name"
            :echoUnderwritingCompanyCode="scope.row.code"
            :echoStyle="'width: 100%'"
            :echoPlaceholder="'请输入结算公司'"
          />
        </template>
      </el-table-column>
      <el-table-column  label="是否出单" align="center" min-width="80">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.isIssue" v-for="(item,index) in taxList" :key="index">
            <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column  label="承保比例（%）" align="center" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.ratio }}
        </template>
      </el-table-column>
      <el-table-column  label="保单号" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.plicyNo }}
        </template>
      </el-table-column>
      <el-table-column  label="" min-width="80" align="center">
        <template slot-scope="scope">
          <div class="mb20"> 
            <el-button type="primary" size="small" @click="countPremium">计算</el-button>
          </div>
          <div>
            <el-button size="small" @click="resetData">重置</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="保费(元)" width="120" align="center">
        <template slot-scope="scope" v-if="scope.row.amount">
          {{ scope.row.amount }} 
        </template>
      </el-table-column>
    </el-table>
    <div class="mt20 mb20">
      <span>佣金支付方式：保险公司</span>
    </div>

    <el-table :data="tableList" border style="width: 100%;" :header-cell-style="getRowTitle" :span-method="arrSpanMethod">
      <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
      <el-table-column  label="承保公司" align="center" min-width="120"> 
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column  label="结算保险公司" align="center" min-width="200">
        <template slot-scope="scope">
          <RemoteSelects
            v-model="scope.row.name"
            :settRow="scope.row"
            :echoSize="'small'"
            :echoUnderwritingCompany="scope.row.companyName"
            :echoUnderwritingCompanyCode="scope.row.companyCode"
            :echoStyle="'width: 100%'"
            :echoPlaceholder="'请输入结算公司'"
          />
        </template>
      </el-table-column>
      <el-table-column  label="结算金额是否含税" align="center" min-width="80">
        <template slot-scope="scope">
          <div v-if="!scope.row.flag">
            <el-radio-group v-model="scope.row.hasTax" :disabled="scope.row.disabled" v-for="(item,index) in taxList" @change="changeCount(scope.row,1)" :key="index">
              <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="scope.row.flag">
            --
          </div>
        </template>
      </el-table-column>
      <!-- /佣金金额  7月24因批单从新计算的问题（特设和安责都无固定的情况所以隐藏） -->
      <el-table-column  label="佣金率（%）" align="center" min-width="150">
        <template slot-scope="scope">
          <div v-if="!scope.row.flag">
            <!-- <el-radio-group v-model="scope.row.commissionType" @change="changeCount(scope.row,2)" v-for="(item,index) in commissionList" :key="index">
              <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
            </el-radio-group> -->
            <el-input class="w120" @change="changeCount(scope.row,3)" v-model="scope.row.commissionValue" placeholder="请输入"></el-input>
          </div>
          <div v-if="scope.row.flag">
            --
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="" min-width="60" align="center">
        <template slot-scope="scope">
          <div class="mb20"  v-if="scope.row.btn"> 
            <el-button type="primary" size="small" @click="countSett()">计算</el-button>
          </div>
          <div>
            <el-button size="small" @click="resetTable">重置</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="结算金额（元）" width="120" align="center">
        <template slot-scope="scope">
         <div v-if="!scope.row.flag && !scope.row.flagInput">
          {{ scope.row.settlementAmount }}
         </div>
         <div v-if="scope.row.flag || scope.row.flagInput">
           <el-input class="w100" v-model="scope.row.settlementAmount"></el-input>
         </div>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="120" align="center">
        <template slot-scope="scope">
          <span @click="addTable(scope.row,scope.$index)" class="pointer color-blue">添加</span>
          <span @click="delTable(scope.row,scope.$index)" class="pointer color-blue">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="mt20">
      <el-form-item label="单位名称" prop="name">
        <el-select v-model="settForm.settlementBranch" filterable remote placeholder="请选择" clearable  class="wid271" @change="getDepart">
          <el-option
            v-for="(item,index) in branchList"
            :key="index"
            :label="item.jtBranchName"
            :value="item.jtBranchCode"
            filterable
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核算部门" prop="code">
        <el-cascader
          v-model="settForm.settlementDepartment"
          placeholder="请选择"
          :options="departList"
          clearable
          @change="changeDepar"
          filterable
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'code',
            children: 'children',
          }"></el-cascader>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:20px;">
      <el-button size="medium" @click="resetScale">返回</el-button>
      <el-button type="primary" size="medium" @click="submit">下一步</el-button>
    </div>
  </div>
</template>
<script>
import policyentryService from "@/service/PolicyentryService";
import userManageService from '@/service/userManageService'
import RemoteSelects from "./RemoteSelect";
export default{
  props:{
    cost:{
      default: ()=>{return []},
      required: true,
      type: String
    },
    settForm:{
      default: ()=>{return []},
      required: true,
      type: Object
    }
  },  
  components:{
		RemoteSelects
	},
  data() {
		return {
      policyentryService: new policyentryService(),
      userManageService: new userManageService(),
      ruleForm:{
        name:"",
        code:""
      },
      companyList:[],
      newCompanyList:[], // 保险公司集合，（防止新增不同保险公司时显示编码的问题）
      tableData:[],
      tableList:[],
      branchList:[], // 机构集合
      departList:[], // 部门集合
      taxList:[
        {
          name:"是",
          code:"01",
        },
        {
          name:"否",
          code:"00",
        },
      ],
      commissionList:[
        {
          name:"比例",
          code:"00"
        },
        {
          name:"固定",
          code:"01"
        },
      ],
      transferList:[
        {
          name:"是",
          code:"1"
        },
        {
          name:"否",
          code:"2"
        },
      ],
      rules:{}
		};
	},
  watch: {
    tableData: {
      handler(n, o) {
        this.objectSpanMethodB(this.tableData)
      },
      immediate: true
    },
  },
  methods:{
    async remoteMethod(query) {
      if (query !== "") {
        let res = await this.policyentryService.getCompanyList(query);
        if (res.code == "0000") {
          if (res.list.length == 0) {
            this.$message.error("查询不到保险公司！");
          }
          this.companyList = this.$stringHelper.mergeArray(
            this.newCompanyList,
            res.list
          );
        }
      } else {
        this.companyList = [];
      }
    },
    dealCompany() {
      val.name = this.companyList.find( item => item.companyId == this.settForm.transferCompany).companyName
      this.newCompanyList.push(
        this.companyList.find((item) => item.companyId == this.settForm.transferCompany)
      );
    },
    //处理承保公司
    dealChange() {
      this.companyList = this.$stringHelper.basicUnique(
        this.newCompanyList,
        "companyId"
      );
    },
    async getBranch(){ // 获取分支机构   根据数据权限筛选
      let jtBranchs = window.sessionStorage.getItem('authBranchDataInfo') || ''
      let jtBranchsList = [];
      let res = await this.userManageService.getBranchInfo();
      if(res.data.code == '0000'){
        if(jtBranchs && jtBranchs.indexOf(",") != -1) {
          jtBranchsList = jtBranchs.split(",")
        } else {
          jtBranchs == '000000' ? jtBranchsList = ['000000'] : jtBranchsList = [jtBranchs]
        }
        if(jtBranchsList.indexOf('000000') !=-1){
          this.branchList = res.data.list
        }else{
           this.branchList = res.data.list.filter(item=> jtBranchsList.find(it => it == item.jtBranchCode ||  item.jtBranchCode == 'JT0000'));
        }
      }     
    },
    async getDepart(){ // 获取机构下部门
      let data = {
        conditions:{
          parentCode:this.settForm.settlementBranch
        }
      }
      let res = await this.userManageService.getBranchTree(data);
      if(res.data.code == '0000'){
        this.departList = res.data.list;
      }
      if(this.settForm.settlementBranch){ //  获取单位中文名称
        this.settForm.settlementBranchName = this.branchList.find(item => item.jtBranchCode == this.settForm.settlementBranch).jtBranchName
      }
    },
    changeDepar(val){ //  获取部门中文名称
      if(val.length>0){
        this.settForm.settlementDepartmentName = this.departList.find(item => item.code == val[0]).name
      }
    },
    countPremium(){ // 计算保费
      this.tableData.forEach(item => {
        item.amount = ((item.ratio *  this.cost) / 100).toFixed(4)
      })
      let dataArrTemp = JSON.stringify(this.tableData);
      this.tableData= JSON.parse(dataArrTemp);
    },
    changeCount(val,num){ //变更是否含税、比例、佣金金额清空结算金额  
      val.settlementAmount = ""
      //hasTax:01,// 含税
      //commissionType：01 固定比例
      if(num == 1 || num == 2){
        if(val.hasTax){
          if(val.commissionType == '01'){
            val.disabled = true;
            val.hasTax = '01' 
          }else{
            val.disabled = false;
          }
        }else{
          val.disabled = false;
        }
        if(val.commissionType == '01'){
          val.disabled = true;
          val.hasTax = '01' 
        }else{
          val.disabled = false;
        }
      }
      // 解决修改值时table不实时更新的问题
      let dataArrTemp = JSON.stringify(this.tableList);
      this.tableList= JSON.parse(dataArrTemp);
    },
    countSett(type){
      this.settForm.commissionTotal = 0;
      if (this.verifPremium(this.tableList)) {
        return this.$message.error(this.verifPremium(this.tableList));
      }
      this.tableList.forEach(item => {
        if(!type){
          if(!item.flag ){
            item.commissionValue = item.commissionValue*100/100
            console.log(item.commissionValue,"console.log(item.commissionValue)")
            if(item.commissionValue && item.commissionValue !='0'){
              if(item.hasTax =='01' && item.commissionType == '00'){
                item.settlementAmount = ((item.ratio *  this.cost * item.commissionValue) / 10000).toFixed(4)
              }else if(item.hasTax =='01' && item.commissionType == '01'){   
                item.settlementAmount = item.commissionValue;
              }else if(item.hasTax =='00' && item.commissionType == '00'){
                item.settlementAmount = (((item.ratio *  this.cost * item.commissionValue) / 10000)/1.06).toFixed(4)
              }else if(item.hasTax =='00' && item.commissionType == '01'){
                item.settlementAmount = item.commissionValue;
              }
            }
            item.oldAmount = item.settlementAmount , // 计算出来的结算金额赋值给新字段，（投保报文计算结算比例使用）
            this.settForm.commissionTotal += Number(item.settlementAmount)
          }
        }else{
          if(!item.flag ){
            item.commissionValue = item.commissionValue*100/100
            console.log(item.commissionValue)
            if(item.commissionValue && item.commissionValue !='0'){
            if(item.hasTax =='01' && item.commissionType == '00'){
              item["settlementAmount1"] = ((item.ratio *  this.cost * item.commissionValue) / 10000).toFixed(4)
            }else if(item.hasTax =='01' && item.commissionType == '01'){   
              item["settlementAmount1"] = item.commissionValue;
            }else if(item.hasTax =='00' && item.commissionType == '00'){
              item["settlementAmount1"] = (((item.ratio *  this.cost * item.commissionValue) / 10000)/1.06).toFixed(4)
            }else if(item.hasTax =='00' && item.commissionType == '01'){
              item["settlementAmount1"] = item.commissionValue;
            }
          }
          item.oldAmount = item.settlementAmount1 , // 计算出来的结算金额赋值给新字段，（投保报文计算结算比例使用）
          this.settForm.commissionTotal += Number(item.settlementAmount1)
          }
        }
      })
      let dataArrTemp = JSON.stringify(this.tableList);
      this.tableList= JSON.parse(dataArrTemp);
    },  
    getCompanyRatio(type){ 
      if(type == '1' || type =='3'){  // 重置承保公司table
        this.tableData = JSON.parse(JSON.stringify(this.$store.getters.companyRatio));
      }
      if(type == '2' || type =='3'){ // 重置结算公司table
        this.tableList = JSON.parse(JSON.stringify(this.$store.getters.companyRatio));
        this.tableList.forEach(item => { 
          item.companyCode = item.code;  // 承保公司编码（回显使用）
          item.companyName = item.name; 
          item.commissionType = '00'
          item.btn = '1';
          item.disabled = false
        })
      }
    },
    viewData(){
      this.tableData = JSON.parse(JSON.stringify(this.$store.getters.companyForm.tableData));
      this.tableList = JSON.parse(JSON.stringify(this.$store.getters.companyForm.tableList));
      this.settForm.settlementDepartment = this.$store.getters.companyForm.settlementDepartment
      this.settForm.settlementBranch = this.$store.getters.companyForm.settlementBranch
      this.settForm.commissionTotal = this.$store.getters.companyForm.commissionTotal
      this.getBranch()
      this.getDepart();
    },  
    addTable(val,index){
      if(this.tableList.find(item => item.flag)){
        return this.$message.error('只能添加一家结算公司')
      }
      if(this.tableList.find(item => item.settlementAmount) ==undefined){
        return this.$message.error('请先计算再添加')
      }
      if(!val.flag){  // falg为新增的集合标识，当新增集合点击添加时，再新增不添加flagInput，oldAmount
        val['flagInput'] = true; // 母结算公司标识
        // val['oldAmount'] = val.settlementAmount // 计算出的结算金额（给新字段赋值，删除新增后需回显）
      }
      let obj = {
        companyCode:val.companyCode, // 承保公司编码
        companyName:val.companyName, 
        code:val.code, // 结算公司编码
        name:val.name,
        hasTax:val.hasTax, // 保费是否含税
        commissionType:val.commissionType, // 佣金比例(%)/佣金金额(元)
        commissionValue:val.commissionValue, //佣金比例或佣金金额
        ratio:val.ratio,// 承保比例
        settlementAmount:"", // 结算金额
        btn:"1",
        flag:true, // 新增时展示input
        disabled:false, // 固定时是否含税为是不让选择
      }
      this.tableList.splice(index+1, 0, obj);
    },
    resetScale(){
      this.$emit('handleList',false)
    },
    delTable(row,index){
      if(row.flagInput || !row.flag){
        return this.$message.error('该承保公司下必须有一家结算公司，不能删除')
      }
      this.tableList.splice(index, 1)　
      this.tableList.forEach(item => {  // 当删除新增集合时，需要吧计算出来的值从新赋值给settlementAmount
        if(item.flagInput){ 
          item.flagInput = ""
         item.settlementAmount = item.oldAmount
        }
      })
    },
    resetData(){
      this.getCompanyRatio('1');
    },
    resetTable(){
      this.getCompanyRatio('2');
    },
    submit(){
      this.countSett(1);
      if (this.verifyForm()) {
        return this.$message.error(this.verifyForm());
      }
      this.tableList.forEach(item => {  // 提交时新增内联需和主承值一直
        if(item.flag){
          item.hasTax = this.tableList.find(it => it.flagInput).hasTax; // 保费是否含税
          item.commissionType =this.tableList.find(it => it.flagInput).commissionType; // 佣金比例(%)/佣金金额(元)
          item.commissionValue = this.tableList.find(it => it.flagInput).commissionValue;
        }
      })
      this.settForm['tableData'] = this.tableData;
      this.settForm['tableList'] = this.tableList;
      this.$store.commit("updateCompanyForm", this.settForm);
      this.$router.push({
				path: '/PolicyPreviewDetail',
        query:{
          type:true
        }
			});
    },
    verifyForm(){  // 页面表格校验
      let num =0;
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (!item.isIssue) {
          return "出单公司不能为空";
        } 
        if(!item.amount){
          return "承保公司保费（元）未计算";
        }
        if(item.isIssue == '01'){
          num ++
        }
      }
      if(num==0 || num>1){
        return "出单公司有且只能有一个，请正确勾选出单公司信息";
      }
      var isRepeat = this.$stringHelper.isRepeat(this.tableList,"code");
      if (isRepeat) {
        return "结算公司不可重复";
      }
      if (this.verifPremium(this.tableList,1)) {
        return this.verifPremium(this.tableList,1)
      }
      if(!this.verifSettAmount(this.tableList)){
        return `填写的结算金额累计应为${this.settForm.commissionTotal.toFixed(4)}元，请修改`
      }
      if(!this.settForm.settlementBranch){
        return "请选择单位名称";
      }
      if(!this.settForm.settlementDepartment){
        return "请选择核算部门";
      }
    },
    verifSettAmount(list){  // 新增结算公司时，计算出来的结算金额对比
      let sum = 0
      let sum1 =0;
      let state = true
      list.forEach(item => {
        if(!item.flag){
          sum += Number(item.settlementAmount)
        }
        sum1 += Number(item.settlementAmount)
      })
      console.log(sum1,"现有总金额")
      console.log(this.settForm.commissionTotal,"计算出来的总金额")
      if(sum1 != this.settForm.commissionTotal){
        state = false;
      }
      return state
    },
    verifPremium(list,type){
      console.log(list,"dfdfdf")
      let reg =   /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;  
      let regs = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      let regt= /^([1-9]\d*(\.\d{1,4})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      for (let i = 0; i < list.length;i++) {
        let item = list[i];
        if(!item.hasTax){
          return "结算金额是否含税不能为空";
        }
        if(!item.commissionType){
          return "佣金计算方式不能为空";
        }
        if(item.commissionValue == '' || !reg.test(item.commissionValue) && item.commissionType =='00'){
          return "佣金比例不能为空，并且为大于0小于等于100，小数保留2位";
        }
        if(item.commissionValue == '' || !regs.test(item.commissionValue) && item.commissionType =='01'){
          return "佣金金额不能为空，并且为大于0，小数保留2位";
        }
        if(item.commissionType == '01' && ((item.ratio *  this.cost) / 100).toFixed(4) < item.commissionValue){
          return "佣金金额不能大于承保保费";
        }
        if(!item.settlementAmount  && type){
          return "结算金额不能为空";
        }
        if(!regt.test(item.settlementAmount) && type){
          return "结算金额大于0，小数保留两位";
        }
      }
    },
    //合并列,(计算保费列表使用)
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // columnIndex === xx 找到第xx列，实现合并随机出现的行数
      if(this.settForm.isPayType == '1' || (this.settForm.isPayType == '2' && this.settForm.transfer =='2')){
        if (columnIndex === 5) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        } 
      }else{
        if (columnIndex === 6) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        } 
      }
      
    },
    // 合并列,(计算保费列表使用)
    objectSpanMethodB(data) {
      console.log("zmmm--",data)//从后台获取的数据
      this.spanArr = [];
      this.pos = 0;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].itemCode === data[i - 1].itemCode || data[i].itemName === data[i - 1].itemName) {
            // 如果itemCode相等就累加，并且push 0
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 合并列（计算列表使用）
    arrSpanMethod({ row, column, rowIndex, columnIndex }) {
			var beginIndex;
			var endIndex;
			for(var i=0;i<this.tableList.length;i++){
				var item = this.tableList[i];
				if(columnIndex == 5) {
					if(row.btn == item.btn) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
			}
			if((beginIndex || beginIndex == 0) && (endIndex || endIndex == 0) &&  beginIndex == rowIndex) {
				var row = endIndex - beginIndex + 1;
				return { rowspan: row, colspan: 1 };
			}else if(!endIndex) {
				return { rowspan: 1, colspan: 1 };
			}else{
				return { rowspan: 0, colspan: 0 };
			}
		},
    // 合并表头
    getRowTitle({ row, column, rowIndex, columnIndex }){
      if (row[5].level==1) {
        row[5].colSpan = 0;
        row[6].colSpan = 2;
        if (columnIndex === 5) {
          return { display: "none" };
        }
      }
			if (rowIndex == 0) {
				return "text-align:center";
			} else {
				return "";
			}
    },
    // 合并表头
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if(this.settForm.isPayType == '1' || (this.settForm.isPayType == '2' && this.settForm.transfer =='2') ){
        if (row[5].level==1) {
          row[5].colSpan = 0;
          row[6].colSpan = 4;
          if (columnIndex === 5) {
            return { display: "none" };
          }
        }
      }else{
        if (row[6].level==1) {
          row[6].colSpan = 0;
          row[7].colSpan = 4;
          if (columnIndex === 6) {
            return { display: "none" };
          }
        }
      }
			if (rowIndex == 0) {
				return "text-align:center";
			} else {
				return "";
			}
		},
  }
}
</script>
<style lang="less">
  #SettlementScale{
    background-color: #ffffff;
    font-size: 14px;
    color: #333333;
    padding-bottom: 30px;
    box-sizing: border-box;
    margin:0 40px;
    .w320{
      width:320px;
    }
  }
</style>