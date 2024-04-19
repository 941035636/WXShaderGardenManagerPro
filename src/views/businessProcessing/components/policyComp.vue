<template>
    <div class="table mt15">
		<div class="table-title">
			<!-- <span>更新时间：{{row.updateDate}}</span> -->
			<span>订单号：{{row.orderCode}}</span> / <span v-if="row.source=='00'">PC</span><span v-if="row.source=='01'">APP</span>
			<span class="ml50">类型：{{row.sortName}} / 保单 <span class="new-insurance" v-if="row.renewal=='N'">（新保）</span><span class="new-insurance col-org" v-if="row.renewal=='Y'">（续保）</span></span>
			<span class="fr mr10">{{row.productName}}  /  {{row.issueCompanyName}}</span>

		</div>
		<div class="table-data">
			<div class="title1 data-item">
				<div class="centered-block">
					<p class="color-gray-3 f14 lh30">
						<span class="font-colo1 hand-show" @click="userInformation(row)" v-if="datas.find(item => item.key == '10101')">
							{{row.policyHolderName}}
						</span>
						<span v-else class="font-colo1">
							{{row.policyHolderName}}
						</span>
						<span class="ml20" v-if="row.onlinePro">( <span v-if="row.sequipName">{{row.sequipName}}：{{ row.total }} | </span><span @click="relation(row)" v-if="datas.find(item => item.key == '10091')" class="col-org hand-show"> 查看清单</span>)</span>
					</p>
					<p class="color-gray-3 f14 lh30">
						<span class="w400"> 投保单号：<span>{{row.appFormCode}}</span></span>
						<span v-if="row.policyNo"> 保单号：<span>{{row.policyNo}}</span><i @click="accessPolicyDetails(row)" class="el-icon-download font-colo1 ml10 f16 hand-show"></i></span>
					</p>
					<p class="color-gray-3 f14 lh30">
						<span class="w400"> 投保区域：{{row.region}}</span>
						<span> 分支机构：{{row.branchName}}</span>
					</p>
					<p class="color-gray-3 f14 lh30">
						<span  class="w400">保单类型：
							<span v-if="row.policyKind=='00'">电子保单</span>
							<span v-if="row.policyKind=='01'">纸质保单</span>
							<span class="font-colo1 hand-show ml10 under-line" @click="dialogVisible = true">查看</span>
						</span>
						<span>联系人：{{row.linkPerson}} / <span v-if="row.linkTel">{{row.linkTel}}</span><span v-else>--</span></span> <span class="font-colo1 hand-show ml10 under-line" @click="dialogVisible1 = true">查看</span>
					</p>
				</div>
			</div>
			<div class="title2 data-item text-center">
				<div class="centered-block1">
					<p class="color-gray-3 f14 mb10 text-center">投保日期：{{row.createDate}}</p>
					<p class="color-gray-3 f14 mb10 text-center" v-if="row.confirmWhitPayDate">到账日期：{{row.confirmWhitPayDate}}</p>
					<p class="color-gray-3 f14 mb10 text-center" v-if="row.issueDate">出单时间：{{row.issueDate}}</p>
					<p class="color-gray-3 f14 fle" style="justify-content:center;">
						<span style="display:block;"> 保险期间：</span>{{row.startDate}}<br/>{{row.endDate}}
					</p>
				</div>
			</div>
			<div class="title2 data-item text-center">
				<div class="centered-block1">
					<p class="f14 lh30">
						<span class="font-colo1">{{row.appStatus}}</span>
						<el-button type="text" icon="el-icon-question" @click="reasonsFailure(row)" v-if="row.productCodes == '1' && row.state=='08'"></el-button>
						<span class="color-gray-3" v-if="row.invoiceStatus=='00'">/ 未申请发票</span>
						<span class="font-colo1" v-if="row.invoiceStatus=='01'">/ 已申请发票</span>
						<span v-if="row.invoiceStatus=='02'">/ <span class="color-red">开票失败</span></span>
					</p>
					<!-- <p class="font-colo1 f14 lh30"><span></span>{{row.appStatus}}<span v-if="row.pushStatus"> / {{row.pushStatus == '00' ? '未推送' : row.pushStatus == '01' ? '已推送' : row.pushStatus == '02' ? '推送失败' : ''}}</span></p> -->
					<p class="color-gray-3 f14 lh30">应收：<span>￥{{row.afterPrem}}</span> <span v-if="row.applicationTypeName" class="font-colo1"> ({{row.applicationTypeName}})</span></p>
					<p style="color:#FF4D24;" class="color-gray-3 f14 lh30" v-if="row.actualPrem">实收：<span>￥{{row.actualPrem}}</span></p>
					<p class="font-colo f14 lh30" @click="premium(row)" v-if="row.state == '01' && row.productCategory1 != 'yjsp' && row.pushStatus != '01' && row.pushStatus != '02' && datas.find(item => item.key == '10096')">修改保费</p>
					<p class="color-gray-3 f14 lh30"><span v-if="row.payTypeName">{{row.payTypeName}} / </span> <span v-if="row.productCodes == '1'"> 线上出单</span><span v-else> 线下业务</span></p>
				</div>
			</div>
			<div class="title6 data-item text-center">
				<div class="state-item">
					<div class="centered-block1">
						<p class="col-org f14 lh30 hand-show" @click="enquirydetails(row)" v-if="datas.find(item => item.key == '10090')">查看详情</p>
						<p class="col-org f14 lh30 hand-show" @click="paymentnotice(row)" v-if="row.state == '01' && row.productCategory1 != 'yjsp' && (row.productCategory1 != 'ab' || row.productCode =='22PR427751') && datas.find(item => item.key == '10092')">支付通知</p>
						<p class="col-org f14 lh30 hand-show" @click="identification(row)" v-if="row.state == '01'&& (row.pushStatus !== '01' && row.pushStatus !== '02') &&(row.productCategory1 != 'ab' || row.productCode =='22PR427751') && datas.find(item => item.key == '10103') && row.showMoney">到账确认</p>
						<p class="col-org f14 lh30 hand-show" @click="policyupload(row)" v-if="row.state == '02' &&(row.productCategory1 != 'ab' || row.productCode =='22PR427751') && datas.find(item => item.key == '10097')">保单上传</p>
						<p class="col-org f14 lh30 hand-show" @click="policyupload(row)" v-if="row.productCodes == '1' && row.state=='08' &&(row.productCategory1 != 'ab' || row.productCode =='22PR427751') && datas.find(item => item.key == '10097')">保单上传</p>
						<p class="col-org f14 lh30 hand-show" @click="endorsements(row)" v-if="(row.state == '03' ||  row.state == '04' ||  row.state == '06') && row.productCategory1 != 'yjsp' && datas.find(item => item.key == '10098')">批单补录</p>
						<p class="col-org f14 lh30 hand-show" @click="missMessage(row)" v-if="row.state == '08' && row.productCodes == '1' && datas.find(item => item.key == '10099')">报错报文</p>
						<p class="col-org f14 lh30 hand-show" @click="isPuah(row)" v-if="(row.state == '08' || row.state == '02') && row.productCodes == '1' && row.productCategory1 != 'ab' && datas.find(item => item.key == '10102')">出单重推</p>
					</div>
				</div>
			</div>
		</div>
		<el-dialog title="保单信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<div class="f16">
				<p>保单类型：<span v-if="row.policyKind=='00'">电子保单</span><span v-if="row.policyKind=='01'">纸质保单</span></p>
				<p v-if="row.policyKind=='00'">电子邮箱：{{row.policyMailAddress}}</p>
				<p v-if="row.policyKind=='01'">保单邮寄地址：{{row.mailAddress}}</p>
			</div>
		</el-dialog>
		<el-dialog title="联系人信息" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose" class="dialog-p">
			<div class="f16">
				<p>联系人：{{row.linkPerson}}</p>
				<p>联系电话：{{row.linkTel}}</p>
				<p>联系地址：{{row.holderProvinceName}}{{row.holderCityName}}{{row.holderCountyName}}{{row.location}}</p>
			</div>
		</el-dialog>
		<el-dialog title="商户地址" :visible.sync="dialogVisibleAddress" width="30%" class="dialog-p">
			<div class="f16">
				<p>地址：{{merchantAddress}}</p>
			</div>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="exhibition" width="30%">
			<p class="item11"><span class="item12">投保单号</span><el-input class="item13" v-model="appFormCode" disabled></el-input></p>
			<p class="item11"><span class="item12">下发用户</span><el-input class="item13" v-model="policyHolderName" disabled></el-input></p>
			<p class="item11"><span class="item12">下发邮箱</span><el-input class="item13" type="email" v-model="mailbox"></el-input></p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="exhibition = false">取 消</el-button>
				<el-button type="primary" @click="paymentnotices">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="报错报文" :visible.sync="dialogVisibleE" width="40%">
			<span>{{data2}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisibleE = false">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改保费Dialog -->
		<revisionPremiumDialog ref="revisionPremiumDialog" :productCode="productCode" @successCallback="searchview"></revisionPremiumDialog>
		<revisionPremiumYinZi ref="revisionPremiumYinZi" @successCallback="searchview"></revisionPremiumYinZi>
	</div>
</template>
<script>
	import { elevator } from '../../../server/accidenServer'
	import ResourcesService from '../../../service/ResourcesService'
	import UserService from '../../../service/UserService'
	import revisionPremiumDialog from '../revisionPremiumDialog.vue'
	import revisionPremiumYinZi from '../revisionPremiumYinZi.vue'
	import product from '../data/gzProductList.json'
    export default {
		components:{
			revisionPremiumDialog,revisionPremiumYinZi
		},
        name:'PolicyComp',
        props:{
            'row':Object,
        },
        data() {
            return {
                showFlag:false,
				datas:[],
				dialogVisible:false,
				dialogVisibleE: false,
				dialogVisible1:false,
				dialogVisibleAddress:false,
				Elevator: new elevator(),
				ResourcesService: new ResourcesService(),
				UserService: new UserService(),
				merchantAddress: '',
				data2: '',
				appFormCode:'',
				policyHolderName:'',
				mailbox:'',
				exhibition:false,
				productCode:''
            }
        },
		created() {
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		},
		methods: {
			searchview() {
				this.$parent.searchview();
			},
			handleClose() {
				this.dialogVisible = false;
				this.dialogVisible1 = false;
			},
			async relation(row){ //设备清单
				if(row.total == 1 && row.productCategory1 == 'yjsp' && row.insuredsCount == 1) {
					let data = {
						applicationFormCode:row.appFormCode,
						pn:1,
						ps:10
					}
					let res = await this.UserService.getInsurance(data);
					if(res.code == '0000' && res.list.length != 0) {
						let medAddress = res.list.find(item => item.objectType == '40');
						this.merchantAddress = medAddress.extendsList.find(item => item.fieldCode == 'S_O_000157').fieldValues +
						medAddress.extendsList.find(item => item.fieldCode == 'S_O_000158').fieldValues +
						medAddress.extendsList.find(item => item.fieldCode == 'S_O_000159').fieldValues +
						medAddress.extendsList.find(item => item.fieldCode == 'S_O_000160').fieldValues;
					}
					this.dialogVisibleAddress = true;
				} else {
					let routeData = this.$router.resolve({
						path:'/order/object/list',
						query:{
							appCode:row.appFormCode,
							index:row.sequipListIndex,
							applicationStatus:row.applicationStatus,
							productCode:row.productCode
						}
					})
					window.open(routeData.href, '_blank');
				}
			},
			enquirydetails(row){ //查看详情
				let routeData = this.$router.resolve({
					path:'/order/detail',
					query:{
						orderCode:row.orderCode,
						appCode:row.appFormCode,
						orderStatusName:row.appStatus
					}
				});
				window.open(routeData.href, '_blank');
			},
			premium(row){ // 修改保费
				if(row.productCategory1 == 'gz') {
					let {revisionPrem} = product.data.find(item=>item.productCode == row.productCode) || {revisionPrem:'revisionPremiumDialog'}
					// 特殊产品只有总部客户经理能够修改保费
					if(row.productCode == this.$globalProductCode.PRODUCT_CODE_EMP_GZ_GSC){
						let branchCode = sessionStorage.getItem('branchCode') 
						if(branchCode == 'JT0000') {
							this.productCode = row.productCode;
							this.$refs[revisionPrem].getappdetails(row.appFormCode)
						} else {
							this.$message.error('该产品您没有修改保费权限，请联系总部业务经理进行修改')
						}
					} else {
						this.productCode = row.productCode;
						this.$refs[revisionPrem].getappdetails(row.appFormCode)
					}
				}else if(row.productCategory1 == 'sd') {
					let branchCode = sessionStorage.getItem('branchCode') 
					if(branchCode == 'JT0000') {
						let routeData = this.$router.resolve({
							path:"/order/premium/edit",
							query:{
								appCode:row.appFormCode,
								startDate:row.startDate,
								endDate:row.endDate,
							}
						})
						window.open(routeData.href, '_blank');
					} else {
						this.$message.error('该产品您没有修改保费权限，请联系总部业务经理进行修改')
					}
				} else {
					let path = '/order/premium/dqedit';
					if(row.productCategory1 == 'ty' || row.productCategory1 == 'qzjx') {
						path = '/order/premium/edit';
					}
					let routeData = this.$router.resolve({
						path:path,
						query:{
							appCode:row.appFormCode,
							startDate:row.startDate,
							endDate:row.endDate,
						}
					})
					window.open(routeData.href, '_blank');
				}
			},
			identification(row){ //到账确认
				let routeData = this.$router.resolve({
					path:'/order/premium/confirm',
					query:{
						appCode:row.appFormCode
					}
				})
				window.open(routeData.href, '_blank');
			},
			policyupload(row){ //保单上传
				this.$router.push({
					path:'/order/policy/upload',
					query:{
						appCode:row.appFormCode
					}
				})
			},
			endorsements(row){ //批单补录
				this.$router.push({
					path:'/order/endorsement/upload',
					query:{
						policyNo:row.policyNo,
						index:'',
					}
				})
			},
			async reasonsFailure(row){//报错原因
				let res = await this.Elevator.getReasonsFailure(row.appFormCode);
				if(res.code == '0000'){
					this.$message({
						dangerouslyUseHTMLString: true,
						message: res.data
					});
				}
			},
			async missMessage(row){//报错报文
				let res = await this.Elevator.failurePacket(row.appFormCode);
				if(res.code == '0000'){
					this.data2 = res.data;
					this.dialogVisibleE = true;
				}
			},
			async isPuah(row){ // 出单重推
				let data = {
					"applicationFormCode": row.appFormCode,
					"companyCode": row.issueCompanyCode
				}
				let res = await this.Elevator.ispush(data);
				if(res.code == '0000'){
					this.$message({
						message: '重推成功',
						type: 'success'
					});
					this.$parent.policylist();
				}
			},
			paymentnotice(row){ // 发支付通知
				this.appFormCode = row.appFormCode;
				this.policyHolderName = row.policyHolderName;
				this.certificationmailbox(row.appFormCode);
				this.exhibition = true;
			},
			async certificationmailbox(appFormCode){// 发支付通知
				let data = {
					"appCode":appFormCode
				};
				let res = await this.Elevator.getappdetails(data);
				if(res.code == '0000'){
					this.certificationmailboxs(res.data.holder.holderCode);
				}
			},
			async certificationmailboxs(usercode){// 发支付通知
				let channelNo = 'sequip';
				let res = await this.Elevator.getauthsequip(usercode,channelNo);
				if(res.code == '0000'){
					this.mailbox = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManEmil').elementValues;
				}
			},
			async paymentnotices(){// 发支付通知
				let res = await this.Elevator.paymentnotice(this.mailbox,this.appFormCode);
				if(res.code == '0000'){
					this.exhibition = false;
					this.$message({
						message: '发送成功',
						type: 'success'
					});
					this.trackEvent('消息',row.sortName + '支付通知');
				}
			},
			async accessPolicyDetails(row){ // 电子保单
				let data = {
					"bizCodeType": "01",
					"appCode":row.appFormCode,
					"resCode": "A002"
				}
				if(row.productName.indexOf('线下录单') != -1) {
					data.bizCodeType = '02';
				}
				const parmes = await this.Elevator.getResourcesID(data);
				if(parmes.code =='0000'){
					if(parmes.list && parmes.list.length != 0){
						let res = await this.ResourcesService.downloadOrViewFile(parmes.list[0].fileUrl,true)
					}else{
						this.$message({
							message: '还没有电子保单！！！',
							type: 'warning'
						});
					}
				}
			},
			async userInformation(row){ //用户信息
				let data = {
					"appCode":row.appFormCode
				};
				const parmes = await this.Elevator.getappdetails(data);
				if(parmes.code == '0000'){
					this.$router.push({
						path:'/account/company/detail',
						query:{
							userCode:parmes.data.holder.holderCode
						}
					})
				}
			},
		}
    }
</script>
<style lang="less" scope>
	.w400 {
		width: 300px;
		display: inline-block;
	}
	.col-org {
		color: #fa8c16;
	}
	.hand-show {
		cursor: pointer;
	}
	.under-line {
		text-decoration: underline;
	}
	.dialog-p {
		padding-top: 15px;
		p {
			padding: 10px;
		}
	}
	.color-red {
		color: #f5222d;
	}
</style>