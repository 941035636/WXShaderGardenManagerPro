<template>
  <div id="servicdeFile">
    <el-form label-width="200px">
      <el-form-item prop="planFiles" label="服务报告附件">
        <el-switch @change="changeFile" v-model="hasFile"></el-switch>
        （可选）
      </el-form-item>
      <el-form-item>
        <div v-if="hasFile" class="mb10">
          <el-button @click="openUpload" size="small" type="primary">
            上传附件
          </el-button>
          <el-table
            :data="filesList"
            style="width: 90%"
            border
            class="mt10"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column prop="typeName" label="文件类型"></el-table-column>
            <el-table-column
              prop="labelName"
              label="文件标签"
            ></el-table-column>
            <el-table-column
              prop="name"
              show-overflow-tooltip
              label="文件名"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="上传时间"
            ></el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="moreBtn"
                  @click="downloadFile(scope.row)"
                >
                  下载
                </el-button>
                <el-button
                  v-if="planStatus !== 3 && $route.query.isHandle"
                  type="text"
                  class="deleteBtn"
                  @click="deletFile(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <add-file @successCb="successCb" ref="addFile" />
  </div>
</template>

<script>
import addFile from '../../components/addFile.vue'
import { planFile, deleteFiles } from '@/api/accidentManagement'
import { getFile, getFilesList } from '@/api/resources'
export default {
  components: {
    addFile,
  },
  props: {
    labelWidth: {
      type: String,
      default: () => {
        return '150px'
      },
    },
    planFiles: {
      type: Array,
      require: true,
      default: () => {
        return []
      },
    },
    planStatus: {
      type: Number,
      require: false,
      default: () => {
        return 0
      },
    },
  },
  data() {
    return {
      hasFile: true,
      filesList: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let data = {
        connectId: this.$route.query.id,
        modelType: 3,
        functionType: 5,
      }
      let res = await getFilesList(data)
      if (res.code === '0000') {
        this.filesList = res.list
      }
    },
    changeFile(e) {
      if (!e && this.filesList.length) {
        this.$baseMessage('请先删除服务报告附件', 'warning')
        this.hasFile = true
      }
    },
    openUpload() {
      this.$refs.addFile.dialogVisible = true
    },
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
    // 删除文件
    deletFile(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteFiles(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.successCb()
          }
        })
        .catch(() => {
          // this.$baseMessage('已取消删除', 'info')
        })
    },
    successCb() {
      console.log('serviceSucess')
      // this.$emit('successCb')
      this.init()
    },
  },
}
</script>

<style>
#servicdeFile {
  margin: 0 20px;
}
</style>