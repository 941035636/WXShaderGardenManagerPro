<template>
  <div id="userList">
    <div class="elesearch1">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">姓名：</span>
            <el-input
              maxlength="10"
              show-word-limit
              clearable
              v-model="ruleForm.conditions.name"
              class="item2"
              placeholder="请输入姓名"
            />
          </div>
        </el-col>
         <el-col :span="8">
          <div style="display: flex">
            <span class="item3">手机号：</span>
            <el-input
              show-word-limit
              clearable
              v-model="ruleForm.conditions.mobile"
              class="item2"
              placeholder="请输入手机号"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">专家类别：</span>
            <el-select
              v-model="ruleForm.conditions.expertType"
              placeholder="请选择专家类别"
              class="item2"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in expertList"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
            </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">归属渠道：</span>
            <el-select
              v-model="ruleForm.conditions.channelCode"
              placeholder="请选择归属渠道"
              class="item2"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in channel"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属分支机构：</span>
            <el-select
              v-model="ruleForm.conditions.branchCode"
              placeholder="请选择分支机构"
              class="item2"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in branchList"
                :key="index"
                :label="item.jtBranchName"
                :value="item.jtBranchCode"
              ></el-option>
            </el-select>
            </div>
        </el-col>
        </el-row>
        <el-row  type="flex" class="row-bg">
        <el-col>
            <div class="row-bg" style="text-align: right">
        <el-button @click="reset" size="medium" round class="empty-button"
          >重 置</el-button
        >
        <el-button
          type="warning"
          @click="seach"
          round
          size="medium"
          class="query-button mr20"
          >查 询</el-button
        >
      </div>
        </el-col>
         </el-row>
    </div>

    <div class="content">
      <div class="flexBetween">
        <p>
          查询列表 <span class="color-red">共计{{ total }}条记录</span>
        </p>
      </div>
      <div class="content-table mt10">
        <el-table
          :data="tableList"
          fit
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
          :cell-style="{ 'text-align': 'left' }"
        >
          <el-table-column
            min-width="80"
            prop="code"
            label="编号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="专家信息"
            show-overflow-tooltip
             min-width="150"
          >
            <template slot-scope="scope">
              <p >
                {{ scope.row.name }}({{scope.row.gender}}，{{scope.row.age}}) / 手机号：{{scope.row.mobile}}
              </p>
               <p>擅长领域：{{ scope.row.expertArea}}</p>
               <div class="expertTow">
                    <div class="expertA">{{scope.row.expertType}}</div>
                    <div class="expertB">{{scope.row.channel}}</div>
               </div>
                
            </template>
          </el-table-column>
          <el-table-column
            prop="post"
            label="职称"
            show-overflow-tooltip
             min-width="80"
          ></el-table-column>
          <el-table-column
            prop="postLevel"
            label="等级"
            show-overflow-tooltip
             min-width="50"
          ></el-table-column>

           <el-table-column
           min-width="150"
            label="专业/最高学历"
            show-overflow-tooltip
          > 
          <template slot-scope="scope">
              {{scope.row.major}}/{{scope.row.eduHigh}}
              </template>
          </el-table-column>
           <el-table-column
            prop="updateByName"
            label="分支机构与部门"
            show-overflow-tooltip
             min-width="150"
          >
          <template slot-scope="scope">
              {{scope.row.branchName}}/{{scope.row.departName}}
              </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="updateTime"
            label="录入人/录入时间"
            show-overflow-tooltip
          >
           <template slot-scope="scope">
               <p>{{scope.row.createName}}</p>
               <p> {{scope.row.createTime}}</p>
            </template>
          </el-table-column>
         
        </el-table>
        <div class="content-total">
          <BasePagenations
            :tolnum="total"
            @handleCurrentChange="handleCurrentChange"
            :currentPage="ruleForm.paging.pn"
            class="pr20"
          ></BasePagenations>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import relationExpert from "../../service/components/expertAdd.vue";
