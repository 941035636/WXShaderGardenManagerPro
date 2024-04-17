<template>
  <div id="danger">
    <el-table
      :data="DangerByUserArr.records"
      border
      header-row-class-name="headName"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="standardName"
        label="清单名称"
        min-width="200"
      ></el-table-column>
      <el-table-column prop="deptName" label="所属部门"></el-table-column>
      <el-table-column prop="postName" label="所属岗位"></el-table-column>
      <el-table-column prop="frequency" label="排查频次"></el-table-column>
      <el-table-column prop="checkNum" label="已检查项数"></el-table-column>
      <el-table-column label="未检查项数">
        <template slot-scope="scope">
          <span class="color-blue">{{ scope.row.uncheckNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发现隐患数">
        <template slot-scope="scope">
          <span style="color: #bb2a1f">{{ scope.row.findHazardNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <span class="color-blue pointer" @click="goDetail">查看(未定)</span> -->
          <span class="color-blue pointer">查看(未定)</span>
        </template>
      </el-table-column>
    </el-table>
    <enterpriseDetail ref="enterpriseDetail" />
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="DangerByUserArr.total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
import enterpriseDetail from '../enterprise/detail/index.vue'
export default {
  props: {
    DangerByUserArr: {
      required: true,
    },
  },
  components: {
    enterpriseDetail,
  },
  data() {
    return {}
  },
  methods: {
    goDetail() {
      this.$refs.enterpriseDetail.dialogVisible = true
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