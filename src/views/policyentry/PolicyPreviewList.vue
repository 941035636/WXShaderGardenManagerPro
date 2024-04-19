<template>
	<div id="PolicyPreviewList">
		<div class="title-text common-style">
			<span class="item1">保单录入</span>
			<div class="fr">
				<el-button  round size="medium" @click="resetForm">取消</el-button>
				<el-button type="warning" round size="medium" @click="submitForm">下一步</el-button>
			</div>
		</div>
		<Step :stepNum="stepNum" :showBranch="true"></Step>
		<div class="common-style pd-content">
			<div class="title-text1">
				<span class="line"></span><span>上传清单</span>
				<el-button type="warning" size="small" class="ml50" @click="editEle">添加人员</el-button>
				<el-upload
					style="display:inline-block"
						class="upload-demo ml10"
						:action="url1"
						:headers= 'headers'
						:on-success='handleSuccess1'
						:on-error="onError"
						:before-upload="onProgress"
						:show-file-list='false'
						accept=".xlsx , .xls"
					>
					<el-button type="warning" size="small">批量上传人员</el-button>
				</el-upload>
				<span class="ts-download ml20" @click="download">
					<span class="el-icon-upload" style="color:#409EFF; font-size:24px"></span>
					<span style="color:#409EFF; font-size:14px;text-decoration:underline; ">下载人员导入模板</span>
				</span>
				<span class="fr">
					<span class="f14">已添加  <span style="color:#fa8c16">{{addList.length}}</span>  位人员</span>
					<span class="all-delete ml20" @click="allDel"><i class="el-icon-delete"></i>全部删除</span>
				</span>
			</div>
			<div class="no-data mt20" v-if="addList.length == 0">
				暂无清单信息，请点击添加或批量上传
			</div>
			<el-table v-else :data="addList"  style="width: 90%;margin-left:5%;" center border :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
				<el-table-column  label="姓名" prop="name"></el-table-column>
				<el-table-column  label="证件类型" prop="licenceType"></el-table-column>
				<el-table-column  label="证件号" prop="code"></el-table-column>
				<el-table-column label="投保房屋详细地址" width="400">
                    <template slot-scope="scope">
                        <span>{{scope.row.houseProvinceName}}{{scope.row.houseCityName}}{{scope.row.houseCountyName}}{{scope.row.houseLocation}}</span>
                        <span class="col-red" v-if="!scope.row.houseProvinceCode || !scope.row.houseCityCode || !scope.row.houseCountyCode || !scope.row.houseLocation"><i class="el-icon-warning"></i>  请补全投保房屋地址</span>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-org" @click="editEle(scope.$index, scope.row)">修改</el-button>
						<el-button  type="text" class="col-org" @click="handleDelete(scope.$index, scope.row,'addList')">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
		</div>
		<ListEdit ref="ListEdit" :options="options1" @insertData="insertData"></ListEdit>
	</div>
</template>

