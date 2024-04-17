<template>
  <div id="verifyProgress">
    <div class="stilte">审核进度</div>
    <div class="vericon">
      <el-table
        ref="table"
        class="mt10"
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
        :cell-style="{ 'text-align': 'left' }"
        :data="tableData"
        border
        max-height="250"
        style="width: 100%"
      >
        <el-table-column prop="underwriteType" label="审核日期 / 人员">
          <template slot-scope="scope">
            <div class="color-gray-6 mb8">{{ scope.row.updateTime }}</div>
            <div>{{ scope.row.userName }}（{{ scope.row.roleName }}）</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.approveResult == '1'" class="color-blue">
              发起审核
            </span>
            <span v-if="scope.row.approveResult == '2'" class="color-green">
              审核通过
            </span>
            <span v-if="scope.row.approveResult == '3'" class="color-red">
              审核不通过
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="approveContent" label="备注说明">
          <template slot-scope="scope">
            <span class="color-gray-3">
              {{ scope.row.approveContent || '--' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    }
  },
  computed: {},
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      //表头样式
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:left;color:#000'
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang='scss'>
#verifyProgress {
  .vericon {
    padding: 30px 30px 10px 50px;
    box-sizing: border-box;
  }
  .stilte {
    font-size: 16px;
    color: #fa9d4d;
    height: 40px;
    padding-left: 30px;
    line-height: 40px;
    border-bottom: 1px dashed #fa9d4d;
  }
  .el-table .headName .cell {
    font-weight: bold;
    color: #000;
  }
}
</style>