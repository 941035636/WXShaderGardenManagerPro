<template>
  <div id="serviceReport">
    <Title title="服务报告附件"></Title>
    <div class="mb10 mt10 display-flex">
      <el-upload
        v-if="planStatus !== 3"
        class="upload-demo"
        action="/enclosure"
        :http-request="Upload"
        multiple
        :file-list="planFiles"
        :show-file-list="false"
        :limit="9"
        :before-upload="beforeAvatarUpload"
        accept=".doc , .docx , .pdf , .rar , .zip"
        :on-exceed="onExceed"
      >
        <span>合同附件：</span>
        <el-button size="small" type="primary">点击上传</el-button>
        <span>只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）</span>
      </el-upload>
      <span v-else>合同附件：</span>
    </div>
    <el-table :data="planFiles" border :header-cell-style="getRowClass">
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="createTime" label="上传时间"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="downloadFile(scope.row)">
            下载
          </el-button>
          <el-button
            v-if="planStatus !== 3"
            type="text"
            @click="deletFile(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { planFile, deleteFiles } from '@/api/accidentManagement'
  import { getFile } from '@/api/resources'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
    },
    props: {
      planFiles: {
        type: Array,
        require: true,
        default: () => {
          return []
        },
      },
      planStatus: {
        type: Number,
        require: true,
        default: () => {
          return 0
        },
      },
    },
    data() {
      return {
        data: {},
        activeName: 'first',
        tableList: [],
        fileList: [],
      }
    },
    computed: {},
    mounted() {},
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      addPlan() {
        this.$refs.addPlan.initData(this.projectDetails)
      },
      palnDetail(row) {
        this.$router.push({
          path: 'planDetails',
          query: {
            id: row.id,
          },
        })
      },
      // 图片上传
      async Upload(file) {
        const formData = new FormData()
        formData.append('files', file.file)
        const res = await planFile(
          formData,
          `/${this.$route.query.id}${file.action}`
        )
        if (res.code == '0000') {
          this.successCb()
          this.$baseMessage('成功', 'success')
        }
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 20
        if (!isLt10M) {
          this.baseMessage('单文件上限20MB!', 'error')
        }
        return isLt10M
      },
      onExceed() {
        this.$baseMessage('最多支持9个附件', 'error')
      },
      // 下载文件
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
            this.$baseMessage('已取消删除', 'info')
          })
      },
      successCb() {
        this.$emit('successCb')
      },
    },
  }
</script>

<style scoped lang="scss">
  #serviceReport {
    margin: 0px 20px 20px;
    .upload-demo {
      .upload-btn {
        width: 100px;
      }
    }
    .project-type {
      display: inline-block;
      padding: 2px 10px;
      background-color: #e6f7ff;
      color: #096dd9;
      border-radius: 20px;
    }
  }
</style>
