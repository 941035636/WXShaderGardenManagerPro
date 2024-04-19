<template>
  	<div class="configDialog">
		<el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal=false destroy-on-close custom-class="configDialog_dialog" @close="closeDialog">
			<div>
				<el-form :model="form" :rules="rules" ref="form" label-width="130px">
					<el-form-item label="企业名称：">
						<SearchHolder ref="searchHolder"
							:erpInfoList='userList'
							:bindVal="'userCode'"
							@remoteMethod='getsearch'
							@changeVal='changeHolder'
							style="width:100%">
						</SearchHolder>
						<div v-if="form.thirdCorpId">
							<p>用户编码：{{form.thirdCorpId}}</p>
							<p>联系人：{{form.linkname}}</p>
							<p>联系电话：{{form.telphone}}</p>
						</div>
					</el-form-item>
					<el-form-item label="授权平台：">
						<span>物联网平台</span>
					</el-form-item>
					<el-form-item label="管理员职位：">
						<span>企业用户</span>
					</el-form-item>
					<el-form-item label="商户类型：">
						<el-radio v-model="thirdCorpType" label="1">设施主</el-radio>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog" type="info" :size="size" round>取 消</el-button>
				<el-button @click="saveFn" type="warning" round :size="size">确认提交</el-button>
			</span>
		</el-dialog>
  	</div>
</template>

<script>
import SearchHolder from './selectApplication'
import {elevator} from '../../../server/accidenServer.js'
import userService from '../../../service/UserService'
export default {
	components:{
		SearchHolder	
	},
  	name: "configDialg",
	props: {
		title: {
		type: String,
			default: "新增授权信息"
		},
		form: {
			type: Object,
			default() {
				return {
					companyName: "",                // 公司名称
					authCode: "",            // 
					industry: "",         // 
					linkname: "",               // 联系人名称
					platformCode: "",
					position: "",                   // 
					remark: "",                 // 
					scene: "",               //
					telphone: "",              //联系方式
					thirdCorpId: "",       //用户编号
					thirdCorpType: ""
				}
			}
		},
		size: {
			type: String,
			default: "small"
		},
		isAdd: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			thirdCorpType:'1',
			Elevator: new elevator(),
			UserService: new userService(),
			dialogVisible: false,
			fileName: "",
			rules: {},
			userList: [],
		}
	},
	methods: {
		saveFn() {
			this.$refs['form'].validate((valida) => {
				if (valida) {
					if (this.isAdd) {
						this.$emit("addConfigAccount", this.form);
					} else {
						this.$emit("editConfigAccount", this.form);
					}
				} else {
					return false;
				}
			})
		},
		closeDialog() {
			this.dialogVisible = false;
			this.$refs.searchHolder.resetData();
		},
		// 获取投保人
		async getsearch(val){
			var value = '';
			if(window.sessionStorage.getItem('provinceCode') !== '000000'){
				value = window.sessionStorage.getItem('provinceCode')
			}
			 let form = {
				'areaCode':value,
				'loginIdOrUserName':val,
				'pageNum':1,
				'pageSize':10,
				'papers':'',
				'userType':'',
			}
			let res = await this.Elevator.getuserlist(form);
			let {code} =res;
			if(code=='0000'){
				this.userList = res.list;
			}
			
		},
		async changeHolder(val) {
			let userloginId = this.userList.find(item => item.userCode == val) ? this.userList.find(item => item.userCode == val).userloginId : '';
			if(this.$stringHelper.isPhoneNum(userloginId)) {
				this.form.telphone = userloginId;
			}
			let res = await this.Elevator.getauthsequip(val,'sequip');
			let {code,data} = res
			if(code == '0000') {
				this.form.thirdCorpId = data.userCode;
				this.form.companyName = data.orgFullName;
				this.form.linkname = data.custOrganizationElementList.find(item => item.elementCode == 'linkManName').elementValues
				if(!this.form.telphone) {
					this.form.telphone = data.custOrganizationElementList.find(item => item.elementCode == 'linkManPhone').elementValues
				}
			}
		},
	},
}
</script>

<style lang='less'>
  
</style>
