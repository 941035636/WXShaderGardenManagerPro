<template>
  <!-- 文件导入 -->
  <el-dialog
    id="addTemplate"
    title="添加模板"
    :visible.sync="dialogVisible"
    width="1000px"
    @close="close"
  >
    <div class="temp-add" id="temp-add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="customName">
              <el-input
                v-model="ruleForm.customName"
                placeholder="请填写模板名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编码" prop="customCode">
              MB -
              <el-input
                v-if="ruleForm.codeEidt"
                style="width: 80%"
                v-model="ruleForm.customCode"
              ></el-input>
              <span v-if="!ruleForm.codeEidt">{{ ruleForm.customCode }}</span>
              <span
                class="update"
                v-if="!ruleForm.codeEidt && !ruleForm.id"
                @click="ruleForm.codeEidt = true"
                >修改</span
              >
              <span
                style="color: #409eff; cursor: pointer"
                v-if="ruleForm.codeEidt && !ruleForm.id"
                @click="submitCode"
                >保存</span
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板类型" prop="customType">
              <el-select
                v-model="ruleForm.customType"
                placeholder="请选择模板类型"
              >
                <el-option label="文件类型" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输出类型" prop="outType">
              <el-select
                v-model="ruleForm.outType"
                placeholder="请选择输出类型"
              >
                <el-option
                  v-for="item in outTypeOptions"
                  :key="item"
                  :label="`.${item}`"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="模板附件" prop="fileId">
          <el-upload
            class="upload-demo"
            action="#"
            :file-list="fileList"
            :http-request="uploadUrl"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            accept=".doc, .docx, .xls, .xlsx, .pdf"
          >
            <el-button type="primary">选择附件</el-button>
            <span slot="tip" class="el-upload__tip">只支持DOC/DOCX/XLS/XLSX/PDF，且不超过10MB（最多可上传1件）</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="close" round>取 消</el-button>
        <el-button type="warning" @click="submitForm('ruleForm')" round>确认提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import templateService from "@/service/template.js";
import resourcesService from "@/service/ResourcesService.js";
export default {
  data() {
    return {
      dialogVisible: false,
      template: new templateService(),
      ResourcesService: new resourcesService(),
      ruleForm: {
        id: "",
        customName: "",
        customCode: new Date().getTime(),
        resource: "",
        fileId: "",
        customType: "",
        outType: "",
        codeEidt: false,
      },
      fileList: [],
      outTypeOptions: ["doc", "docx", "xls", "xlsx",'pdf'],
      rules: {
        customName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        customCode: [{ required: true, message: "请输入模板编码", trigger: "blur" }],
        customType: [{ required: true, message: "请选择模板类型", trigger: "change" }],
        outType: [{ required: true, message: "请选择输出类型", trigger: "change" }],
        fileId: [{ required: true, message: "请上传模板附件", trigger: "blur" }],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      if(!newValue) this.$refs.ruleForm.clearValidate();
    },
  },
  methods: {
    openInit(row) {
      this.dialogVisible = true;
      if (row) {
        this.ruleForm.id = row.id;
        this.ruleForm.customName = row.customName;
        this.ruleForm.customCode = row.customCode.replace("MB-", "");
        this.ruleForm.fileId = row.content;
        this.ruleForm.customType = row.customType + "";
        this.ruleForm.outType = row.outType;
        this.ruleForm.codeEidt = false;
        this.fileList = [{
          fileUrl: row.content,
          name: row.customName,
        }];
      };
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 10) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error",
        });
        return false;
      }
    },
    submitForm(formName) {
      if (this.ruleForm.codeEidt) {
        this.$message.error("请保存模板编号");
        return;
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            channelCode: "sequip", 
            content: this.ruleForm.fileId, // 相关配置内容
            createBy: window.sessionStorage.getItem("userCode"), // 创建人编码
            customCode: "MB-" + this.ruleForm.customCode, //  模板编码 MB- 开头后面跟时间戳保留14位
            customName: this.ruleForm.customName, // 模板名称 ,
            customType: this.ruleForm.customType, // : 模板类型 1-文件类型,2-代码类型 = ['1',
            id: this.ruleForm.id, //
            isDelete: false, // 是否删除
            outType: this.ruleForm.outType, // 模板输出类型 ,
            status: 0, // 模板状态 0-停用 1-启用 = ['0', '1']integerEnum:0, 1,
            updateBy: window.sessionStorage.getItem("userCode"), //  更新人编码
          };
          let res;
          if (this.ruleForm.id) {
            res = await this.template.templateUpdate(data);
          } else {
            res = await this.template.templateAdd(data);
          };
          if (res.data.code === "0000") {
            this.$message.success("成功");
            this.close();
            this.$emit("successCb");
            this.$refs.ruleForm.clearValidate()
          };
        } else {
          return false;
        }
      });
    },
    async uploadUrl(file) {
      let files = [];
      files.push(file.file);
      let res = await this.ResourcesService.uploadFile("sequip-svc", "template", 1, files);
      if (res.code === "0000") {
        this.ruleForm.fileId = `/res/v3/download?fileId=${res.list[0].fileId}&applicationName=sequip-svc&businessTypeCode=template&free=1&businessDataTag=${res.list[0].fileId}`;
        res.list[0].name = res.list[0].fileName;
        this.fileList.push(res.list[0]);
      }
    },
    //超出文件上传上限的提示
    handleExceed() {
      this.$confirm("只能上传一个文件，如需更换，点击删除后重新上传", "提示", { confirmButtonText: "确定" });
    },
    //删除上传的文件钩子函数
    handleRemove() {
      this.ruleForm.fileId = "";
      this.fileList = [];
    },
    submitCode() {
      this.ruleForm.codeEidt = false;
    },
    close() {
      this.ruleForm = {
        id: "",
        customName: "",
        customCode: new Date().getTime(),
        resource: "",
        fileId: "",
        customType: "",
        outType: "",
        codeEidt: false,
      };
      this.fileList = [];
      this.dialogVisible = false;
      this.$refs.ruleForm.clearValidate()
    },
  },
};
</script>

<style scoped lang="less">
.temp-add {
  background-color: #fff;
  padding: 30px;
  padding-top: 0;
  .el-upload__tip {
    color: #096dd9;
    font-size: 14px;
    margin-left: 30px;
  }
}
.update {
  color: #409eff;
  cursor: pointer;
  margin-left: 8px;
}
</style>
<style lang="less">
.temp-add {
  margin-top: 20px;
  background-color: #fff;
  padding: 30px;
}
</style>
