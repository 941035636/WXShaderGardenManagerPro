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
        prop="type"
        label="类型"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="title"
        label="标题"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createByName"
        label="操作人"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column prop="ip" label="操作IP"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :current-page="pn"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { checkLog } from '@/api/news.js'
export default {
  name: 'logList',
  data() {
    return {
      dialogVisible: false,

      pn: 1,
      ps: 10,
      total: 0,

      id: '',
      tableList: [],
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
      let obj = {
        pn: this.pn,
        ps: this.ps,
      }
      let res = await checkLog(this.id, obj)
      if (res.code === '0000') {
        this.total = res.total
        this.tableList = res.list
      }
    },

    // 分页变更
    handleCurrentChange2(pn) {
      console.log(pn, 'pn')
      this.pn = pn
      this.getAgentList()
    },
    handleSizeChange2(val) {
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

<style lang="scss">
.w280 {
  width: 280px;
}
</style>
