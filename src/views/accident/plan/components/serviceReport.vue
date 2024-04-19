<template>
  <div id="serviceReport">
    <Title title="服务报告附件"></Title>
    <div class="mb10 mt10 display-flex">
      <!-- <el-upload
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
      </el-upload> -->
      <el-button v-if="isAuth('120017') && planStatus !== 3" @click="addFile" type="primary">上传附件</el-button>
      <!-- <span v-else>合同附件：</span> -->
    </div>
    <el-table :data="planFiles" border :header-cell-style="getRowClass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="typeName" label="文件类型" width="220"></el-table-column>
      <el-table-column prop="labelName" label="文件标签" width="150">
        <template slot-scope="scope">
          <span class="color-orange">{{scope.row.labelName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="createTime" label="上传时间" width="200"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button v-if="isAuth('120018')" type="text" @click="downloadFile(scope.row)">
            下载
          </el-button>
          <span class="color-blue" v-if="isAuth('120019') && planStatus !== 3">|</span>
          <el-button
            v-if="isAuth('120019') && planStatus !== 3"
            type="text"
            @click="deletFile(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <addFile ref="addFile" @successCb="successCb"></addFile>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import addFile from './addFile'
  import { planFile, deleteFiles } from '@/service/accidentManagement'
  import ResourcesService from '@/service/ResourcesService'
  // import { getFile } from '@/api/resources'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
      addFile
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
        ResourcesService: new ResourcesService(),
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
          return 'background:#f5f5f5;color:#000'
        } else {
          return ''
        }
      },
      handleClick(tab, event) {
        console.log(tab, event)
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
          this.$message.success('成功')
        }
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 20
        if (!isLt10M) {
          this.$message.error('单文件上限20MB')
        }
        return isLt10M
      },
      onExceed() {
        this.$message.error('最多支持9个附件')
      },
      // 下载文件
      async downloadFile(row) {
        let res = await this.ResourcesService.downloadOrViewFile(row.downLoadUrl,true)
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
              this.$message.success('删除成功')
              this.successCb()
            }
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
      },
      successCb() {
        this.$emit('successCb')
      },
      addFile(){
        this.$refs.addFile.initData()
      },
    },
  }
</script>

<style scoped lang="less">
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
<style lang="less">
#serviceReport{
  .el-upload--text{
      width: 100%;
			height: 40px;
			border: none;
      color: #000;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
		}
}
</style>
