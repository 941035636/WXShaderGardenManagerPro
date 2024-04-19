<template>
	<div class="OrderDetails" id="OrderDetails">
		<div class="title">
			<span class="ml10">订单详情</span>
			<div class="order-content">
				|
				<span class="ml10">订单号：{{data.orderCode}}</span>
				<span>提交时间：{{data.applicantStartDate}}</span>
				<span>保单状态：
					<span :style="{'color':data.orderStatusColor}">{{$route.query.orderStatusName}}</span> 
				</span>
			</div>
			<span class="download-policy" @click="DownloadPolicy(data)">下载电子保单</span>
		</div>
		<div class="content">
			<div class="bg-org">
				<div v-if="kuaQi.reason" class="kua-qi">
					<p class="mt10"><span class="bold-title">跨期业务</span><span class="ml20">收入确认时点：{{kuaQi.time}}</span></p>
					<p class="mt10"><span class="bold-title" v-if="kuaQi.reason"></span><span class="ml20">佐证原因：{{kuaQi.reason}}</span><span v-if="kuaQi.fileList && kuaQi.fileList.length != 0" class="ml20 col-blue">(查看附件：<span v-for="(item,index) in kuaQi.fileList" :key="index"><span @click="downLodeFile(item)" class="ml10 cur-p">附件{{index+1}}</span></span>)</span></p>
					<p v-if="kuaQi.reasonQT" class="mt10"><span class="bold-title"></span><span class="ml20">其他原因：{{kuaQi.reasonQT}}</span></p>
				</div>
				<div v-if="daoQian" :class="[kuaQi.time ? 'border-top kua-qi':'kua-qi']">
					<p><span class="bold-title">倒签业务</span><span class="ml20">原因：{{daoQian}}</span></p>
				</div>
			</div>
			<el-tabs type="border-card" v-model="tabState" @tab-click="changeTab" class="state-style">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in options4" :key="index"></el-tab-pane>
			</el-tabs>
			<div v-if="tabState == '1'">
				<div class="policy-content">
					<div class="policy-title">保单信息</div>
					<div class="policy-con">
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>投保产品：</span>
								<span class="text-right" >{{data.productName}}</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>出单公司：</span>
								<span class="text-right">{{companyName()}}</span>
							</div></el-col>
						
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>保障期间：</span>
								<span class="text-right">{{dayNum()}}天 &nbsp;&nbsp;{{data.startDate}}至{{data.endDate}}</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>保险份数：</span>
								<span class="text-right">1份</span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>投保时间：</span>
								<span class="text-right">{{data.createDate}}</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>投保单号：</span>
								<span class="text-right">{{data.applicationFormCode}}<span @click="getDetailsPolicy(data.applicationFormCode)" style="color:#096dd9;cursor: pointer;margin-left:10px;">查看投保单</span></span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>保单号：</span>
								<span class="text-right">{{data.policyNo}}</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>签单时间：</span>
								<span class="text-right">{{issueDate()}}</span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>保险保费：</span>
								<span style="color:#FF334C;">￥{{this.data.afterPrem.toFixed(2)}}元</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>保额：</span>
								<!-- <span v-if="data.riskList[0].amount / 10000 >= 1">{{data.riskList[0].amount/10000}}万元</span> -->
								<span>{{getCoverage}}万元</span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>收款方式：</span>
								<span class="ml5 text-right" v-if="!$route.query.typeYM">转账支付<span @click="payClick" style="color:#096dd9;cursor: pointer;margin-left:10px;">查看转账支付信息</span></span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span>是否代收：</span>
								<span style="color:#096dd9;">{{this.data.applicationType == '00' ? '非代收' : this.data.applicationType == '01' ? '代收' : '-' }}</span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="12"><div style="display: flex;">
								<span>保单形式：</span>
								<span class="text-right" v-if="data.policyKind==='00'">电子保单</span>
								<span class="text-right" v-if="data.policyKind!=='00'">纸质保单</span>
							</div></el-col>
							<el-col :span="12"><div style="display: flex;">
								<span v-if="data.policyKind==='00'">电子邮箱：</span>
								<span v-if="data.policyKind!=='00'">保单邮寄地址：</span>
								<span class="text-right" >{{policyAddress()}}</span>
							</div></el-col>
						</el-row>
						<el-row type="flex" class="row-bg" v-if="data.sequipNum != 1 && data.productCategory1 == 'yjsp'">
							<el-col :span="12"><div style="display: flex;">
								<span>设备/人员数量：</span>
								<span class="text-right">{{data.sequipNum-1}}</span>
								<span @click="relation(data)" v-has='"10091"' style="color:#096dd9;cursor: pointer;margin-left:10px;">查看清单</span>
							</div></el-col>
							<el-col :span="12">
								<div style="display: flex;">
									<span>业务类型：</span>
									<span class="text-right" v-if="data.ywType == '1'">线上出单</span><span v-else>线下业务</span><span v-if="data.ifSettlement">（<span class="col-blue">是，认领保单</span>）</span>
									<span style="margin-left:10px;" v-if="data.lrPerson">录入：{{data.lrPerson}}</span><span style="margin-left:10px;" v-if="data.shPerson">审核：{{data.shPerson}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row type="flex" class="row-bg" v-else-if=" data.productCategory1 == 'zy'">
							<el-col :span="12"><div style="display: flex;">
								<span>营业收入：</span>
								<span class="text-right">{{data.annualTurnover}}</span>万元
							</div></el-col>
							<el-col :span="12">
								<div style="display: flex;">
									<span>业务类型：</span>
									<span class="text-right" v-if="data.ywType == '1'">线上出单</span><span v-else>线下业务</span><span v-if="data.ifSettlement">（<span class="col-blue">是，认领保单</span>）</span>
									<span style="margin-left:10px;" v-if="data.lrPerson">录入：{{data.lrPerson}}</span><span style="margin-left:10px;" v-if="data.shPerson">审核：{{data.shPerson}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row type="flex" class="row-bg" v-else>
							<el-col :span="12"><div style="display: flex;">
								<span>设备/人员数量：</span>
								<span class="text-right">{{data.sequipNum}}</span>
								<span @click="relation(data)" v-has='"10091"' style="color:#096dd9;cursor: pointer;margin-left:10px;">查看清单</span>
							</div></el-col>
							<el-col :span="12">
								<div style="display: flex;">
									<span>业务类型：</span>
									<span class="text-right" v-if="data.ywType == '1'">线上出单</span><span v-else>线下业务</span><span v-if="data.ifSettlement">（<span class="col-blue">是，认领保单</span>）</span>
									<span style="margin-left:10px;" v-if="data.lrPerson">录入：{{data.lrPerson}}</span><span style="margin-left:10px;" v-if="data.shPerson">审核：{{data.shPerson}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="policy-content" style="padding:20px 30px 20px 50px;">
					<el-row>
						<el-col :span="6">
							<div class="sigle-content">
								<span class="sigle-title">{{data.sortName}}</span><br>
								<span class="sigle-name" :title="data.productName">{{data.productName}}</span>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="sigle-content">
								<span class="sigle-title">投保渠道</span><br>
								<span class="sigle-name">{{data.source ==  '00' ? '特设保' : data.source ==  '01' ? '电梯智保' : '-'}}</span>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="sigle-content">
								<span class="sigle-title">分支机构</span><br>
								<span class="sigle-name">{{data.branchName}}</span>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="sigle-content" v-if="data.agents && data.agents.length != 0">
								<span class="sigle-title">业务从业人员</span><br>
								<span class="sigle-name">{{data.agents[0].agentName}}({{data.agents[0].smsAgentCode}})</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<!-- 投保人和被保人 -->
				<div class="policy-content">
					<div class="policy-title">投保人/被保人信息</div>
					<div class="policy-con">
						<el-row type="flex" class="row-bg">
							<el-col :span="12">
								<div class="text-title">投保人</div>
								<p class="row-bg" style="display: flex;">
									<span >投保名称：</span>
									<el-tooltip v-if="holder.name && holder.name.length>=50"  effect="dark" :content="holder.name" placement="top-start">
										<span class="text-right">{{holder.name}}</span>
									</el-tooltip>
									<span v-if="holder.name && holder.name.length<50" class="text-right">{{holder.name}}</span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="holder.orgLocation">
									<span>企业地址：</span>
									<span class="text-right">{{holder.orgLocation}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span >联系人：</span>
									<span class="text-right">{{holder.linkPerson}}</span>
									<span class="ml10">联系电话：</span>
									<span class="text-right">{{holder.linkTel}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span >联系人地址：</span>
									<span class="text-right">{{holder.location}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span>电子邮箱：</span>
									<span class="text-right">{{holder.email}}</span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="holder.threeInOneCode">
									<span >统一社会信用代码：</span>
									<span class="text-right">{{holder.threeInOneCode}} <img v-if="holder.threeInOneImage" @click="imgLod(holder.threeInOneImage.fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""></span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="holder.organizationCode">
									<span >组织机构代码证：</span>
									<span class="text-right">{{holder.organizationCode}} <img v-if="holder.threeInOneImage" @click="imgLod(holder.threeInOneImage.fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""></span>
								</p>
								
								<p class="row-bg" style="display: flex;" v-if="holder.licenceNo">
									<span>身份证号码：</span>
									<span class="text-right">{{holder.licenceNo}}	<img @click="imgLod(data.holder.attachmentList[0].fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""><img @click="imgLod(data.holder.attachmentList[1].fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""></span>
								</p> 
							</el-col>
							<el-col :span="12" v-if="entityInfo !='' && data.productCategory1 != 'ty'">
								<div class="text-title">被保人</div>
								<p class="row-bg" style="display: flex;">
									<span></span>
									<span class="text-right">{{entityInfo}}</span>
								</p>
							</el-col>
							<el-col :span="12" v-if="entityInfo =='' && data.productCategory1 == 'ty'">
								<div class="text-title">被保人</div>
								<p class="row-bg" style="display: flex;">
									<span></span>
									<span class="text-right" v-if="!personNum">被保人见<span style="color: #1E90FF;text-decoration: underline;cursor: pointer; margin-left:10px;" @click="goToList">人员清单</span></span>
									<span v-if="personNum" class="text-right">被保人数：{{personNum}}</span>
								</p>
							</el-col>
							<el-col :span="12" v-if="entityInfo =='' && data.productCategory1 != 'ty'">
								<div class="text-title">被保人</div>
								<p class="row-bg" style="display: flex;">
									<span>被保名称：</span>
									<el-tooltip v-if="insured.name.length>=50"  effect="dark" :content="insured.name" placement="top-start">
										<span class="text-right">{{insured.name}}</span>
									</el-tooltip>
										<span class="text-right" v-if="insured.name.length<50" >{{insured.name}}</span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="insured.orgLocation">
									<span>企业地址：</span>
									<span class="text-right">{{insured.orgLocation}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span>联系人：</span>
									<span class="text-right">{{insured.linkPerson}}</span>
									<span class="ml5">联系电话：</span>
									<span class="text-right">{{insured.linkTel}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span>联系人地址：</span>
									<span class="text-right">{{insured.location}}</span>
								</p>
								<p class="row-bg" style="display: flex;">
									<span>电子邮箱：</span>
									<span class="text-right">{{insured.email}}</span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="insured.threeInOneCode">
									<span>统一社会信用代码：</span>
									<span class="text-right">{{insured.threeInOneCode}}	<img v-if="insured.threeInOneImage" @click="imgLod(insured.threeInOneImage.fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""></span>
								</p>
								<p class="row-bg" style="display: flex;" v-if="insured.organizationCode">
									<span>组织机构代码证：</span>
									<span class="text-right">{{insured.organizationCode}}	<img v-if="insured.threeInOneImage" @click="imgLod(insured.threeInOneImage.fileUrl)" class="mglet5" width="20" height="20"  src="../../../static/img/img-01.png" alt=""></span>
								</p>
							</el-col>
						</el-row>
						
					</div>
				</div>
				<!-- 发票信息 -->
				<div class="policy-content">
					<div class="policy-title">
						<span>发票信息</span>
					</div>
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<el-table :data="invoiceList" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="rowClass">
								<el-table-column  type="index" label="序号" align="center" width="100"></el-table-column>
								<el-table-column prop="invoiceTypes" label="发票类型" align="center"></el-table-column>
								<el-table-column prop="taxpayerName" label="发票抬头" align="center"></el-table-column>
								<el-table-column prop="taxpayerNo" label="纳税人识别号" align="center"></el-table-column>
								<el-table-column label="发票金额" align="center">
									<template slot-scope="scope">
										<span>{{scope.row.invoiceAmount}}</span>
									</template>
								</el-table-column>
								<el-table-column label="发票状态" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.status == '0'" style="color: #3574E8;">开票中</span>
										<span v-if="scope.row.status == '1'" style="color: #10AB2A;">开票成功</span>
										<span v-if="scope.row.status == '2'" style="color: #E51C23;">开票失败</span>
									</template>
								</el-table-column>
							</el-table>
							<div class="mt20" style="text-align: center;">
								<!-- <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination> -->
							</div>
						</el-col>
					</el-row>
				</div>
				<!-- 结束 -->
				<!-- 保障责任 -->
				<div class="policy-content" style="border-bottom: none;">
					<div class="policy-title">保障责任</div>
					<!-- <div class="policy-title">保障责任</div>
					<div class="policy-con">
						<el-row type="flex" class="row-bg">
							<el-col :span="2"><div style="display: flex;">
								<span>保险产品：</span>
							</div>
							</el-col>
							<el-col :span="21"><div style="display: flex;">
								<span >{{data.productName}}</span>
							</div>
							</el-col>
						</el-row>
						<el-row type="flex" class="row-bg">
							<el-col :span="2"><div style="display: flex;">
								<span>赔偿限额：</span>
							</div></el-col>
							<el-col :span="12">
								<p class="text-right" v-for="(item,index) in list" :key="index" style="display:flex;margin-bottom:10px;">
									<span >{{item.name}}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<span v-if="item.value/10000 >= 1" >{{item.value/10000}}万元</span>
									<span v-else-if="item.value/10000 < 1" >{{item.value}}元</span>
									<span v-else>{{item.value}}</span>
								</p>
							</el-col>
						</el-row>
					</div> -->
					<div class="content-tabel">
						<el-table :data="list" :span-method="objectSpanMethod" border style="width: 100%;" fit :header-cell-style="getRowClass">
							<el-table-column prop="riskName" label="险种"></el-table-column>
							<el-table-column prop="dutyName" label="责任"></el-table-column>
							<el-table-column prop="name" label="限额"></el-table-column>
							<el-table-column prop="showValue" label="限额值">
								<template slot-scope="scope">
									<span v-if="scope.row.showValue / 10000 >= 1">{{scope.row.showValue/10000}}万元</span>
									<span v-else>{{scope.row.showValue}}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<!-- <RevenueRecognition v-if="!settInfoFlag" :data="data"></RevenueRecognition> -->
				<!-- 合同信息 -->
				<div class="policy-content" style="border-bottom: none;" v-if="contractList.length != 0">
					<div class="policy-title">
						<span>合同信息</span>
					</div>
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<el-table :data="contractList" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass">
								<el-table-column prop="code" label="合同编码">
									<template slot-scope="scope">
										<span>{{ scope.row.code }} <span class="download-style" @click="downLodeConFile(scope.row)">下载</span></span>
									</template>
								</el-table-column>
								<el-table-column prop="renew" label="首签/续签"></el-table-column>
								<el-table-column prop="taxpayerName" label="客户名称">
									<template slot-scope="scope">
										<span>{{ scope.row.customerName }}({{ scope.row.customerCode }})</span>
									</template>
								</el-table-column>
								<el-table-column label="合同期间">
									<template slot-scope="scope">
										<span>{{ moment(new Date(scope.row.startTime)).format("YYYY-MM-DD")  }} 至 {{ moment(new Date(scope.row.endTime)).format("YYYY-MM-DD") }}</span>
									</template>
								</el-table-column>
							</el-table>
							<div class="mt20" style="text-align: center;">
								<!-- <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination> -->
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<!-- 批单记录 -->
			<div v-show="tabState == '2'">
				<PolicyDetailPD ref="policyDetailPD"  :data="data"></PolicyDetailPD>
			</div>
			<div v-show="tabState == '5'">
				<settInfo v-if="settInfoFlag" :policyDetail="data"></settInfo>
				<RevenueRecognition :data="data"></RevenueRecognition>
			</div>
			<!-- 投保轨迹 -->
			<div v-show="tabState == '3'">
				<PolicyDetailGJ ref="PolicyDetailGJ"  :data="data"></PolicyDetailGJ>
			</div>
			<!-- 操作日志 -->
			<div v-show="tabState == '4'">
				<PolicyLog ref="PolicyLog"  :data="data"></PolicyLog>
			</div>
			<!-- 证件图片 -->
			  <el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="imgUrl" alt="">
			</el-dialog>
			<!-- 转账支付信息 -->
			<el-dialog title="转账支付信息" :visible.sync="dialogPayVisible">
				<div>
				<div v-for="(item,index) in bringPayData" :key="index">
					<h4 class="lh40" style="width: 35%;text-align:center">{{item.payType}}</h4>
					<ul class="f16 lh30" style="width:80%;">
					<li>
						<span class="order-title mt10">收款人：</span>
						<span>{{item.bankAccountName}}</span>
					</li>
					<li>
						<span class="order-title mt10">帐 号：</span>
						<span>{{item.bankAccountNo}}</span>
					</li>
					<li>
						<span class="order-title mt10">开户行：</span>
						<span>{{item.bankName}}</span>
					</li>
					</ul>
				</div>
				
				</div>
			</el-dialog>
			<!-- 纸质保单收件人信息 -->
			<el-dialog title="收件人信息" :visible.sync="dialogVisiblePoliy">
				<div class="f16">
				<!-- <el-row >
					<el-col :span="10" :offset="2">
					<span class="div-title">联系名称：</span>
					<span >{{policyPersonName()}}</span>
					</el-col>
					<el-col :span="10" :offset="2">
					<span class="div-title">联系电话：</span>
					<span >{{policyPersonPhone()}}</span>
					</el-col>
				</el-row> -->
				<el-row class="mt10">
					<el-col :offset="2">
					<span class="div-title">收件人地址：</span>
					<span class="addre" >{{policyAddress()}}</span>
					
					</el-col>
				</el-row>
				</div>
			</el-dialog>
				
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import {elevator} from '../../server/accidenServer.js';
import ProductService from '../../service/ProductService.js';
import UserService from '../../service/UserService.js';
import ResourcesService from '../../service/ResourcesService';
import CorrectionManagement from '../../service/CorrectionManagement';
import RevenueRecognition from './components/RevenueRecognition'
import PolicyDetailPD from './components/policyDetailPD.vue'
import PolicyDetailGJ from './components/policyDetailGJ.vue'
import PolicyLog from './components/policyLog.vue'
import sortName from './data/productSort.json';
import ProductConfig from '../../service/ProductConfig.js';
import userService from '@/service/UserService.js';
import settInfo from './components/settInfo'

export default {
	data() {
		return {
			ProductService:new ProductService(),
			UserService:new UserService(),
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			CorrectionManagement: new CorrectionManagement(),
			ProductConfig:new ProductConfig(),
			userService:new userService(),
			dialogVisible:false,
			data:{
				agents:[],
				afterPrem:0
			},
			holder:{},
			insured:{},
			list:[],
			arr:[],
			lists:[],
			invoiceList:[],
			name:'',
			entityInfo:'',
			total:0,
			pageNum: 1,
			pageSize: 5,
			currentPage:1,
			pageSizes: 5,
			currentPages:1,
			totals:0,
			imgUrl:'',
			dialogVisiblePoliy: false,
			dialogPayVisible: false,
			bringPayData:[],
			list1:[],
			list2:[],
			list3:[],
			option:[
				{
					value:'01',
					label:'未生成结算凭证'
				},
				{
					value:'02',
					label:'初始化'
				},
				{
					value:'03',
					label:'成功（暂存）'
				},
				{
					value:'04',
					label:'成功（已提交）'
				},
				{
					value:'05',
					label:'成功（已审核）'
				},
				{
					value:'06',
					label:'失败'
				},
				{
					value:'07',
					label:'删除'
				}
			],
			option1:[
				{
					value:'1',
					label:'待结算'
				},
				{
					value:'2',
					label:'已开票'
				},
				{
					value:'3',
					label:'业务款项已确认'
				},
				{
					value:'4',
					label:'部分结算'
				},
				{
					value:'5',
					label:'已结算'
				},
				{
					value:'6',
					label:'业务确认打回'
				},
				{
					value:'7',
					label:'未生成结算单'
				}
			],
			daoQian: {},
			kuaQi: {},
			personNum:0,
			proofList:[
				{
					label:"委托协议签署流程延迟",
					value:"01"
				},
				{
					label:"框架协议/保险协议签署流程延迟",
					value:"02"
				},
				{
					label:"佣金比例确认延迟",
					value:"03"
				},
				{
					label:"保单/批单实际出具延迟",
					value:"04"
				},
				{
					label:"冲正调整重新确认数据",
					value:"05"
				},
				{
					label:"补录确认",
					value:"06"
				},
				{
					label:"承保清单提供延迟",
					value:"07"
				},
				{
					label:"其他",
					value:"08"
				},
				{
					label:"无法提供佐证原因",
					value:"12"
				},
			],
			issueList:[
				{
					label:"保险公司出具延迟",
					value:"01"
				},
				{
					label:"框架协议/保险协议签署流程延迟",
					value:"02"
				},
				{
					label:"先出暂保单后出正式保单",
					value:"03"
				},
				{
					label:"协议约定",
					value:"04"
				},
				{
					label:"其他",
					value:"05"
				},
			],
			contractList:[],
			moment:moment,
			options4:[
				{
					label:'订单信息',
					value:'1',	
				},
				{
					label:'业管结算信息',
					value:'5',	
				}
			],
			tabState:'1',
			equipment:{},  
			settInfoFlag:false
		}
	},
	computed:{
       getCoverage(){
		   let arr = this.data.riskList.map(item=>item.amount)
		   // 定义变量记录总和
			let total = 0;
			// 遍历数组，将数组中的每一项求和
			for (let i = 0; i < arr.length; i++) {
				total += arr[i];
			}
			// 返回总和
			return Math.round(total/ 10000 * 100) / 100 ;
	   },
	},
	mounted() {
		
	},
	created(){
		this.getSelectData();
		this.checkTab()
		this.getAppDetailPro();
	},
	components:{RevenueRecognition,PolicyDetailPD,PolicyDetailGJ,PolicyLog,settInfo},
	methods: {
		// 获取产品配置列表
		async getList(code){ 
			let form = {
				pageNum:1,
				pageSize:1,
				productCode:code
			}
			let res = await this.ProductConfig.getList(form);
			if(res.code == '0000'){
				if(res.list.length != 0) {
					this.data.ywType = res.list[0].businessType == 1 ? '1' : ''
				}
			}
		},
		//判断tab栏数据
		checkTab() {
			let data = JSON.parse(window.sessionStorage.getItem('navList'));
			console.log(data,'data')
			data.forEach(i => {
				if(i.subs) {
					if(i.subs.find(e => e.title == '批单') || i.subs.find(e => e.title == '批单管理')) {
						this.options4.push(
							{
								label:'批单记录',
								value:'2',	
							}
						)
					}
					i.subs.forEach(item => {
						if(item.sub) {
							if(item.sub.find(e => e.index == '/order/logs/track')) {
								this.options4.push(
									{
										label:'投保轨迹',
										value:'3',	
									}
								)
							}
							if(item.sub.find(e => e.index == '/logs/operation')) {
								this.options4.push(
									{
										label:'操作日志',
										value:'4',	
									}
								)
							}
						}
					})
				}
			})
		},
		//获取佐证原因字典表
		async getSelectData() {
			let rest = await this.Elevator.getSelectData();
			if(rest.code == '0000') {
				console.log(rest)
				this.proofList = rest.data.orgElementRelaValuesVMList;
			}
		},
		async downLodeFile(row) {
			let res = await this.ResourcesService.downloadOrViewFile(row.fileUrl,true)
		},
		//团意查看被保人
		goToList() {
			let routeData = this.$router.resolve({
				path:'/order/object/list',
				query:{
					appCode:this.data.applicationFormCode,
					index:'4',
				}
			})
			window.open(routeData.href, '_blank');
		},
		async imgLod(value){
			let dataImg1 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + value);
			this.dialogVisible = true;
			this.imgUrl = dataImg1.data;;
		},
		rowClass({row, column, rowIndex, columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
				return 'color:#0050b3;font-weight: 600;background-color:#e6f7ff;font-size:14px;text-align: center;';
            } else {
                return;
            }
		},
		ArowClass({row, column, rowIndex, columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
				return 'color:#0050b3;font-weight: 600;background-color:#e6f7ff;font-size:14px;text-align: center;';
            } else {
                return;
            }
		},
		// 获取发票详情(投保 中心)
		async checkinvoices(){
			const res = await this.ProductService.checkinvoices(this.$route.query.appCode);
				if(res.code == '0000'){
					if(res.data && res.data.title){
						let data = {
							taxpayerType:res.data.targetType=='00'?'2':'4',
							invoiceType:res.data.invoiceType=='00'?'0':(res.data.invoiceType=='02'?'1':'2'),
							invoiceTypes:"",
							taxpayerName:res.data.title,
							invoiceAmount:'以实际支付为准',
							taxpayerNo:res.data.taxpayerIdentificationNumber,
							vatAddress:res.data.taxpayerAddress,
							vatPhone:res.data.taxpayerTelephone,
							vatBank:res.data. openBankName,
							vatAccount:res.data.openBankNumber,
							contactAddress:res.data.mailAddress,
							contactName:res.data.linker,
							contactPhone:res.data.linkerPhone,
							contactEmail:res.data.invoiceType=='00'?res.data.mailAddress:'',
						}
						this.invoiceList.push(data);
						this.total = 1;
						this.invoiceList.forEach(item => {
							if(item.taxpayerType == '2'){
								item.taxpayerTypes = '个人'
							}else{
								item.taxpayerTypes = '企业/事业单位'
							}
							if(item.invoiceType == "0"){
								item.invoiceTypes = "增值税普通发票(电子)";
							}else if(item.invoiceType == "1"){
								item.invoiceTypes = "增值税普通发票(纸质)";
							}else{
								item.invoiceTypes = "增值税专用发票";
							}
						})
					}
				}
		},
		// 发票中心 查看发票接口
		async checkinvoice(userCode){ 
			let data = {
				userCode:userCode,
				pn:1,
				ps:100,
				oddNo:this.$route.query.appCode,
				type:'1'
			}
			const res = await this.Elevator.checkinvoices(data);
			
			if (res.code == "0000" ) {
				if(res.total){
					this.invoiceList = res.list;
					this.total = res.total;
					this.invoiceList.forEach(item => {
						if(item.taxpayerType == '2'){
							item.taxpayerTypes = '个人'
						}else{
							item.taxpayerTypes = '企业/事业单位'
						}
						if(item.invoiceType == "0"){
							item.invoiceTypes = "增值税普通发票(电子)";
						}else if(item.invoiceType == "1"){
							item.invoiceTypes = "增值税普通发票(纸质)";
						}else{
							item.invoiceTypes = "增值税专用发票";
						}
						item.invoiceAmount = this.$stringHelper.formatMoney(item.invoiceAmount) + '元';
					})
				}else{
					
					this.checkinvoices();
				}
			}
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#0050b3;font-weight: 600;background-color:#e6f7ff;";
			} else {
				return "";
			}
		},
		async getAppDetailPro(){ // 投保单详情
			let data = {
				'appCode':this.$route.query.appCode
			}
			const parmes = await this.Elevator.getAppDetailPro(data);
			if(parmes.code == '0000'){
				this.data = parmes.data;
				console.log(parmes.data,'parmes.data')
				if(!parmes.data.settlementDepartmentVOs || parmes.data.settlementDepartmentVOs.length<0){ // 有结算集合，进去判断删除tab展示
					this.settInfoFlag = false;
				} else {
					this.settInfoFlag = true;
				}
				this.data.sortName = sortName.dataProductCategory1.find(ele =>parmes.data.productCategory1 == ele.code) ? sortName.dataProductCategory1.find(ele =>parmes.data.productCategory1 == ele.code).name : '其他'
				this.data.sequipNum = parmes.data.insuredList[0].insuranceObjectCount
				let annualTurnover = parmes.data.extendList.find(item => item.key == 'S_A_000028');
				this.data.annualTurnover = annualTurnover ? (annualTurnover.value / 10000).toFixed(2) : '';
				if(this.data.orderStatus == '01'){
					this.data.orderStatusName = '待支付';
					this.data.orderStatusColor = '#48BDF0';
				}else if(this.data.orderStatus == '02'){
					this.data.orderStatusName = '部分付款';
					this.data.orderStatusColor = '#74b241';
				}else if(this.data.orderStatus == '03' || this.data.orderStatus == '04'){
					this.data.orderStatusName = '已支付';
					this.data.orderStatusColor = '#74b241';
				}else if(this.data.orderStatus == '08'){
					this.data.orderStatusName = '支付失败';
					this.data.orderStatusColor = '#181E2D';
				}else if(this.data.orderStatus == '09'){
					this.data.orderStatusName = '已取消';
					this.data.orderStatusColor = '#181E2D';
				};
				// if(parmes.data.policyNo) {
				// 	this.options4 = [
				// 		{
				// 			label:'订单信息',
				// 			value:'1',	
				// 		},
				// 		{
				// 			label:'批单记录',
				// 			value:'2',	
				// 		},
				// 		{
				// 			label:'投保轨迹',
				// 			value:'3',	
				// 		},
				// 		{
				// 			label:'操作日志',
				// 			value:'4',	
				// 		}
				// 	];
				// } else {
				// 	this.options4 = [
				// 		{
				// 			label:'订单信息',
				// 			value:'1',	
				// 		},
				// 		{
				// 			label:'投保轨迹',
				// 			value:'3',	
				// 		},
				// 		{
				// 			label:'操作日志',
				// 			value:'4',	
				// 		}
				// 	];
				// }
				this.data.ifSettlement = parmes.data.extendLimitedForProVO  &&  parmes.data.extendLimitedForProVO.fieldTwo == '1' ? true : false;
				this.getList(parmes.data.productCode);
				this.getHoledr()
				this.getInsured()
				this.getRisk()
				this.getReason()
				this.checkinvoice(parmes.data.holder.holderCode);
				this.getContract();
			}
		},
		//获取合同信息
		async getContract() {
			let code = this.data.extendList.find(item => item.key == 'S_A_000096');
			let customerName = this.data.extendList.find(item => item.key == 'S_A_000098');
			let customerCode = this.data.extendList.find(item => item.key == 'S_A_000097');
			let startTime = this.data.extendList.find(item => item.key == 'S_A_000100');
			let endTime = this.data.extendList.find(item => item.key == 'S_A_000101');
			let renew = this.data.extendList.find(item => item.key == 'S_A_000109');
			let lrPer = this.data.extendList.find(item => item.key == 'S_A_000119');
			let shPer = this.data.extendList.find(item => item.key == 'S_A_000120');
			this.data.lrPerson = lrPer ? lrPer.value : ''
			this.data.shPerson = shPer ? shPer.value : ''
			let obj = {
				code: code ? code.value:'',
				customerName: customerName ? customerName.value : '',
				customerCode: customerCode ? customerCode.value : '',
				startTime: startTime ? startTime.value : '',
				endTime: endTime ? endTime.value : '',
				renew: renew ? renew.value == 0 ? '首签' : renew.value == 1 ? "续签" : '--' :'--',//0-首签，1-续签
			}
			if(obj.code) {
				let params = {
					code: obj.code
				};
				let res = await this.Elevator.postConDetail(params);
				if(res.code =='0000') {
					obj.fileId = res.data.fileId;
					this.contractList[0] = obj;
				}
			}
		},
		//下载合同
		async downLodeConFile(row) {
			window.open(this.$apiUrl.POSTCONDOWNLOAD + row.fileId)
			// let res = await this.ResourcesService.exportFile(this.$apiUrl.POSTCONDOWNLOAD + row.fileId)
		},
		getReason() {
			let daoqian1 = this.data.extendList.find(item => item.key == 'S_A_000087') ? this.data.extendList.find(item => item.key == 'S_A_000087').value : '';
			this.daoQian = this.issueList.find(item => item.value == daoqian1) ? this.issueList.find(item => item.value == daoqian1).label : daoqian1;
			let reason = this.data.extendList.find(item => item.key == 'S_A_000089') ? this.data.extendList.find(item => item.key == 'S_A_000089').value : '';
			this.kuaQi = {
				time: this.data.extendList.find(item => item.key == 'S_A_000088') ? this.data.extendList.find(item => item.key == 'S_A_000088').value : '',
				reason: this.proofList.find(item => item.valuesCode == reason) ? this.proofList.find(item => item.valuesCode == reason).elementValues : reason,
				reasonQT: this.data.extendList.find(item => item.key == 'S_A_000091') ? this.data.extendList.find(item => item.key == 'S_A_000091').value : '',
				fileList:[]
			}
			this.data.polAttachmentList.forEach(item => {
				if(item.resCode == 'P010') {
					this.kuaQi.fileList.push(item);
				}
			})
		},
		async getCommission(){
			let data = {
				applicationFormCode:this.$route.query.appCode,
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getCommission(data);
			if(res.code == '0000' && res.list){
				res.list.forEach(item =>{
					this.option.forEach(item1 =>{
						if(item.voucherStatus == item1.value){
							item.voucherStatusName = item1.label;
						}
					})
				})
				this.list1 = res.list?res.list:[];
			}
		},
		async getSettlement(){
			let data = {
				policyNo:this.data.policyNo?this.data.policyNo:'',
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getSettlement(data);
			if(res.code == '0000' && res.list){
				res.list.forEach(item =>{
					this.option1.forEach(item1 =>{
						if(item.settlementStatus == item1.value){
							item.settlementStatusName = item1.label;
						}
					})
				})
				this.list2 = res.list?res.list:[]
			}
		},
		async getPayment(){
			let data = {
				policyNo:this.data.policyNo?this.data.policyNo:'',
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getPayment(data);
			if(res.code == '0000' && res.list){
				this.list3 = res.list?res.list:[]
			}
		},
		
		// 投保人信息
		async getHoledr(){
			this.holder = this.data.holder.corporation?this.data.holder.corporation:this.data.holder.human
			this.holder.threeInOneImage = this.data.holder.attachmentList.find(item=>item.resCode==='I001')
			this.holder.licenseImage = this.data.holder.attachmentList.find(item=>item.resCode==='I004')
			let industry = "";
			if(this.data.productCategory1 === 'ab') {
				this.holder.location = this.holder.location
				this.holder.orgLocation =	await this.getArea(this.holder.provinceCode,this.holder.cityCode,this.holder.countyCode,this.holder.address)
			} else if(this.data.productCategory1 == 'sd') {
				this.holder.location = this.holder.location;
				this.holder.orgLocation = this.data.holder.corporation.address;
			} else {
				this.holder.location = await this.getArea(this.holder.provinceCode,this.holder.cityCode,this.holder.countyCode,this.holder.location )
				this.holder.orgLocation = this.data.holder.corporation.address;
			}
		},
		// 被保人信息
		async getInsured(){
			if(this.data.insuredList.find(item => item.corporation)){
				this.insured=this.data.insuredList[0].corporation;
				if(this.data.productCategory1 === 'ab') {
					this.insured.orgLocation = await this.getArea(this.insured.provinceCode,this.insured.cityCode,this.insured.countyCode,this.insured.address)
					this.insured.location = this.insured.location;
				} else if(this.data.productCategory1 == 'sd') {
					this.insured.location = this.insured.location;
					this.insured.linkTel = this.insured.linkPhone
					this.insured.orgLocation = this.data.insuredList[0].corporation.address;
				} else {
					this.insured.location = await this.getArea(this.insured.provinceCode,this.insured.cityCode,this.insured.countyCode,this.insured.location, )
					this.insured.orgLocation = this.data.insuredList[0].corporation.address;
				}
			}else if(this.data.insuredList.find(item => item.human)){
				this.insured=this.data.insuredList[0].human;
				this.insured.location = await this.getArea(this.insured.provinceCode,this.insured.cityCode,this.insured.countyCode,this.insured.location )
			}else{
				this.entityInfo = this.data.insuredList.find(item => item.dummyEntity).dummyEntity.entityInfo;
			}
			if(this.data.productCategory1 == 'ty') {
				this.personNum = this.data.extendList.find(item => item.key == 'S_A_000015') ? this.data.extendList.find(item => item.key == 'S_A_000015').value : 0;
			}
		},
		// 设置限额责任
		getRisk(){
			this.data.riskList.forEach(item =>{
				item.dutyList.forEach(ele =>{
					ele.dutyLimits.forEach(items =>{
						let obj = {
							code:items.code,
							dutyCode:ele.dutyCode,
							dutyName:ele.dutyName,
							name:items.name,
							riskCode:item.riskCode,
							riskFlag:item.riskFlag2,
							riskName:item.riskName,
							showValue:items.value,
						};
						this.list.push(obj)
					})
				})
			})

		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			var beginIndex;
			var endIndex;
			for(var i=0;i<this.list.length;i++){
				var item = this.list[i];
				if(columnIndex == 0) {
					if(row.riskCode == item.riskCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
				if(columnIndex == 1) {
					if(row.riskCode == item.riskCode && row.dutyCode == item.dutyCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
			}
			if((beginIndex || beginIndex == 0) && (endIndex || endIndex == 0) &&  beginIndex == rowIndex) {
				var row = endIndex - beginIndex + 1;
				return { rowspan: row, colspan: 1 };
			}else if(!endIndex) {
				return { rowspan: 1, colspan: 1 };
			}else{
				return { rowspan: 0, colspan: 0 };
			}
		},
		// 获取地地区value
		async getArea(provinceCode,cityCode,countyCode,location){
			let res = await this.ProductService.getAreaCode(provinceCode,cityCode,countyCode);
			if(res){
				let lacations = res.list[0].name +'/'+ res.list[1].name +'/'+ res.list[2].name +'/'+ location
				return lacations
			}
		},
		
		//从业人员信息
		async getInsurance(){
			let data ={
				applicationFormCode:this.$route.query.appCode,
				pn:this.pageNum,
				ps:this.pageSize
			};
			let res = await this.ProductService.getInsurance(data);
			if(res.code == '0000'){
				this.arr=[]
				res.list.forEach(item =>{
					let ele = {
						name:item.objectName,
						type:item.extendsList.find(items => items.fieldCode == 'S_O_000048').fieldValues,
						code:item.extendsList.find(items => items.fieldCode == 'S_O_000049').fieldValues,
					};
					if(ele.type==='cardType_0'){
						ele.type = '中国居民身份证'
					}else if(ele.type==='cardType_11'){
						ele.type = '其他'
					}
					this.arr.push(ele)
				})
				this.total = res.total;
			}
		},
		statusName(){
			let curTime = moment(new Date()).format("YYYY-MM-DD")+" 00:00:00";
			let endTime =  moment(new Date()).format("YYYY-MM-DD");
			if(this.data){
				if((this.data.financeStatus == '01' ||this.data.financeStatus == '00') && this.data.issueStatus == 'N'&& curTime < this.data.endDate && this.data.pushStatus!=='02'){
					return "待支付"
					// return "待出单"
				} // 待出单
				if(this.data.pushStatus=='02' && this.data.issueStatus == 'N'){
					return "出单失败"
				}	// 出单失败
				if(this.data.issueStatus == 'Y' && curTime < this.data.startDate){
					return "已出单"
				}// 已出单
				if(this.data.issueStatus == 'Y' && curTime >= this.data.startDate && endTime < this.data.endDate && this.data.policyStatus == '00'){
					return "保障中"
				} // 保障中
				if(endTime > this.data.endDate){
					return "失效"
				}// 失效
			}else{
				return "无"
			}
		},
	
		handleCurrentChange: function(pageNum){ //页码
		    this.pageNum = pageNum;
			this.getInsurance();
		},
		
		handleCurrentChanges: function(pageNum){ //页码
		    this.pageNum = pageNum;
		},
		async DownloadPolicy(policyNo){ // 下载电子保单
			if(policyNo.productName.indexOf('线下录单') == -1) {
				if(policyNo.polAttachmentList.length==0){
					this.$message('暂无电子保单')
					return
				}
				let res = await this.ResourcesService.downloadOrViewFile(policyNo.polAttachmentList[0].fileUrl,true)
			} else {
				if(policyNo.appAttachmentList.length==0){
					this.$message('暂无电子保单')
					return
				}
				let res = await this.ResourcesService.downloadOrViewFile(policyNo.appAttachmentList[0].fileUrl,true)
			}
			
		

		},
		enable(row){

		},
		cloes(){
			window.location.href="about:blank";
			window.close();
		},
		companyName(){ // 保险公司
			let list = this.data && this.data.insuranceCompanyVOS ?this.data.insuranceCompanyVOS:[]
			let insuranceName =  list.find(item=>item.role2=='01')
			return insuranceName?insuranceName.name:'无'
		},
		dayNum(){ // 天数
			if(this.data && this.data.startDate && this.data.endDate){
				return this.$stringHelper.countDay(this.data.startDate, this.data.endDate);
			}else{
				return 0;
			}
		},
		issueDate(){ // 签单时间
			return this.data && this.data.issueDate?this.data.issueDate: '无';
		},
		// 查询支付信息
		async payClick(){
			let data = {
				'productCode':this.data.productCode,
				'channelNo':'sequip'
			}
			let res = await this.ProductService.getAccountInfo(data);
			if(res.code == '0000' && res.data){
				this.bringPayData = res.data.accountVoList 
				this.dialogPayVisible = true;
			} else {
				this.$message.warning('暂无转账支付信息！')
			}
		},
		getDetailsPolicy(num){	// 查看投保单
			let { href } = this.$router.resolve({
				path:'/policyTemplate',
				query:{
					"appCode":num
				}
			})
			window.open(href,"_blank" )
		},
		// 保单联系人名称
		policyPersonName(){
			if(this.data){
				if(this.data.extendList){
				return this.data.extendList.find(item=>item.key == 'S_A_000057')?this.data.extendList.find(item=>item.key == 'S_A_000057').value:'无';
				}else{
				return '无'
				}
			}else{
				return '无'
			}
		},
		// 保单联系人电话
		policyPersonPhone(){
			if(this.data){
				if(this.data.extendList){
				return this.data.extendList.find(item=>item.key == 'S_A_000058')?this.data.extendList.find(item=>item.key == 'S_A_000058').value:'无';
				}else{
				return '无'
				}
			}else{
				return '无'
			}
		},
		// 保单联系人地址 有可能是邮箱
		policyAddress(){
			if(this.data){
				if(this.data.policyKind == '01' && this.data.extendList && this.data.extendList.find(item=>item.key == 'S_A_000001')){
				return this.data.extendList.find(item=>item.key == 'S_A_000001').value;
				} else if(this.data.policyKind == '00' && this.data.extendList && this.data.extendList.find(item=>item.key == 'S_A_000010')){
				return this.data.extendList.find(item=>item.key == 'S_A_000010').value;
				}else{
				return '无'
				}
			}else{
				return '无'
			}
		},
		async relation(row){ //设备清单
			let sortPro = sortName.dataProductCategory1.find(subItem => subItem.code == row.productCategory1);
			let routeData = this.$router.resolve({
				path:'/order/object/list',
				query:{
					appCode:row.applicationFormCode,
					index:sortPro.index,
					applicationStatus:row.applicationStatus,
					productCode:row.productCode
				}
			})
			window.open(routeData.href, '_blank');
		},
		changeTab() {
			let name = this.tabState == '2' ? 'policyDetailPD' : this.tabState == '3' ? 'PolicyDetailGJ' : this.tabState == '4' ? 'PolicyLog' : '';
			if(name) {
				this.$refs[name].initData();
			}
		},
		
	},
}

</script>

<style lang="less">
#OrderDetails{
	width: 99%;
    margin: 15px;
	padding-bottom: 80px;
	.title{
		width: 98.5%;
		height: 40px;
		line-height: 40px;
		background-color: #fff;
		padding: 20px 10px;
		color: #535F7A;
		border-radius: 2px;
		font-size: 20px;
		position: relative;
		.download-policy{
			background-color: rgb(230, 247, 255);
			color: #096dd9;
			border-radius: 19px;
			display: block;
			width: 120px;
			height: 40px;
			border: 1px solid #096dd9;
			text-align: center;
			box-sizing: border-box;
			font-size: 16px;
			position: absolute;
			right:10px;
			top: 20px;
			cursor: pointer;
		}
		.order-content{
			margin-left: 40px;
			display: inline-block;
			width: 80%;
			height: 40px;
			line-height: 40px;
			color: #181E2D;
			font-size: 16px;
			span{
				margin-right: 40px;
			}
		}
	}
	.content{
		width: 100%;
		min-height: 1332px;
		margin-top: 10px;
		box-sizing: border-box;
		// background-color: #fff;
		border-radius: 14px;
		.state-style {
			background-color: #ffffff;
			height: 40px;
			font-size: 16px;
			.is-active {
				background: #1890ff;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #1890ff;
				border-left-color: #1890ff;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #1890ff;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 35px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
		}
		.bg-org {
			background-color: #fffaea;
			margin: 5px 5px 5px 0px;
			.kua-qi {
				padding: 20px 40px;
				.bold-title {
					color: #101010;
					font-weight: 600;
					display: inline-block;
					width: 80px;
				}
				.col-blue {
					color: #1890ff;
				}
				.cur-p {
					cursor: pointer;
				}
			}
			.border-top {
				border-top: 1px dotted #ccc;
			}
		}
		.policy-content{
			margin-top: 10px;
			background-color: #fff;
			border-radius: 2px;
			padding: 10px 20px 20px 20px;
			.download-style {
				text-decoration: underline;
				color: #1890ff;
				margin-left: 20px;
				cursor: pointer;
			}
			.sigle-content {
				display: inline-block;
				padding: 15px;
				min-width: 200px;
				border: 1px solid #d9d9d9;
				background-color: #f7f7f7;
				border-radius: 5px;
				.sigle-title {
					font-weight: 700;
					display: inline-block;
					margin-bottom: 10px;
					color: #101010;
				}
				.sigle-name {
					display: inline-block;
					overflow: hidden;/*超出部分隐藏*/
					text-overflow:ellipsis;/* 超出部分显示省略号 */
					white-space: nowrap;/*规定段落中的文本不进行换行 */
					width: 280px;
				}
			}
			.policy-title{
				width: 100%;
				box-sizing: border-box;
				line-height: 22px;
				height: 22px;
				margin: 20px 0 30px 0;
				color: #000000;
				font-size: 18px;
				font-weight: 700;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
			.policy-con{
				// padding-left: 24px;
				margin: 0 28px;
				.text-title{
					font-size: 16px;
					color: #000;
					font-weight: 700;
				}
			}
			.border-top{
				border-top:1px solid #ccc ;
			}
			.row-bg{
				margin-top:18px;
				.item3{
					display: block;
					width: 35%;
					padding-left: 50px;
					box-sizing: border-box;
				}
				.item4{
					display: block;
					width: calc(65% - 60px);
					vertical-align:middle;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;

				}
				
			}
			.personnel-list{
				width: 100%;
				min-height: 200px;
				padding: 24px;
				box-sizing: border-box;
				position: relative;
				// height: 50px;
				.content-total{
					width: 100%;
					text-align: right;
					position: absolute;
					bottom: 4px;
					right: 24px;
				}
			}
		}
		.policy-tit{
				width: 100%;
				box-sizing: border-box;
				line-height: 20px;
				height: 20px;
				margin: 40px 0;
				color: #000000;
				font-size: 14px;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
		.policyholder-content{
			width: 100%;
			display: flex;
			
			.holder-content{
				width: 50%;
				min-height: 352px;
				box-sizing: border-box;
				margin-top: 20px;
				font-size: 16px;
				color: #181E2D;
				.policy-title{
					width: 100%;
					height: 56px;
					background-color: #F1F4F9;
					border-bottom: 1px solid #D2D2D2;
					padding-left: 24px;
					box-sizing: border-box;
					line-height: 56px;
					color: #535F7A;
					font-size: 14px;
					span{
						float: right;
						margin-right: 16px;
					}
				}
				.row-bg{
					margin-top:18px;
					width: 100%;
					.item3{
						display: block;
						width: 35%;
						padding-left: 50px;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.item4{
						display: block;
						width: calc(65% - 60px);
						vertical-align:middle;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					
					.item5{
						width: calc(65% - 60px);
						.item6{
							display: block;
							width: 70%;
						}
						.item7{
							display: block;
							width: 27%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
				.personnel-list{
					width: 100%;
					min-height: 300px;
					padding: 24px;
					box-sizing: border-box;
					position: relative;
					.content-total{
						width: 100%;
						text-align: right;
						position: absolute;
						bottom: -24px;
						right: 24px;
					}
				}
			}
		}
		.closes{
			width: 100%;
			margin-top: 32px;
			text-align: center;
			span{
				display: inline-block;
				width: 120px;
				height: 48px;
				border: 1px solid #213593;
				text-align: center;
				line-height: 48px;
				font-size: 16px;
				color: #213593;
				border-radius:6px;
				box-sizing: border-box;
				cursor: pointer;
			}
		}
	}
	.income-information{
		width: 100%;
		height: 100%;
		padding: 20px;
		border: 1px solid #DEE1E8;
		box-sizing: border-box;
	}
	.income-informations{
		border: 1px solid #DEE1E8;
		box-sizing: border-box;
	}
	.income-title{
		width: 100%;
		line-height: 60px;
		color: #53A5FF;
		font-size: 16px;
	}
	.income-content{
		width: 100%;
		height: 100%;
		padding: 0 20px 20px;
		box-sizing: border-box;
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
	}
}
.mglet5{
	margin-left:5px;
	vertical-align:middle;
}
.text-right{
	color: #000;
}
</style>
