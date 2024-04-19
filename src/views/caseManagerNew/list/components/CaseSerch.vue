<template>
	<div class="CaseSerch" id="CaseSerch">
		<div class="elesearch">
            <el-form :inline="true" :model="from" class="demo-form-inline" size="small">
                <el-form-item>
                    <el-select v-model="from.reportNoType" placeholder="请选择" class="text-left-select">
                        <el-option label="报案号" value="reportNo"></el-option>
                        <el-option label="保司报案号" value="inscompReportNo"></el-option>
                    </el-select>
                     <el-input v-model.trim="from.reportNoValue" placeholder="请输入" class="w200" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="投保人：">
                    <el-input v-model.trim="from.insuredCompany" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="保单号：">
                    <el-input v-model.trim="from.policyNo" placeholder="请输入" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="from.targetParam.targetType" placeholder="请选择" class="text-left-select">
                        <el-option label="人员证件号" value="人员证件号"></el-option>
                        <el-option label="索道名称" value="索道名称"></el-option>
                        <el-option label="设备代码" value="设备代码"></el-option>
                        <el-option label="物业项目名称" value="物业项目名称"></el-option>
                    </el-select>
                     <el-input v-model.trim="from.targetParam.targetId" placeholder="请输入" class="w200"></el-input>
                </el-form-item>
                <el-form-item label="出险地区：">
                    <el-cascader
                        :options="riskAreas"
                        :props="{
                            label: 'area',
                            value: 'area',
                            children: 'child',
                        }"
                        placeholder="请选择" 
                        change-on-select
                        v-model="from.insuredMunicipalDistrict"
                        clearable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="案件类型：">
                    <el-select v-model="from.accidentType" placeholder="请选择" clearable>
                        <el-option v-for="item in accidentType" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="from.timeTypes" placeholder="请选择" class="text-left-select">
                        <el-option label="出险时间" value="riskTime"></el-option>
                        <el-option label="报案时间" value="reportTime"></el-option>
                    </el-select>
                    <el-date-picker v-model="from.timeValueStart" type="date" class="w130" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
                    <span>至</span>
                    <el-date-picker v-model="from.timeValueEnd" type="date" class="w130" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
                </el-form-item>
                <el-form-item label="行业/险种：" v-if="spread">
                    <el-cascader
                        :options="industry"
                        :props="{
                            label: 'value',
                            value: 'value',
                            children: 'child',
                        }"
                        placeholder="请选择"
                        change-on-select
                        v-model="from.industry"
                        clearable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="投保产品：" v-if="spread">
                    <el-select v-model="from.productName" filterable placeholder="请选择" clearable>
						<el-option v-for="(item,index) in products" :key="index" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="保险机构：" v-if="spread">
                    <el-select v-model="from.issueCompanyName" filterable placeholder="请选择" clearable>
						<el-option v-for="(item,index) in insuranceCompanyList" :key="index" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="分支机构：" v-if="spread">
                    <el-select v-model="from.serverOrganization" filterable placeholder="请选择" clearable>
						<el-option v-for="item in branchList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="办理人：" v-if="isCaseListView && spread">
                    <el-select v-model="from.serverName" placeholder="请选择" clearable>
                        <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="赔付方式：" v-if="isCaseListView && spread">
                    <el-select v-model="from.subType" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in subTypeOption" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="clear">清空筛选条件</el-button>
                    <el-button type="warning" @click="searchview" round>查询</el-button>
                    <el-button
                        v-if="!spread"
                        class="color-355E92"
                        type="text"
                        @click="spread = true"
                    >
                        展开
                        <i class="el-icon-arrow-up" />
                    </el-button>
                    <el-button
                        v-if="spread"
                        class="color-355E92"
                        type="text"
                        @click="spread = false"
                        >
                        收起
                        <i class="el-icon-arrow-down" />
                    </el-button>
                </el-form-item>
            </el-form>
		</div>
	</div>
</template>

