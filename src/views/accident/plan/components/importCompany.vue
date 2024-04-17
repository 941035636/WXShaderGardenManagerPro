<template>
  <div id="importCompany">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="70%"
      @open="getInit"
      @close="close"
    >
      <div class="case-tab-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :disabled="!isEnterprises" label="上传清单">
            <el-form label-position="left" label-width="140px">
              <el-form-item label="1、下载导入模板">
                <el-button @click="downloadFile" size="mini" plain>
                  <i class="el-icon-download f16"></i>
                  下载空的模板表格
                </el-button>
              </el-form-item>
              <el-form-item label="2、上传清单">
                <el-upload
                  action="#"
                  :limit="1"
                  :before-upload="beforeUpload"
                  :http-request="Upload"
                  :on-remove="removeFile"
                  :show-file-list="false"
                  :file-list="fileList"
                  :on-exceed="onExceed"
                  accept=".xlsx,.xls"
                  ref="upload"
                >
                  <el-button class="mr20" size="small" type="primary">
                    选择附件
                  </el-button>
                  <span class="color-blue">只支持XLS，大小不超过10M</span>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="确认清单">
            <div class="text-right">
              <el-button
                type="text"
                icon="el-icon-delete"
                style="color: red"
                @click="deleteAll"
                :disabled="!isEnterprises"
              >
                删除全部
              </el-button>
            </div>
            <el-table
              :data="tableData"
              height="280"
              :header-cell-style="getRowClass"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="enterpriseName"
                label="生产经营单位名称"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="enterpriseCode"
                label="社会信用代码"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="firstIndustryName"
                label="管理分类"
              >
                <template slot-scope="scope">
                  {{ scope.row.firstIndustryName }}
                  <span v-if="scope.row.secondIndustryName">
                    {{ scope.row.secondIndustryName }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column show-overflow-tooltip label="实际经营地址">
                <template slot-scope="scope">
                  {{
                    scope.row.provinceName +
                    '/' +
                    scope.row.cityName +
                    '/' +
                    scope.row.countyName
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                show-overflow-tooltip
                label="详细地址"
              ></el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button
                    class="deleteBtn"
                    type="text"
                    :disabled="!isEnterprises"
                    @click="dele(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="sumbit" type="primary">导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadCorpFile } from '@/api/accidentManagement'
export default {
  name: 'importCompany',
  components: {},
  data() {
    return {
      dialogVisible: false,
      isEnterprises: true,
      title: '服务企业清单企业导入',
      fileList: [],
      tableData: [],
      activeName: '0',
    }
  },

  methods: {
    getInit() {},
    async downloadFile() {
      const a = document.createElement('a')
      a.href = '/static/accidentFile/政府平台-事故预防企业清单模板.xlsx'
      a.download = '政府平台-事故预防企业清单模板.xlsx'
      a.click()
    },
    dele(index) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },
    deleteAll() {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.tableData = []
          this.fileList = []
        })
        .catch(() => {})
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$baseMessage('文件过大', 'error')
        return false
      }
      let arrFile = [file]
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#ffefe5;color:#ff7f30'
      } else {
        return ''
      }
    },
    removeFile(file, fileList) {
      this.fileList = fileList
    },
    async Upload(file) {
      // 图片上传
      console.log(file, '+++++')
      let formData = new FormData()
      formData.append('file', file.file) // append增加数据
      let res = await uploadCorpFile(this.$route.query.id, formData)
      if (res.code === '0000') {
        this.tableData = res.list
        this.activeName = '1'
      }
    },
    onExceed() {
      this.$baseMessage('请先删除已上传文件', 'error')
    },
    close(e) {
      this.activeName = '0'
      this.isEnterprises = true
      this.tableData = []
      this.fileList = []
    },
    handleClick(e) {
      console.log(e)
    },
    sumbit() {
      if (this.tableData.length) {
        this.$emit('getMsg', this.tableData)
        this.dialogVisible = false
      } else {
        this.$baseMessage
      }
    },
  },
}
</script>

<style lang="scss">
#importCompany {
  .text {
    color: #000;
  }
  .el-dialog__body {
    padding: 10px 50px;
  }
}
</style>