<script>
import Step from './components/stepList'
import ListEdit from './components/ListEdit'
import PolicyentryService from '../../service/PolicyentryService'
import UserService from '@/service/UserService.js';
import {elevator} from '../../server/accidenServer.js';
import ContractService from '../../service/ContractService'
import ResourcesService from '../../service/ResourcesService'
import store from "../../store/index"
import {DataStructure} from '../../mixins/DataStructure'
import {Loading, Message} from 'element-ui'
import {address} from '@/util/addressAnalysis.js'
export default {
	name:'PolicyPreviewList',
	components:{
		Step,ListEdit
	},
	mixins:[DataStructure],
	data() {
		return {
			stepNum:2,
			PolicyentryService:new PolicyentryService(),
			ContractService: new ContractService(),
			ResourcesService: new ResourcesService(),
			Elevator:new elevator(),
			UserService: new UserService(),
			addList:[],
			url1: this.$apiUrl.DOWNLODA_PD_TEM_GZ + '?productCode=22PR661972',
			headers:{
                authorization:window.sessionStorage.getItem('authorization'),
                'jtpf.userId': window.sessionStorage.getItem('userCode'),
            },
			options1:[],
			address: {},
			idType: [
                {
                    "value": "cardType_0",
                    "label": "中国居民身份证"
                },
                {
                    "value": "cardType_1",
                    "label": "护照"
                },
            ],
		};
	},
	computed: {
		
	},
	store,
	created() {
		this.getAreas();
		if(this.$route.query.flag == 'again') {
			this.addList =this.$store.getters.jcList;
		}
	},
	methods: {
		async getAreas(){ //获取地区
			const res = await this.UserService.getArea();
			let {code} = res;
			if(code == "0000"){
				this.options1 = res.data;
				this.address = new address(res.data)
			}
		},
		resetForm(){
			this.$router.push({
				path: '/order/offline/add',
				query:{
					flag:'again'
				}
			});
		},
		submitForm(){
			if(this.addList.length == 0) {
				this.$message({
					type: 'error',
					message: '清单不能为空，请修改后重新提交!'
				});
				return false;
			}
			if(this.addList.find(item => item.licenceTypeNo == "cardType_0" && !this.$stringHelper.isCardtValid(item.code))) {
				this.$message({
					type: 'error',
					message: '姓名：' + this.addList.find(item => item.licenceTypeNo == "cardType_0" && !this.$stringHelper.isCardtValid(item.code)).name + '，中国居民身份证输入有误，请重新输入!'
				});
				return false;
			}
			if(this.addList.find(item => !item.houseProvinceCode || !item.houseCityCode || !item.houseCountyCode || !item.houseLocation)) {
				this.$message({
					type: 'error',
					message: '姓名：' + this.addList.find(item => !item.houseProvinceCode || !item.houseCityCode || !item.houseCountyCode || !item.houseLocation).name + '，投保房屋地址不全，请补全!'
				});
				return false;
			}
			this.$store.commit('updateJcList',this.addList);
			this.$router.push({
				path: '/PolicyPreviewDetail',
			});
		},
		editEle(index,form) {
			this.$refs.ListEdit.showDialog(index,form);
		},
		handleDelete(index,row,name) {
			let msg = '是否删除当前信息？';
			this.$confirm(msg, '删除提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this[name].splice(index,1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		insertData(form,index) {
			if(index != undefined) {
				this.addList.splice(index,1,form);
			} else {
				this.addList.push(form);
			}
		},
		// 模版上传成功
        handleSuccess1(file, fileList) {
            this.loadingInstance.close();
            let {code} =file
            if(code=='0000'){
                this.$message.success('上传成功');
                file.list.forEach(item => {
					item.licenceTypeNo = this.idType.find(i => i.label == item.licenceType) ? this.idType.find(i => i.label == item.licenceType).value : ''
					item.code = item.id;
					let areaObj = this.address.smart(item.address)
					item.houseProvinceCode = areaObj.provinceCode;
					item.houseCityCode = areaObj.cityCode;
					item.houseCountyCode = areaObj.countyCode;
					item.houseLocation = areaObj.location
					item.houseProvinceName = areaObj.province
					item.houseCityName = areaObj.city
					item.houseCountyName = areaObj.county
					this.addList.push(item)
                });
            }else{
                this.dialogVisible=true;
                this.$message.error(file.msg);
            }
        }, 
        onError(){
            this.loadingInstance.close();
            this.$message.error('失败');

		},
		// 上传时执行的函数
        onProgress(){
            this.loadingInstance = Loading.service({
                text: "加载中..."
            });
		},
		allDel() {
			let msg = '是否全部删除？';
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.addList = [];
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		// 下载电梯模版
        async download(){
            this.ResourcesService.exportFile(this.$apiUrl.NEW_TEMPLATE,{'productCode':'22PR661972'})
		},
		 //修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                // return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;font-weight:500;';
                return 'background: #e8e8e8;color:#101010;font-size:16px;font-weight:500;';
            } else {
                return 'background: #fff';
            }
		},
	}
};
</script>

<style lang="less">
#PolicyPreviewList{
	// background-color: #ffffff;
	font-size: 14px;
	color: #333333;
	padding-bottom: 30px;
	box-sizing: border-box;
	.common-style {
		margin: 10px;
		background-color: #ffffff;
		border-radius: 5px;
	}
	.no-data {
		font-weight: 400;
		font-size: 18px;
		color:#919191;
		letter-spacing: 0px;
		line-height: 30px;
		text-decoration: none;
		text-align: center;
	}
	.col-red {
		color: #ff7150;
	}
	.pd-content {
		padding: 20px;
		.title-text1 {
			font-size: 20px;
			color: #101010;
			padding: 20px 0px;
			border-bottom: 1px solid #ccc;
			.line {
				border-left: 5px solid #ffc069;
				margin-right: 20px;
				margin-left: 20px;
			}
			.all-delete {
				cursor: pointer;
				font-size: 18px;
				color: #ff7150;
				font-weight: 400;
			}
			.ts-download{
				display: inline-block;
				cursor: pointer;
				span{
					vertical-align: middle;
				}
			}
		}
	}
	.pd20 {
		padding: 20px;
	}
	.title-text {
		height: 50px;
		line-height: 50px;
		font-size: 20px;
		color: #101010;
		padding: 5px 10px;
	}
	.step-line {
		padding: 25px;
		.el-step.is-horizontal .el-step__line {
			top: 20px;
		}
		.el-step__icon {
			width: 40px;
			height: 40px;
		}
		.el-step__title.is-process {
			font-weight: 500;
			color: #C0C4CC;
		}
		.is-finish .el-step__icon.is-text {
			border-width: 1px;
			background-color: #e6f7ff;
		}
		.is-wait .el-step__icon.is-text,.is-process .el-step__icon.is-text {
			border-width: 1px;
			background-color: #f7f7f7;
		}
		.el-step__head.is-process {
			color: #C0C4CC;
			border-color: #C0C4CC;
		}
		.el-step__head.is-finish {
			color: #096dd9;
			border-color:#096dd9;
		}
		.el-step__title.is-finish {
			color:#101010;
		}
	}
	.branch-name {
		background-color: #e6f7ff;
		color: #096dd9;
		border-radius: 5px;
		font-size: 14px;
		padding: 8px 50px;
		text-align: center;
		font-weight: bold;
		margin-left: 39%;
	}
	.footer{
		width: 100%;
		text-align: center;
		.footer-resetForm{
			width: 110px;
			background-color: #F8F8F8;
			border: 1px solid #ECECEC;
		}
		.footer-submitForm{
			width: 160px;
			background-color: #6683D5;
		}
	}
	.col-org {
		color: #fa8c16;
	}
}
</style>