<script>
import CaseServiceNew from '@/service/CaseServiceNew'
import claim from '@/service/claim.js';
import {elevator} from '@/server/accidenServer.js';
import bus from '@/components/common/bus'
import {mapGetters,mapMutations,mapActions} from 'vuex';

export default {
    props:{
        allCaseStatus:{
            type:Array | Object,
        }
    },
    components:{
    },
    computed:{
        ...mapGetters({
            accidentType:'accidentType',
            industry:'industry',
        }),
        isCaseListView(){
            let flag;
            switch (this.$route.path) {
                case '/case/new/list':
                    flag = true
                    break;
                default:
                    flag = false
                    break;
            }
            return flag
        },
    },
	data() {
		return {
            CaseServiceNew: new CaseServiceNew(),
            claim: new claim(),
            spread:false,
			from:{
                reportNoType:'reportNo',   // 报案号类型
                "reportNoValue": "", // 报案号value
                "reportNo": "", // 报案号
                "inscompReportNo ": "", // 保司报案号
                "accidentType": "", // 案件类型
                "insuredCompany": "", // 投保人
                "policyNo": "", // 保单号
                "insuredMunicipalDistrict": [], // 出险地区
                timeTypes:'riskTime',  // 时间类型
                timeValueStart:'',  // 开始时间value
                timeValueEnd:'',  // 结束时间value
                "reportTimeEnd": "",
                "reportTimeStart": "",
                "riskTimeStart": "",
                "risktTimeEnd": "",
                "industry": "", // 所属行业
                "productName": "",
                "issueCompanyName": "",
                "serverOrganization": "",   // 服务机构
                "serverName": "",
                "targetParam": {
                    "targetId": "",
                    "targetType": "人员证件号"
                },
                "caseProgress": [],
                "page": 1,
                "pageSize": 10,
                "platform": "",
                "serverDepartment": "",
                "subType":""
            },
			optionsArea:[], // 地区optins
			optionsIndustryInfo:[], // 行业optins
			branchList:[],
			insuranceCompanyList:[],
			products:[],
			riskAreas:[],
			servers:[],
			subTypeOption:[
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '100',
                    label: '常规赔付'
                },
                {
                    value: '200',
                    label: '小额快赔'
                },
            ],
		}
	},

	created(){
        this.initOptins()
	},
	methods: {
        ...mapActions([
            'getCaseEnumV2',
            'getEbaoIndustry',
        ]),
        // 初始
        initOptins(){
            this.getCaseEnumV2()
            this.getEbaoIndustry()
            this.getCaseQueryConditionList()
            this.getArea()
            this.getCaseList()
        },
        // 获取行业数据
        getIndustryInfo(){
            let {code,data} = this.CaseServiceNew.getIndustryInfo()
            if(code === '0000') {}
        },
        // 获取列表反向加载数据
        async getCaseQueryConditionList(){
            let from = {
                type:this.getType()
            }
            let {code,data} = await this.CaseServiceNew.getCaseQueryConditionList(from)
            if(code === '0000') {
                let {branchList,insuranceCompanyList,products,riskAreas,servers} = data
                this.branchList = branchList
                this.insuranceCompanyList = insuranceCompanyList
                this.products = products
                this.riskAreas = riskAreas
                this.servers = servers
            }
        },
        async getArea(){ //获取地区
            let Elevator = new elevator()
			let {code,data} = await Elevator.getAreas();
			if(code == '0000'){
				this.optionsArea = data;
				// this.setArea();
			};
		},
        // 获取案件列表
        async getCaseList(){
            let form = {...this.from,targetParam:{...this.from.targetParam}}
            form.insuredMunicipalDistrict = form.insuredMunicipalDistrict.join('/')
            // 报案号类型
            if(form.reportNoType){
                form[form.reportNoType] = form.reportNoValue
            }
            // 报案号类型
            if(form.timeTypes){
                form[form.timeTypes+'Start'] = form.timeValueStart
                form[form.timeTypes+'End'] = form.timeValueEnd
            }
            if(this.from.industry.length !==0){
                form.industry = this.from.industry[0]
                form.productCategory = this.from.industry[1] || ''
            } else {
                form.industry = ''
                form.productCategory = ''
            }
            // 案件状态
            if(form.caseProgress.length == 0){
                form.caseProgress = [...this.allCaseStatus]
            }
            form.type = this.getType()
            delete form.timeTypes
            delete form.timeValueStart
            delete form.timeValueEnd
            delete form.reportNoType
            delete form.reportNoValue

            let {code,data} = await this.CaseServiceNew.getCaseList(form)
            if(code==='0000') {
                let promiseAll = []
                let list = data.list.map(item=>{
                    // 会存在案件号没有的问题
                    if(item.caseNo && item.reportNo){
                        let resut = this.claim.queryCaseDockingByCaseNo({caseNo:item.caseNo,reportNo:item.reportNo}).then(res=>{
                            if(res.code==='0000' && res.data  && res.data.caseDocking.isCloseCase == '0') {
                                item.isPushInsuranceFlag = true
                                item.pushInsuranceDetails = {...res.data.caseDocking,'baosiJiangtaiAssociationId':res.data.baosiJiangtaiAssociation.id}
                            } else {
                                item.isPushInsuranceFlag = false
                                item.pushInsuranceDetails = {}
                            }
                        })
                        promiseAll.push(resut)
                    } else {
                        item.isPushInsuranceFlag = false
                    }
                    return item
                })
                Promise.all(promiseAll).then(()=>{
                    this.$emit('setTable',list,data.total)
                    this.$emit('getCaseStatusCnt',form)
                }).catch((error)=>{
                    console.log(error);
                })
                
            }
        },
		searchview(){ //查询
            this.setPageNum(1)
		},
        // 案件进程状态和案件状态
		setCaseProgress(v){ //查询
            this.from.caseProgress = v.caseProgress.split(',')
            this.from.caseStatus = v.caseStatus
            this.setPageNum(1)
		},
        setPageNum(page){
            this.from.page = page
            this.getCaseList();
        },
        // 清空
		clear(){ 
			this.from = {
                reportNoType:'reportNo',   // 报案号类型
                "reportNoValue": "", // 报案号value
                "reportNo": "", // 报案号
                "inscompReportNo ": "", // 保司报案号
                "accidentType": "", // 案件类型
                "insuredCompany": "", // 投保人
                "policyNo": "", // 保单号
                "insuredMunicipalDistrict": [], // 出险地区
                timeTypes:'riskTime',  // 时间类型
                timeValueStart:'',  // 开始时间value
                timeValueEnd:'',  // 结束时间value
                "reportTimeEnd": "",
                "reportTimeStart": "",
                "riskTimeStart": "",
                "risktTimeEnd": "",
                "industry": "", // 所属行业
                "productName": "",
                "issueCompanyName": "",
                "serverOrganization": "",   // 服务机构
                "serverName": "",
                "targetParam": {
                    "targetId": "",
                    "targetType": "人员证件号"
                },
                "caseProgress": [],
                "page": 1,
                "pageSize": 10,
                "platform": "",
                "serverDepartment": "",
            }
            this.$emit('clearStatus')
            this.$emit('clearPage')
		},
        // 案件接口好几个地方需要获取这个type
        getType(){
            let type = 'list'
            switch (this.$route.path) {
                case '/case/new/list':
                    type = 'list'
                    break;
                case '/case/new/my/list':
                    type = 'server'
                    break;
                case '/case/new/my/closed':
                    type = 'exam'
                    break;
                default:
                    type = 'list'
                    break;
            }
            return type
        },
		
	},
}
</script>

<style lang="less">
#CaseSerch {
	.el-form-item {
		margin-bottom: 10px;
	}
	.elesearch{
		box-sizing: border-box;
		background-color: #f2f1ef;
		overflow: hidden;
		padding: 20px;
		background-color: #fff;
        .text-left-select{
            width: 120px;
            margin-right: 10px;
            input {
                text-align: left;
                border: none;
                font-size: 14px;
                min-width:110px;
            }
            .el-select__caret {
                color: #000000;
                font-weight: 700;
            }
        }
	}
}
</style>
