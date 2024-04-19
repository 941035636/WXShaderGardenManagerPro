<template>
  <div id="examineList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目名称：</span>
            <el-input
              v-model.trim="ruleForm.name"
              placeholder="请输入项目名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目时间：</span>
            <el-date-picker
              v-model="ruleForm.updateStartTime"
              type="date"
              class="wid250"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"
            ></el-date-picker>
            至
            <el-date-picker
              v-model="ruleForm.updateEndTime"
              class="wid250"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">状态：</span>
            <el-select
              v-model="ruleForm.approveStatus"
              class="w450"
              clearable
              placeholder="请选择状态"
            >
              <el-option label="待审核" value="1"></el-option>
              <el-option label="审核中" value="2"></el-option>
              <el-option label="通过" value="5"></el-option>
              <el-option label="不通过" value="4"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">申请人：</span>
            <el-input
              v-model.trim="ruleForm.createByName"
              placeholder="请输入申请人"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <div style="text-align: right">
            <el-button @click="reset" size="medium" round class="empty-button"
              >重置</el-button
            ><el-button
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
    <div class="table-split"></div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span>查询列表</span>
        </el-col>
      </el-row>
      <div class="mt20">
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column label="项目编码" prop="productCode"></el-table-column>
          <el-table-column label="项目信息">
            <template slot-scope="scope">
              <div class="color-blue">
                <span>{{ scope.row.name }}</span>
              </div>
              <div>
                <span>合同期限：</span>
                <span>{{ scope.row.startTime | format }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime | format }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="服务费(元)"
            width="150"
          >
            <template slot-scope="scope">
              <span class="color-blue">
                ￥{{ scope.row.cost.toFixed(2) || '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createByName" label="申请人" width="150"></el-table-column>
          <el-table-column prop="updateTime" label="申请时间" width="200" >
          </el-table-column>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status === 1" class="color-FF9228">
                  待审核
                </span>
                <span v-if="scope.row.status === 2" class="color-FF9228">
                  审核中
                </span>
                <span v-if="scope.row.status === 4" class="color-red">
                  不通过
                  <i class="el-icon-question col-FFA940 f20 pointer" @click="getProjectDetails(scope.row.acdpreId)"></i>
                </span>
                <span v-if="scope.row.status === 5" class="color-green">
                  审核通过
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">查看</el-button>
                <!-- v-if="isAuth('10094') && ((scope.row.status === 1 && buttonRL20002) || (scope.row.status === 2 && buttonRL20003))" -->
              <el-button
                type="text"
                @click="examine(scope.row)"
              >
                审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text-center mt10">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <DialogExamine ref="DialogExamine" @successCb="getList"/>
    <DialogExamineDetails ref="DialogExamineDetails" />
  </div>
</template>

<script>
  import { getRolePorjectList, getProjectDetails } from '@/service/accidentManagement'
  import DialogExamine from '../components/DialogExamine'
  import DialogExamineDetails from '../components/DialogExamineDetails'
  import { valueLength } from "@/util/validate.js";
  export default {
    name: 'ProjectList',
    components: {
      DialogExamine,
      DialogExamineDetails,
    },
    data() {
      return {
        ruleForm: {
          pn: 1,
          ps: 10,
          name: '',
          createByName: '',
          approveStatus: '',
          updateStartTime: '',
          updateEndTime: '',
          desc: false,
        },
        // 时间数组
        dateArray: [],
        tableList: [],
        branchList: [],
        insuranceList: [],
        total: 0,
        buttonRL20002:false,
        buttonRL20003:false,
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        this.getList()
        this.buttonFlag()
      },
      buttonFlag() {
        // for (let i = 0;i < JSON.parse(sessionStorage.getItem("roleCodearr")).length;i++){//判断是否是事故预防控制中心主任  分支机构负责人 
        //   if (JSON.parse(sessionStorage.getItem("roleCodearr"))[i] == "RL20002"){
        //     console.log(1,this.isAuth('10094'));
        //     this.buttonRL20002 = true;
        //     break;
        //   } else if (JSON.parse(sessionStorage.getItem("roleCodearr"))[i] == "RL20003") {
        //     console.log(2);
        //     this.buttonRL20003 = true;
        //     break;
        //   }
        // }
      },
      async getList() {
        if(this.ruleForm.name && !valueLength(this.ruleForm.name)) {
          this.$message.error('项目名称为3-30位')
        } else if(this.ruleForm.createByName && !valueLength(this.ruleForm.createByName,/^.{2,10}$/i)) {
          this.$message.error('申请人名称为2-10位')
        } else {
          let res = await getRolePorjectList(this.ruleForm)
          if (res.code === '0000') {
            this.tableList = res.list
            this.total = res.total
          }
        }
        
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      seach() {
        this.ruleForm.pn = 1
        this.ruleForm.ps = 10
        this.ruleForm.beginCreateTime =
          this.dateArray && this.dateArray[0]
            ? this.dateArray[0] + ' 00:00:00'
            : ''
        this.ruleForm.endCreateTime =
          this.dateArray && this.dateArray[1]
            ? this.dateArray[1] + ' 23:59:59'
            : ''
        this.getList()
      },
      detail(row) {
        this.$refs.DialogExamineDetails.openInit(row.acdpreId)
      },
      examine(row) {
        this.$refs.DialogExamine.openInit(row)
      },
      update(row) {
        this.$router.push({
          path: 'projectAdd',
          query: {
            id: row.id,
          },
        })
      },
      // 分页变更
      handleCurrentChange(pn) {
        this.ruleForm.pn = pn
        this.getList()
      },
      // 重置
      reset() {
        this.ruleForm = {
          pn: 1,
          ps: 10,
          name: '',
          approveStatus: '',
          updateStartTime: '',
          updateEndTime: '',
          desc: false,
        },
        this.getList()
      },
      async getProjectDetails(id) {
        let res = await getProjectDetails(id)
        if(res.code==='0000') {
          this.$message.warning(res.data.failureReason)
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  #examineList {
    width: calc(100% - 40px);
    margin: 0 20px;
    background-color: #fff;
    .elsearch {
      margin: 20px;
      padding-top: 20px;
    }
    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;
    }
    .table-split {
      height: 20px;
      background-color: #f0f2f5;
    }
    .teble-list {
      margin: 20px;
    }
  }
</style>
