<template>
  <el-dialog id="regFileUpload" title="文件导入" width="550px" :visible.sync="fileImportShow">
    <div class="upload_zhuan">
      <span class="mr10">1、下载导入模板</span>
      <el-button class="download-template" size="small" style="margin-left: 10px">
        <i class="el-icon-download"></i>
        <span @click="downloadTemplate">下载空的模板表格</span>
      </el-button>
    </div>
    <div class="upload_zhuan">
      <span class="mr10">2、上传用户清单</span>
      <el-upload class="upload-demo" action ref="tempupload" :auto-upload="false" :limit="1" accept=".xls"
        style="margin-left: 10px">
        <el-button slot="trigger" size="small" type="primary" style="background: #1890FF;border-color: #1890FF">选择附件
        </el-button>
        <span class="color-blue" style="margin-left: 20px">只支持XLS，大小不超过10M</span>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="close" type="info" round @click="fileImportShow = false">取消</el-button>
      <el-button type="warning" round :loading="isButLoading" @click="confirmImportFile" style="background: #FFA940">导入
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchImport } from '@/api/enterpriseRegister'
export default {
  // props: {
  //   fileImportShow:{
  //     type: Boolean,
  //     defalut: false,
  //   }
  // },
  data() {
    return {
      isButLoading: false,
      temp_import_file_url: "../../../../../public/static/file/批量注册用户模版.xlsx",
      fileImportShow: false,
    }
  },
  watch: {
    fileImportShow: {
      handler(curVal, oldVal) {
        if (!curVal) {
          this.$refs['tempupload'].clearFiles();
        }
      }
    }
  },
  methods: {
    // 下载模版
    downloadTemplate() {
      const a = document.createElement('a')
      a.href = '/static/file/批量注册用户模版.xls'
      a.download = '批量注册用户模版.xls'
      a.click()
    },
    // 确认上传
    async confirmImportFile() {
      console.log(this.$refs.tempupload)
      let fileList = this.$refs.tempupload.uploadFiles
      console.log(fileList)
      if (fileList.length <= 0) {
        this.$message.warning("请上传文件再点击确认！")
        return false;
      }

      this.isButLoading = true;
      let form = new FormData();
      form.append("file", fileList[0].raw)
      try {
        let { code, data } = await batchImport(form)
        if (code == '0000') {
          this.isButLoading = false;
          this.$message.success(data);
          this.$emit("handleQuery")
          this.$refs['tempupload'].clearFiles();
          this.fileImportShow = false;
        } else {
          this.isButLoading = false;
        }
      } catch (error) {
          this.isButLoading = false;
      }
    }
  }
}
</script>

<style lang="scss">
#regFileUpload {
  height: 100%;
  overflow: hidden;

  .el-upload-list {}

  .el-row {
    display: flex;
  }

  .down_tem {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }

  .el-dialog__footer {
    position: relative;
  }

  .upload_zhuan {
    display: flex;
    background-color: #F7F7F7;
    padding: 10px 20px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;

    .download-template {
      border-color: #096DD9;
      color: #096DD9;
      border-radius: 5px;

      .el-icon-download {
        margin: 0 5px;
      }
    }

    // span {
    //   float: left;
    // }
    // div {
    //   float: left;
    // }
  }

  .el-upload--text {
    width: initial;
    height: initial;
    border: initial;
    border-radius: 0px;
  }

  .dialog-footer {
    button {
      padding: 10px 20px;
      border: none;
    }
  }

  .close {
    color: #5A5A5A;
    background: #E9E9E9;

  }
}
</style>
