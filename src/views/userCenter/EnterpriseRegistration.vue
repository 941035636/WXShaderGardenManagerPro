<template>
	<div class="EnterpriseRegistration" id="EnterpriseRegistration">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item3">企业名称</span>
					<el-input v-model="form.name" placeholder="请输入企业名称" class="item2"></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">证件号码</span>
					<el-input v-model="form.code" placeholder="请输入社会信用统一代码/组织机构代码" class="item2"></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<el-button type="warning" @click="searchview" class="query-button">查询</el-button>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content1">
				<span class="content1-exports" @click="NewlyAdded"><i class="el-icon-plus"></i>新增</span>
			</div>
			<el-table :data="tableData" stripe style="width: 100%" fit :header-cell-style="getRowClass">
    			<el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
				<el-table-column prop="date" label="证件号码" align="center"></el-table-column>
				<el-table-column prop="date" label="注册时间" align="center"></el-table-column>
				<el-table-column prop="date" label="操作人" align="center"></el-table-column>
  			</el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog :visible.sync="exhibition" width="30%" center>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
				<el-form-item label="企业名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入企业名称" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="证件号码" prop="code">
					<el-input v-model="ruleForm.code" placeholder="请输入证件号码" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="设置密码" prop="password">
					<el-input v-model="ruleForm.password" placeholder="请输入密码" style="width:60%;"></el-input><span @click="randomGeneration" class="generation">随机生成</span>
				</el-form-item>
				<!-- <el-form-item>
					<el-checkbox v-model="ruleForm.checked"><span class="color6">我已阅读并接受</span><span class="color-blue" @click="downFile">《特设保注册协议》</span></el-checkbox>
				</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<span @click="register(ruleForm)" class="register-btn">确认注册</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import ResourcesService from '@/service/ResourcesService'
export default {
	data() {
		return {
			form:{
				name:'',
				code:''
			},
			tableData:[],
			exhibition:false,
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			ruleForm:{
				name:'',
				code:'',
				password:'',
				checked:true
			},
			rules:{
				name: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
					{ min: 2, max: 20, message: '企业名称长度为2-20位字符', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入证件号码', trigger: 'blur' },
					{ max: 20, message: '证件号码最大为20位', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{pattern: /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,20}$/,message: '密码必须为8-20位大小写字母、数字或符号组合哦！'}
				],
			},
		}
	},
	created(){
		
	},
	methods: {
		getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'color:#333333;font-size:16px;font-weight:bold;';
            } else {
                return 'background: #fff';
            }
		},
		NewlyAdded(){//新增
			this.ruleForm = {
				name:'',
				code:'',
				password:'',
				checked:true
			};
			this.exhibition = true;
		},
		randomGeneration(){//随机生成
			let password = this.$numberHelper.RandomCipher(8);
			let reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,20}$/;
			if(reg.test(password)){
				this.ruleForm.password = password;
			}else{
				this.randomGeneration();
			}
		},
		downFile() {//下载特设备注册协议
			// let resourcesService = new ResourcesService()
			// resourcesService.downloadOrViewFile(`${this.$apiUrl.DOWNLOAD_FILE}?fileId=1672097804182880373&free=1`,true)
			// window.location.href = `${this.$apiUrl.DOWNLOAD_FILE}?fileId=1672097804182880373&free=1`;
		},
		register(ruleForm){
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					if(!ruleForm.checked){
						this.$message({
          					message: '请阅读并勾选特社保注册协议',
          					type: 'warning'
						});
						return;
					}
				} else {
					return false;
				}
			});
		},
		searchview(){//查询

		},
		empty(){//清空条件

		},
		empty(){//清空条件

		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.getUserlisy();
		},
	},
}
</script>

<style lang="less">
#EnterpriseRegistration {
	padding-bottom: 80px;
	box-sizing: border-box;
	.elesearch{
		width: 100%;
		padding: 31px 30px 0 20px;
		box-sizing: border-box;
		.row-bg{
			.item2{
				width: 60%;
			}
			.item3{
				margin-right: 10px;
			}
			.query-button{
				width: 100px;
				height: 44px;
				font-weight: 600;
				border-radius: 22px;
			}
			.empty-button{
				width: 130px;
				height: 44px;
				margin-left: 30px;
				background-color: #DCDCDC;
				color: #333333;
				font-weight: 600;
			}
		}
	}
	.content{
		width: calc(100% - 50px);
		margin: 30px 30px 0 20px;
		background-color: #ffffff;
		.content1{
			width: 100%;
			height: 69px;
			line-height: 69px;
			.content1-exports{
				float: right;
				margin-right: 20px;
				color: #DB9728;
				font-size: 18px;
				cursor: pointer;
			}
		}
	}
	.content-total{
		width: calc(100% - 50px);
		margin: 30px 30px 0 20px;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.generation{
		display: inline-block;
		width: 103px;
		height: 34px;
		border: 1px solid #C9984A;
		border-radius:4px;
		box-sizing: border-box;
		text-align: center;
		line-height: 34px;
		margin-left: 10px;
		font-size: 14px;
		color: #C9984A;
		font-weight: 600;
		background-color: #FFF8EE;
		cursor: pointer;
	}
	.color6{
		color: #666666;
	}
	.color-blue {
		cursor: pointer;
		color: #2d8cf0;
	}
	.register-btn{
		display: inline-block;
		width: 162px;
		height: 44px;
		background:rgba(201,152,74,1);
		border-radius:4px;
		font-family:Adobe Heiti Std;
		color: #ffffff;
		font-size: 18px;
		text-align: center;
		line-height: 44px;
		cursor: pointer;
	}
}
</style>
