<template>
  <div id="serviceFile">
    <el-table
      :data="planFiles"
      style="width: 90%"
      border
      class="mt10"
      :header-cell-style="getRowClass"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="typeName" label="文件类型"></el-table-column>
      <el-table-column prop="labelName" label="文件标签"></el-table-column>
      <el-table-column
        prop="name"
        show-overflow-tooltip
        label="文件名"
      ></el-table-column>
      <el-table-column prop="createTime" label="上传时间"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="moreBtn"
            @click="downloadFile(scope.row)"
          >
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import addFile from '../../components/addFile.vue'
import { planFile, deleteFiles } from '@/api/accidentManagement'
import { getFile } from '@/api/resources'
export default {
  components: {
    addFile,
  },
  props: {
    planFiles: {
      type: Array,
      require: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    async downloadFile(row) {
      let res = await getFile(row.url)
    },
  },
}
</script>

<style>
#serviceFile {
  margin: 0 20px;
}
</style>