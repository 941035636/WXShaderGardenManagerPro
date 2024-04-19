<template>
	<div class="temp-add" id="temp-add">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="模板名称" prop="customName">
            <el-input v-model="ruleForm.customName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模板编码" prop="customCode">
						MB - <el-input v-if="ruleForm.codeEidt" style="width:80%" v-model="ruleForm.customCode"></el-input> 
            <span v-if="!ruleForm.codeEidt">{{ruleForm.customCode}}</span>
            <span style="color:#409EFF;cursor:pointer" v-if="!ruleForm.codeEidt" @click="ruleForm.codeEidt=true">修改</span> <span style="color:#409EFF;cursor:pointer" v-if="ruleForm.codeEidt" @click="submitCode">保存</span>
          </el-form-item>
        </el-col>    
      	</el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="模板类型" prop="customType">
                <el-select v-model="ruleForm.customType" placeholder="请选择模板类型">
                  <el-option label="文件类型" value="1"></el-option>
                  <!-- <el-option label="代码类型" value="2" disabled></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="输出类型" prop="outType">
                <el-select v-model="ruleForm.outType" placeholder="请选择输出类型">
                	<el-option label=".doc" value="docx"></el-option>
                	<!-- <el-option label=".pdf" value="pdf" disabled></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="模板附件"  prop="fileId">
            <el-upload class="upload-demo" action="#" :file-list="fileList" :http-request="uploadUrl" :limit="5" multiple :on-exceed="handleExceed" :on-remove="handleRemove" accept=".doc, .docx, xls, xlsx">
              <el-button>上传</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名:.doc .docx</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
	</div>
</template>

<script>
import resourcesService from "@/service/ResourcesService.js";
import templateService from "@/service/template.js";
export default {
	data: function () {
		return {
			ResourcesService: new resourcesService(),
      template:new templateService(),
      ruleForm: {
        customName: '',
        customCode: new Date().getTime(),
        resource: '',
        fileId:'',
        customType:'',
        outType:'',
        codeEidt:false,
      },
      fileList:[],
      rules: {
        customName: [{ required: true, message: '请输入模板名称', trigger: 'blur' } ],
        customCode: [{ required: true, message: '请输入模板编码', trigger: 'blur' } ],
        customType: [{ required: true, message: '请选择模板类型', trigger: 'change' } ],
        outType: [{ required: true, message: '请选择输出类型', trigger: 'change' } ],
        fileId:[{ required: true,message: '请上传模板附件',trigger: 'blur'} ]
      },
    }
	},
	methods: {
    submitForm(formName) {
      if(this.ruleForm.codeEidt){
        this.$message.error('请保存模板编号');
        return;
      }
      this.$refs[formName].validate(async (valid) => {
				if (valid) {
					let data = {
						"channelCode": "sequip",
						"content": this.ruleForm.fileId,    // 相关配置内容
						"createBy": window.sessionStorage.getItem('userCode'),   // 创建人编码
						"customCode": 'MB-' + this.ruleForm.customCode, //  模板编码 MB- 开头后面跟时间戳保留14位
						"customName": this.ruleForm.customName, // 模板名称 ,
						"customType": this.ruleForm.customType,    // : 模板类型 1-文件类型,2-代码类型 = ['1',
						"id": '',  
						"isDelete": false,  // 是否删除
						"outType": this.ruleForm.outType,    // 模板输出类型 ,
						"status": 0,    // 模板状态 0-停用 1-启用 = ['0', '1']integerEnum:0, 1,
						"updateBy": window.sessionStorage.getItem('userCode')    //  更新人编码
					};
					let res  = await this.template.templateAdd(data);
					if(res.data.code === '0000'){
						this.$message.success('成功');
						this.ruleForm = {
							customName: '',
							customCode: new Date().getTime(),
							resource: '',
							fileId: '',
							customType: '',
							outType: '',
							codeEidt: false,
						};
						this.fileList = [];
						this.$router.push({ path:'/template/list' });                  
					}
				} else {
					return false;
				}
  		})
  	},
		async uploadUrl(file){
			console.log(file);
			let res = await this.ResourcesService.uploadFile(file.file)
				if(res.data.code==='0000'){
					this.ruleForm.fileId = res.data.list[0].fileUrl;
					this.fileList.push(res.data.list[0])
				}
		},
		//超出文件上传上限的提示
		handleExceed() {
			this.$confirm("只能上传一个文件，如需更换，点击删除后重新上传", "提示", {	confirmButtonText: "确定" });
		},
		//删除上传的文件钩子函数
		handleRemove() {
			this.ruleForm.fileId = "";
			this.fileList = []
		},
		submitCode(){
			let reg = /^[0-9]{13}$/
			if(reg.test(this.ruleForm.customCode)){
				this.ruleForm.codeEidt = false;
			} else {
				this.$message.error('模板编码的长度为13')
			}
		}  
	}	
}
</script>

<style scoped lang="less">
	.temp-add{
        margin-top: 20px;
        background-color: #fff;
        padding: 30px;
        .el-upload--text{
			width: 40px;
			height: 40px;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
			.el-button{
				width: 100%;
				height: 100%;
				border: none;
				color: #6683D5;
				font-weight: 600;
			}
		}
    }
</style>
<style lang="less">
	.temp-add{
        margin-top: 20px;
        background-color: #fff;
        padding: 30px;
        .el-upload--text{
			width: 100px;
			height: 40px;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
			.el-button{
				width: 100%;
				height: 100%;
				border: none;
				color: #6683D5;
				font-weight: 600;
            }
            .el-upload__tip{
                line-height: 0;
            }
		}
    }
</style>
