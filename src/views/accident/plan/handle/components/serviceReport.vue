<template>
  <div id="serviceReport">
    <Title title="服务报告附件"></Title>
    <div class="mb10 mt10 display-flex">
      <el-upload
        v-if="false"
        class="upload-demo"
        action="#"
        :http-request="Upload"
        multiple
        :file-list="fileList"
        :show-file-list="false"
        :limit="10"
        :before-upload="beforeAvatarUpload"
        accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls"
        :on-exceed="onExceed"
      >
        <span>合同附件：</span>
        <el-button size="small" type="primary">点击上传</el-button>
        <span>只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过5M（最多可上传9件）</span>
      </el-upload>
    </div>
    <el-table :data="tableList" border :header-cell-style="getRowClass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <div>
            <span class="project-type">隐患排查</span>
          </div>
          <div>{{ scope.row }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="expertTypeName" label="上传时间">
        <template slot-scope="scope">
          <div class="color-blue">隐患排查</div>
          <div>隐患排查</div>
          <div>隐患排查</div>
          <div>{{ scope.row }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
    },
    props: {},
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
        console.log(1)
        this.$router.push({
          path: 'planDetails',
          query: {
            id: row.id,
          },
        })
      },
      // 图片上传
      async Upload(file) {
        this.fileList = []
        // const formData = new FormData();
        // formData.append('files', file.file)
        // formData.append('type', file.file.type)
        // formData.append("channelcode", "sequip")
        // formData.append("resCode", "I001")
        // let data = formData
        let data = [file.file]
        const res = await this.ResourcesService.uploadFile(
          'sequip-svc',
          'payInfo',
          '0',
          data
        )
        if (res.code == '0000') {
          this.id = res.list[0].fileId
          this.name = res.list[0].fileName
        }
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.$message.error('单文件上限10MB!')
        }
        return isLt10M
      },
      onExceed() {
        // this.$message.warning('最多支持10个附件')
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