import { mapGetters } from "vuex";
import userManageService from '@/service/userManageService'
export default {
  name: "SafetyList",
  components: { relationExpert },
  data() {
    return {
      userManage: new userManage(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      userManageService: new userManageService(),
      ruleForm:
       {
         conditions:{  
            code:"",
            mobile:"",//手机号
            idNo:"", //专家证件号
            branchCode:"",//所属分支机构
            name:"",//姓名
            departCode:"", //部门编码
            expertType:"",//专家类别
            age:'',
            createName:"",
            channelCode:""//归属渠道
            },
         paging:{
            pn:1,
            ps:10
               }
         },
         branchList: [], // 分支机构集合
         channel:[
             {
            label: '风管所',
            value: '01',
            },
            {
            label: '应安渠道',
            value: '02',
            },
            {
            label: '特设渠道',
            value: '03',
            },
            {
            label: '文旅渠道',
            value: '04',
            },
            {
            label: '卫生渠道',
            value: '05',
            },
            {
            label: '教育渠道',
            value: '06',
            },
            {
            label: '食安渠道',
            value: '07',
            },
            {
            label: '私人保险板块',
            value: '08',
            },
            {
            label: '员工福利保险板块',
            value: '09',
            },
            {
            label: '金融保险板块',
            value: '10',
            },
            {
            label: '国际保险板块',
            value: '11',
            },
            {
            label: '基础建设板块',
            value: '12',
            },
            {
            label: '农业保险板块',
            value: '13',
            },
         ],
         expertList:[
             {
            label: '风险评估专家',
            value: '01',
            },
            {
            label: '风险预防专家',
            value: '02',
            },
            {
            label: '行业管理专家',
            value: '03',
            },
            {
            label: '学科咨询专家',
            value: '04',
            },
            {
            label: '行业风险专家',
            value: '05',
            },
            {
            label: '保险行业专家',
            value: '06',
            },
         ],
      tableList: [],
      total: 0,
    };
  },

  computed: {
    ...mapGetters({
      getEnumAll: "getEnumAll",
    }),
  },
  created() {
    this.initData();
    this.loadBranch();
  },
  methods: {
    async initData() {
      this.getList();
    },
    async loadBranch(){
        // let jtBranchs = window.sessionStorage.getItem('authDataInfo') || ''
        // let jtBranchsList = [];
        let res = await this.userManageService.getBranchInfo();
        if(res.data.code == '0000'){
           this.branchList = res.data.list
            // if(jtBranchs && jtBranchs.indexOf(",") != -1) {
            // jtBranchsList = jtBranchs.split(",")
            // } else {
            // jtBranchs == 'JT0000' ? jtBranchsList = ['JT0000'] : jtBranchsList = [jtBranchs]
            // }
            // if(jtBranchsList.indexOf('JT0000') !=-1){
            // this.branchList = res.data.list
            // }else{
            // this.branchList = res.data.list.filter(item=> jtBranchsList.find(it => it == item.jtBranchCode ));
            // }
      }     
		},
    refresh() {
      this.getList();
    },
    async getList() {
      // 初始化列表查询
      let res = await this.userManage.ehrpostList(this.ruleForm);
      if (res.code === "0000") {
        this.tableList = res.list
        this.total = res.total;
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "color:#333;text-align: left;";
      } else {
        return "";
      }
    },
    seach() {
      this.ruleForm.paging.pn = 1;
      this.ruleForm.paging.ps = 10;
      if (this.ruleForm.conditions.name) {
        if (2 > this.ruleForm.conditions.name.length) {
          this.$message.error("请输入2-10位姓名");
        } else {
          this.getList();
        }
      } else {
        this.getList();
      }
    },

    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.paging.pn = pn;
      this.getList();
    },
    // 重置
    reset() {
       this.ruleForm={
        conditions:{  
            code:"",
            mobile:"",//手机号
            idNo:"", //专家证件号
            branchCode:"",//所属分支机构
            name:"",//姓名
            departCode:"", //部门编码
            expertType:"",//专家类别
            age:'',
            createName:"",
            channelCode:""//归属渠道
            },
         paging:{
            pn:1,
            ps:10
               }
         },
      this.getList();
    },
   
  },
};
</script>

<style lang="less" scoped>
.flexBetween {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
}
.expertTow{
    display: flex;
    .expertA{
        min-width: 100px;
        background-color:#fa8c16;
        height: 30px;
        color: #fff;
        border-radius: 50px;
       text-align: center;
       line-height: 30px;
    }
    .expertB{
        min-width: 100px;
        background-color:#409eff;
        height: 30px;
        color: #fff;
        border-radius: 50px;
       text-align: center;
       line-height: 30px;
    }
}
#userList {
  padding-bottom: 80px;
  box-sizing: border-box;
    .yellowBtn {
    display: inline-block;
    width: 60px;
    font-size: 12px;
    height: 24px;
    padding-left: 5px;
	line-height: 24px;
	color: #fff;
  box-sizing: border-box;
	background-color: #fa8c16;
	border-radius:0 15px 15px 0;
  }
  .drdown {
    color: #409eff;
    cursor: pointer;
    line-height: 1;
  }
  .elesearch1 {
    width: calc(100% - 40px);
    padding: 20px 20px 10px;
    margin-top: 20px;
    background-color: #fff;
    .row-bg {
      margin-bottom: 20px;

      .item2 {
        width: 73%;
      }
      .item3 {
        display: inline-block;
        width: 25%;
        text-align: right;
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: text-bottom;
      }
    }
  }
  .content {
    // width: calc(100% - 40px);
    // margin: 20px;
    margin-top: 20px;
    padding-top: 20px;
    background-color: #ffffff;

    .content-table {
      width: 100%;
      padding: 20px 20px 30px;
      margin-bottom: 40px;
      box-sizing: border-box;
    }
  }
  .content-total {
    // width: 85.2%;
    margin: 30px 30px 0 20px;
    bottom: 0;
    text-align: right;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
