<template>
  <div id="danger">
    <el-table
      :data="DangerByUserArr.records"
      border
      header-row-class-name="headName"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="hazardDescription"
        label="隐患描述"
        min-width="200"
      ></el-table-column>
      <el-table-column prop="hazardLevel" label="隐患级别"></el-table-column>
      <el-table-column prop="hazardState" label="隐患状态"></el-table-column>
      <el-table-column label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.substr(0, 10) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="DangerByUserArr.total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
import { getItems } from '@/api/user'

export default {
  props: {
    DangerByUserArr: {
      required: true,
    },
  },
  data() {
    return {
      rank: [],
      state: [],
    }
  },
  created() {
    this.getItems()
    this.getItems1()
  },
  methods: {
    handleCurrentChange(e) {
      this.$emit('handleCurrentChange', e)
    },
    codeValueTransition() {},
    async getItems() {
      let res = await getItems('50001')
      if (res.code == '0000') {
        this.rank = res.data
      }
    },
    async getItems1() {
      let res = await getItems('30001')
      if (res.code == '0000') {
        // this.state = res.data
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
  },
}
</script>
<style lang="scss" scpoed>
#danger {
  margin-top: 20px;
}
</style>