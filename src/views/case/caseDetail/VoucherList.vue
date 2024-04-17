<template>
  <div id="VoucherList">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600"
      append-to-body
      :before-close="handleClose"
    >
      <div>
        <el-table
          :data="tableData"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
        >
          <el-table-column prop="name" show-overflow-tooltip label="附件名称">
            <template slot-scope="scope">
              附件{{ scope.$index + 1 }}：{{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <div class="download" @click="download(scope.row.id)">下载</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFile } from '@/api/resources'
export default {
  name: 'VoucherList',
  data() {
    return {
      dialogVisible: false,
      title: '凭证/证明文件列表',
      tableData: [],
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    // 下载
    async download(id) {
      let res = getFile('/files/downloadfile/' + id)
    },
  },
}
</script>

<style lang="scss">
.download {
  color: #096dd9;
  cursor: pointer;
}
</style>