<template>
  <el-dialog
    id="addFile"
    title="上传附件"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="650px"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="文件类型" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="请选择" @change="handleSelectionChange">
          <el-option
            v-for="(item,key) in fileTyepList"
            :key="key"
            :label="item.itemText"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件标签" prop="labelId" v-if="ruleForm.typeId !=''">
        <div class="label-box">
          <span :class="{'active-span': ruleForm.labelId == item.id}"  v-for="(item, key) in fileLableList" :key="key" @click="handleLabelIdChange(item)">{{item.itemText}}</span>
          <i class="el-icon-circle-plus-outline add-file-icon"  @click="addChildrenFlag=true"></i>
        </div>
        
      </el-form-item>
      <el-form-item label="文件" required>
        <el-upload
            action="#"
            multiple
            :limit="9"
            :auto-upload="false"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :http-request="Upload"
            :on-remove="removeFile"
            :on-success="handleAvatarSuccess"
            :show-file-list="true"
            :file-list="fileList"
            :on-exceed="onExceed"
            :on-change="fileOnChange"
            accept=".doc, .DOC, .docx, .DOCX, .pdf, .PDF, .zip, .ZIP, rar, .RAR"
            ref="upload"
          >
            <el-button
              size="small"
              type="primary"
            >上传附件</el-button>
            <!-- <span style="margin-left:20px;" class="colstyle">只支持PDF/PNG/JPG，大小不超过20M（最多可上传9件）</span> -->
          <div slot="tip" class="el-upload__tip">只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）</div>
          </el-upload>
      </el-form-item>
    </el-form>
      <el-dialog
        width="30%"
        title="新增标签"
        :visible.sync="addChildrenFlag"
        append-to-body>
        <el-form :model="ruleFormTwo" :rules="rules" ref="ruleFormChildren" label-width="160px" class="demo-ruleForm">
          <el-form-item label="标签名称" prop="lableName" >
            <el-input v-model.trim="ruleFormTwo.lableName" placeholder="请输入专项行动类型" style="width:70%;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearTwo('ruleFormChildren')">取 消</el-button>
          <el-button type="primary" @click="addCompanyUser('ruleFormChildren')">确 定</el-button>
        </span>
      </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" round>取 消</el-button>
      <el-button type="warning" @click="register" round>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addFileLabel,planFile} from '@/service/accidentManagement'
import userManage from '@/service/userManage'
import { validateLabel } from '@/util/validateFrom'
  export default {
    name: 'AddFile',
    props: {
      
    },
    data() {
      return {
        userManage: new userManage(),
        dialogVisible:false,
        addChildrenFlag:false,
        uploadLoading:false,
        ruleForm: {
          typeId:'',
          typeName:'',
          labelId:'',
          labelName:'',
        },
        ruleFormTwo:{
          lableName:'',
        },
        rules: {
          typeId:{required:true,message:'请选择文件类型', trigger:'blur'},
          labelId:{required:true,message:'请选择文件标签', trigger:'blur'},
          lableName:[
            {required:true,validator:validateLabel, trigger:'blur'},
            ],
        },
        fileTyepList:[],
        fileLableList:[],
        fileList:[],
        fileData:'',
      }
    },
    computed: {
    },
    mounted() {
      // this.initRole()
    },
    methods: {
      async initData(val) {
        this.dialogVisible = true
        this.getIndustryData()
      },
      async getIndustryData() {
        //获取行业分类数据
        let res = await this.userManage.dictGet(true, 40001);
        if (res.code == "0000") {
          this.fileTyepList = res.data
        }
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.fileList = []
        this.dialogVisible = false
      },
      clearTwo() {
        this.$nextTick(() => {
          this.$refs['ruleFormChildren'].resetFields()
        })
        this.addChildrenFlag = false
      },
      close() {
        this.clear()
      },
      addCompanyUser(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.addActionType(ruleForm)
          } else {
            return false;
          }
        });
      },
      // 插入标签
      async addActionType(ruleForm){
        let form = new FormData()
        form.append('lableName',this.ruleFormTwo.lableName)
        let res = await addFileLabel(form,this.ruleForm.typeId,)
        if(res.code === '0000') {
          this.clearTwo()
          await this.getIndustryData()
          this.handleSelectionChange()
        }
      },
      async configRegister() {
        if(this.fileList.length ==0) {
          this.$message.error('请选择上传文件')
          return
        }
          this.fileData = new FormData();  // new formData对象
          this.$refs.upload.submit();  // 提交调用uploadFile函数
          this.fileData.append('typeId', this.ruleForm.typeId);  // 添加机构id
          this.fileData.append('typeName', this.ruleForm.typeName);  // 添加机构id
          this.fileData.append('labelId', this.ruleForm.labelId);  // 添加机构id
          this.fileData.append('labelName', this.ruleForm.labelName);  // 添加token
          const res = await planFile(
            this.fileData,
            `/${this.$route.query.id}/enclosure`
          )
          if (res.code == '0000') {
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.close()
            this.$emit('successCb')
          }
      },
      register() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.configRegister()
          } else {
            return false
          }
        })
      },
      // 选中类型
      handleSelectionChange() {
        let {sysDictItemEntitys,itemText} = this.fileTyepList.find((v1)=>v1.id===this.ruleForm.typeId)
        this.ruleForm.typeName = itemText
        this.fileLableList = sysDictItemEntitys || []
      },
      // 选中标签
      handleLabelIdChange(item) {
        this.ruleForm.labelName = item.itemText
        this.ruleForm.labelId = item.id
      },
      beforeUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 20
        if (!isLt10M) {
          this.$message({ message: "文件过大", type: "error" });
          return false;
        }
        let arrFile = [file]
      },
      async Upload(file) { // 图片上传
       this.fileData.append('files', file.file);  // append增加数据
      },
      // 文件超出个数限制时的钩子
      onExceed() {
        this.$message({ message: "最多上传9个文件", type: "error" });
      },
      // 点击上传按钮触发数据
      fileOnChange(file, fileList) {
        const isLt10M = file.size / 1024 / 1024 < 20
        if (!isLt10M) {
          this.fileList = fileList.filter(f=>f.name !== file.name);
          this.$message({ message: "文件过大", type: "error" });
          return false;
        } else {
          this.fileList = fileList;
        }
      },
      // 删除文件的函数
      removeFile(file,fileList) {
        this.fileList = fileList;
      },
      handleAvatarSuccess(res, file) {
      },
      handlePreview() { },
    },
  }
</script>

<style lang="less">
#addFile {
  .details-title {
    margin: 10px 0;
    font-size: 18px;
    font-weight: 700;
  }
  .label-box {
    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      background-color: #ccc;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .active-span {
      background-color: #FF9959;
      color: #fff;
    }
    .add-file-icon {
      cursor: pointer;
      font-size: 20px;
      color: #FF6200;
    }
  }
  .el-upload--text {
    width: 90px;
    border: none;
    height: 40px;
    overflow: none;
  }
  .el-upload__tip {
    margin-top: -10px;
    color: #355E92;
    font-size: 14px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}

</style>
