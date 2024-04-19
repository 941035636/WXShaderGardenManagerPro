<template>
  <el-dialog
    title="查看日志"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    @open="initData"
  >
    <el-table
      :data="tableList"
      border
      header-row-class-name="headName"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="createTime"
        label="日期"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="actionType"
        label="类型"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="title"
        label="标题"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createBy"
        label="操作人"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column prop="createIp" label="操作IP"></el-table-column>
    </el-table>
    <BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </BasePagenations>
  </el-dialog>
</template>

<script>
// import AccidentCases from '@/service/accidentCases'
import { getAccidentCaseLog } from '@/service/accidentCase'
export default {
  name: 'logList',
  data() {
    return {
      // accidentCases: new AccidentCases(),
      dialogVisible: false,
      pn: 1,
      ps: 10,
      tolnum: 0,
      id: '',
      tableList: [],
      data: {},
      form: {
        accidentCaseId: '',
        actionType: '',
        title: '',
        pageNum: 1,
        pageSize: 10,
      }
    }
  },

  created() {},
  methods: {
    initData() {
      this.getAgentList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'text-align:center;color:#0050b3'
      } else {
        return ''
      }
    },
    async getAgentList() {
      this.form.accidentCaseId = this.data.id
      this.form.title = this.data.title
      let res = await getAccidentCaseLog(this.form)
      if (res.code === '0000') {
        this.tolnum = res.total
        this.tableList = res.list
      }
    },

    // 分页变更
    handleCurrentChange(pn) {
      console.log(pn, 'pn')
      this.pn = pn
      this.getAgentList()
    },
    handleSizeChange(val) {
      console.log(val, 'ps')
      this.ps = val
      this.getAgentList()
    },
    clear() {
      this.tableList = []
      this.pn = 1
      this.ps = 10
      this.total = 0
    },
    close() {
      this.clear()
    },
  },
}
</script>

<style lang="less" scoped>
.w280 {
  width: 280px;
}
</style>
