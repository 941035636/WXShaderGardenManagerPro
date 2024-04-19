<template>
	<div class="CaseListTable" id="CaseListTable">
      <el-table :data="tableData" border :header-cell-style="getRowClass">
        <el-table-column label="报案时间/报案人" width="180">
          <template slot-scope="scope">
            <div>
              {{scope.row.reportTime}}
            </div>
            <div>
              <p>{{scope.row.reportName}}({{scope.row.reportPhone}})</p> 
            </div>
          </template>
        </el-table-column>
        <el-table-column label="事故信息">
          <template slot-scope="scope">
            <div>
              报案号：<span class="color-blue">{{scope.row.reportNo}}</span> 
            </div>
            <div>
              出险地点：{{(scope.row.provinceName?scope.row.provinceName:'') + (scope.row.cityName?' / ' + scope.row.cityName:'') + (scope.row.areaName?' / ' + scope.row.areaName:'')}}
            </div>
            <div>
              出险时间：{{scope.row.riskTime}}
            </div>
            <div>
                <span class="riskTypeBox">{{scope.row.riskTypName}}</span>
                <span class="caseTypeBox">{{scope.row.caseType}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="保单信息">
          <template slot-scope="scope">
            <div v-if="!scope.row.policyNo && fatherComponents === 'casePending'">
						<p class="con-p " style="color:#FA8C16">
							<span class="btn-link" style="display: inline-block;padding: 1px 20px;border: 1px solid #FA8C16;border-radius: 20px;cursor:pointer" @click="insurancePolicy(scope.row)">关联保单</span>
						</p>
					</div>
					<div v-if="scope.row.policyNo">
						<p style="font-weight:600;color:#000">{{scope.row.holderName}}</p>
						<p><span>保单号：{{scope.row.policyNo}}</span>  <span class="btn-link" style="color:#1890FF" @click="accessPolicyDetails(scope.row)">查看</span> </p>
						<p>{{scope.row.productName}}</p>
					</div>
          </template>
        </el-table-column>
        <el-table-column label="服务人员" width="180">
          <template slot-scope="scope">
						<p>{{scope.row.servicerName}}</p> 
						<p>{{scope.row.branchName}}</p> 
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
			<p v-if="scope.row.isPushInsuranceFlag">
				<i class="el-icon-success" style="color:#52C41A;font-size:16px"></i>
			</p>
            <p style="color:#1890FF">{{scope.row.reportStatusName}}	</p> 
			<p v-if="scope.row.substate == '1'" style="color:#f5222d"><span >  (中止)</span></p> 
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <p class="btn-link con-p" style="color:#FA8C16" v-if="(scope.row.reportStatus != '06' && scope.row.reportStatus != '07') && scope.row.policyNo &&  dataJurisdiction.find(item2 => item2.key == '40002') && (fatherComponents=='casePending'||fatherComponents=='caseClosed')" @click="optionWrite(scope.row,'/caseDetail')">立即处理</p>
            <p class="btn-link con-p" style="color:#FA8C16" @click="optionWrite(scope.row,'/caseDteailDisable')">查看详情</p>
          </template>
        </el-table-column>
      </el-table>
      <RelationPolicy ref="RelationPolicy" @successCallback="successCallback"></RelationPolicy>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import ResourcesService from '@/service/ResourcesService.js';
import CaseService from '@/service/CaseService.js';
import RelationPolicy from './RelationPolicy'
import claim from '@/service/claim.js';
import store from '@/store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
  components:{
    RelationPolicy
  },
  props:{
    tableData:{
      type:Array,
      default:()=>{
        return []
      }
    },
    // 调用的父组件名臣
    fatherComponents:{
      type:String,
      default:()=>{
        return ''
      }
    },
  },
	data() {
		return {
			claim: new claim(),
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			caseService: new CaseService(),
			dataJurisdiction:[],  // 按钮权限数据
		}
	},
  store,
	computed:{
    ...mapGetters([
        "csaeDictionaries",
    ]),
  },
	created(){
    this.getButtonData()
	},
	methods: {
    getButtonData() {
      this.dataJurisdiction = JSON.parse(window.sessionStorage.getItem('list'));
    },
    // 设置table样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;color:#000'
      } else {
        return ''
      }
    },
    // 打开关联保单弹出框
		insurancePolicy(val){
			console.log(JSON.stringify(val));
      this.$refs.RelationPolicy.openInit(val)
		},
    // 电子保单
		async accessPolicyDetails(row){
			let data = {
				"bizCodeType": "01",
				"policyNo":row.policyNo,
				"resCode": "A002"
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
    // 跳转处理页面
		async optionWrite(row,url) {
			row.PathUrl = url
			if(row.reportStatus == '00' && url == '/caseDetail'){
				this.$message({
					message: '请先联系客服指定服务人员',
					type: 'warning'
				});
				return;
			} else if(row.reportStatus == '02'){
				let res = await this.caseService.casefwryrl(row.caseNo);
				if(res.code == '0000'){
					if(row.riskType == 'dt'){
						this.getCaseDetail(this.csaeDictionaries.elevator.caseType,row);
					}else if(row.riskType == 'sd'){
						this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
					}else if(row.riskType == 'wy'){
						this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
					}else{
						this.getCaseDetail(this.csaeDictionaries.employer.caseType,row);
					}
					this.successCallback()
				}
			} else {
				if(row.riskType == 'dt'){
					this.getCaseDetail(this.csaeDictionaries.elevator.caseType,row);
				}else if(row.riskType == 'sd'){
					this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
				}else if(row.riskType == 'wy'){
					this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
				}else{
					this.getCaseDetail(this.csaeDictionaries.employer.caseType,row);
				}
			}
		},
    // 获取案件详情
		async getCaseDetail(caseType,row){
			let res = await this.caseService.getCaseDetail(row.reportNo);
			if(res.code == '0000') {
				let pushInsuranceData = {
					pushInsuranceDetails:row.pushInsuranceDetails,	// 认领的详情
					isPushInsuranceFlag:row.isPushInsuranceFlag, // 认领的标识 ture认领 false 未认领
				}
				this.$store.commit('updatePushInsurance',pushInsuranceData)
				let caseOverInfo = {
					closingReviewList : res.data.closingReviewList,
					settlementList : res.data.settlementList,
					reportNo : res.data.reportNo,
					reportStatus : res.data.reportStatus,
					acceptionList : res.data.acceptionList,
					baseInfo : res.data.reportInfo, 
					auditAndApplyVOList : res.data.auditAndApplyVOList,
				}
				this.$store.commit('updateBaseInfo',caseOverInfo);
				if(res.data.reportInfo && res.data.reportInfo.pauseType) {
					let caseStopInfo = {
						typeName : this.csaeDictionaries.pauseType.find(item => item.value == res.data.reportInfo.pauseType).label,
						startTime : res.data.reportInfo.pauseTime,
						specificReasons : res.data.reportInfo.reason,
						pauseApplyId: res.data.reportInfo.pauseApplyId,
						flag: true
					}
					this.$store.commit('updataCaseStopInfo',caseStopInfo);
				}
				caseType.find(item => {
                    if(item.value == res.data.reportInfo.caseType){
                        res.data.reportInfo.caseTypeName = item.label;
                    }
				})
				let makemoneys = {
					"paymentDate":res.data.reportInfo.paymentDate,
					"paymentTime":res.data.reportInfo.paymentTime,
				}
				this.$store.commit('updataMakemoneys',makemoneys);
				this.$store.commit('updataCaseOverInfo',res.data.reportInfo);
				this.$store.commit('updataReportStatus',res.data.reportInfo.reportStatus);
				this.$store.commit('updataCaseReview',res.data.revisitList);
				let accidentAndCasualty = res.data.accidentAndCasualty.caseInfoVO;
				accidentAndCasualty.insuredInfoList = res.data.accidentAndCasualty.insuredInfoList?res.data.accidentAndCasualty.insuredInfoList:[];
				this.$store.commit('updataCaseProcess',accidentAndCasualty);
				this.$store.commit('updataPayInfo',res.data.lossDetail);
				let accountInfo = {
                    "bankCardAccount": "",
                    "cardBank": "",
                    "id": "",
                    "payeeName": "",
                    "reportNo": this.$route.query.reportNo
                };
				this.$store.commit('updataAccountInfo',res.data.account?res.data.account:accountInfo);
				if(res.data.litigationList.length){
					this.$store.commit('updataLitigationInfo',res.data.litigationList[0]);
				}else{
					let litigationList = {
						litigationResult:"",
						litigationMoney:"",
						otherContent:"",
						litigationTime:"",
						id:"",
						reportNo: this.$route.query.reportNo,
						caseNo: this.$route.query.caseNo
					};
					this.$store.commit('updataLitigationInfo',litigationList);
				}
				if(res.data.caseTrackList && res.data.caseTrackList.length) {
					this.$store.commit('updataCaseTrackList',res.data.caseTrackList);
				} else {
					this.$store.commit('updataCaseTrackList',[]);
				}
				let routeData = this.$router.resolve({
					path:row.PathUrl,
					query:{
						reportNo:row.reportNo,
						caseNo:row.caseNo,
						caseId:row.caseId,
						productCategory1:row.riskType,
						holderName:row.holderName,
					}
				})
				window.open(routeData.href, '_blank');
			}
		},
    successCallback(){
      this.$emit('successCallback')
    }
	},
}
</script>

<style lang="less">
#CaseListTable {
  margin: 20px 6px;
	min-height: 1000px;
	box-sizing: border-box;
  .riskTypeBox {
    display: inline-block;
    background-color: #40A9FF;
    padding: 0px 20px;
    border-radius: 14px;
    color: #fff;
  }
  .caseTypeBox {
    display: inline-block;
    margin-right: 20px;
    background-color: #FFA940;
    padding: 0px 20px;
    border-radius: 14px;
    color: #fff;
  }
  .btn-link{
    cursor:pointer;
  }
}
</style>
