<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
  >
    <Step :activeNum="activeNum"/>
    <h2 class="details-title">项目信息</h2>
    <el-row type="flex" class="row-bg">
      <el-col :span="12">
        <span class="title">项目名称：</span>
        <span class="color-blue">{{ projectDetails.projectName }}</span>
      </el-col>
      <el-col :span="12">
        <span class="title">项目合同编号：</span>
        <span class="color-blue">{{ projectDetails.contractNo }}</span>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="12">
        <span class="title">项目时间：</span>
        <span>{{ projectDetails.startTime | format("YYYY-MM-DD") }}</span>
        <span>至</span>
        <span>{{ projectDetails.endTime | format("YYYY-MM-DD") }}</span>
      </el-col>
      <el-col :span="12">
        <span class="title">服务费：</span>
        <span class="color-red">
          ￥{{
            projectDetails.accidentPreFund
              ? projectDetails.accidentPreFund.toFixed(2)
              : ''
          }}
          元
        </span>
        <span>（{{ bigMoney }} ）</span>
      </el-col>
    </el-row>
    <h2 class="details-title">项目服务说明：</h2>
    <el-row type="flex" class="row-bg">
      <el-col :span="16">
        <span class="color-blue">{{ projectDetails.remark }}</span>
      </el-col>
    </el-row>
    <h2 class="details-title">审核信息</h2>
    <div style="border:1px solid #f5f5f5">
      <el-table :data="approveHistoryEntityList" :header-cell-style="getRowClass">
        <el-table-column label="审核日期 / 人员">
          <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
            <div>
              <span>审核人：</span>
              <span>{{scope.row.userName}}</span>
              <span>（{{scope.row.roleName}}）</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.approveResult === '1'" class="color-FF9228">
                发起审核
              </span>
              <span v-if="scope.row.approveResult === '2'" class="color-green">
                审核通过
              </span>
              <span v-if="scope.row.approveResult === '3'" class="color-red">
                审核不通过
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" prop="approveContent"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import { getProjectDetails } from '@/service/accidentManagement'
  import { smalltoBIG } from '@/util/validate'
  import Step from './Step'
  import Table from './Table'
  export default {
    name: 'DialogExamine',
    props: {},
    components:{
      Step,
      Table,
    },
    computed: {
      bigMoney() {
        return smalltoBIG(this.projectDetails.accidentPreFund) || '零'
      },
    },
    data() {
      return {
        dialogVisible: false,
        tableList:[],
        activeNum:1,
        projectDetails:{},
        approveHistoryEntityList:[],
      }
    },
    
    mounted() {
      // this.initRole()
    },
    methods: {
      openInit(id){
        this.dialogVisible = true
        this.initData(id)
      },
      async initData(id) {
        let res = await getProjectDetails(id)
        if (res.code === '0000') {
          this.projectDetails = res.data.accidentPreProjectEntity
          this.approveHistoryEntityList = res.data.approveHistoryEntityList
          if(res.data.accidentPreProjectEntity.approveStatus===1) {
            this.activeNum = 1 
          } else if(res.data.accidentPreProjectEntity.approveStatus===2) {
            this.activeNum = 2
          } else if(res.data.accidentPreProjectEntity.approveStatus===5){
            this.activeNum = 3
          }
        }
      },
      // 关闭弹出框
      close(){},
      // 设置表头样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5; color: #000'
        } else {
          return ''
        }
      },
    }
  }
</script>

<style lang="less">
.details-title {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
}
.row-bg {
  margin-bottom: 20px;
  .project-status {
    display: inline-block;
    padding: 4px 6px;
    background-color: #ffa940;
    color: #fff;
    border-radius: 20px;
  }
}
</style>
