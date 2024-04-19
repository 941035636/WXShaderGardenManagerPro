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
      <span class="mr10">2、上传清单</span>
      <el-upload class="upload-demo" action ref="tempupload" :auto-upload="false" accept=".xls,.xlsx"
        :file-list="fileList" :on-change="handleChange" style="margin-left: 10px">
        <el-button slot="trigger" size="small" type="primary" style="background: #1890ff; border-color: #1890ff">
          选择附件
        </el-button>
        <span class="color-blue" style="margin-left: 20px">
          只支持XLS,XLSX，大小不超过10M
        </span>
      </el-upload>
    </div>


    <div class="upload_ts" v-if="fileCode == '0000'">
      <div class="mr10 upts_title">导入成功！</div>
      <div class="mr10 upts_titleT">导入成功条数 {{ successCnt }}条</div>
    </div>
    <div class="upload_ts" v-if="fileCode == '9999'">
      <div class="mr10 upts_title">导入失败！</div>
      <div class="mr10 upts_titleB" v-for="(item, index) in errorDetails" :key="index"
        v-if="item.errorCompanyId.length != 0">
        {{ item.errorType ? item.errorType + ":" : "" }}
        {{ item.errorCompanyId ? item.errorCompanyId.toString() : "" }}
      </div>
      <!-- <div class="mr10 upts_titleB">{{ fileMsg }}</div> -->
    </div>


    <div slot="footer" class="dialog-footer">
      <el-button class="close" type="info" round @click="fileImportShow = false">
        取消
      </el-button>
      <el-button type="warning" round :loading="isButLoading" @click="confirmImportFile" style="background: #ffa940">
        导入
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import templateService from "@/service/template.js";
import userManageService from "@/service/userManageService";
export default {

  data() {
    return {
      userManageService: new userManageService(),
      templateService: new templateService(),
      isButLoading: false,
      fileImportShow: false,
      fileImportObj: {},
      fileList: [],

      fileCode: "",
      totalCnt: "",
      successCnt: "",
      errorCn: "",//导入失败条数
      errorDetails: [], //异常信息
      channel:"",//sequip safety safety_road
    }
  },
  watch: {
    fileImportShow: {
      handler(curVal, oldVal) {
        console.log(curVal, this.fileImportObj, 'curValcurValcurVal');
        if (!curVal) {
          this.fileImportObj = {};
          this.fileCode = "";
          this.totalCnt = "";
          this.successCnt = "";
          this.errorCn = "";//导入失败条数
          this.errorDetails = []; //异常信息
          console.log(curVal, this.fileImportObj, 'curValcurValcurVal');
          this.$emit('fevent')
          this.$refs['tempupload'].clearFiles()
        }
      },
      deep:true,
    },
  },
  methods: {
    openInit(obj){
      this.fileImportObj = obj
      this.fileImportShow = true
    },

    // 下载模版
    async downloadTemplate() {
      let res = await this.templateService.templatePreview(
        {},
        "MB-1679037612527",
      );
    },

    handleChange(file, fileList) {
      console.log(file, fileList, 'file, fileList');
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
      }
    },
    // 确认上传
    async confirmImportFile() {



      let fileList = this.$refs.tempupload.uploadFiles
      console.log(fileList, 'fileList')
      if (fileList.length <= 0) {
        this.$message.warning('请上传文件再点击确认！')
        return false
      }
      this.isButLoading = true
      let form = new FormData()
      form.append('file', fileList[0].raw)
      let res = await this.userManageService.postCustomerExcelImport(form,this.channel)
      this.isButLoading = false
      this.fileCode = res.data.totalCnt == res.data.successCnt ? "0000" : '9999'
      this.totalCnt = res.data.totalCnt || "",//导入总条数
      this.successCnt = res.data.successCnt || "",//导入成功条数
      this.errorCnt = res.data.errorCnt || "",//导入失败条数
      this.errorDetails = res.data.errorDetails || [] //异常信息

    },
  },
}
</script>

<style lang="less">
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
    background-color: #f7f7f7;
    padding: 10px 20px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;

    .download-template {
      border-color: #096dd9;
      color: #096dd9;
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

  .upload_ts {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    line-height: 28px;
    margin-top: 30px;

    .upts_title {
      color: #101010;
      font-weight: bold;
    }

    .upts_titleT {
      color: #67CB36;

    }

    .upts_titleB {
      color: #FF2525;

    }
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
    color: #5a5a5a;
    background: #e9e9e9;
  }
}
</style>
