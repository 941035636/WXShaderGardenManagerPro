<template>
	<div class="caseListAccount" id="caseListAccount">
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
                <el-form-item label="报案人姓名：">
                    <el-input v-model.trim="from.reportUser" placeholder="请输入" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="报案人电话：">
                    <el-input v-model.trim="from.reportPhone" placeholder="请输入" maxlength="30"></el-input>
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
                <el-form-item label="登记人：">
                    <el-select v-model="from.enterUserName" placeholder="请选择" clearable>
                        <el-option v-for="item in enterUsers" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业/险种：">
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
                <el-form-item label="分支机构：">
                    <el-select v-model="from.serverOrganization" filterable placeholder="请选择" clearable>
						<el-option v-for="item in branchList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                <!-- <el-form-item label="案件类型：">
                    <el-select v-model="from.accidentType" placeholder="请选择" clearable>
                        <el-option v-for="item in accidentType" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-select v-model="from.timeTypes" placeholder="请选择" class="text-left-select">
                        <el-option label="出险时间" value="riskTime"></el-option>
                        <el-option label="报案时间" value="reportTime"></el-option>
                    </el-select>
                    <el-date-picker v-model="from.timeValueStart" type="date" class="w130" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
                    <span>至</span>
                    <el-date-picker v-model="from.timeValueEnd" type="date" class="w130" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
                </el-form-item>
                
                <el-form-item label="投保产品：" >
                    <el-select v-model="from.productName" filterable placeholder="请选择" clearable>
						<el-option v-for="(item,index) in products" :key="index" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                <!-- <el-form-item label="保险机构：" v-if="spread">
                    <el-select v-model="from.issueCompanyName" filterable placeholder="请选择" clearable>
						<el-option v-for="(item,index) in insuranceCompanyList" :key="index" :label="item" :value="item"></el-option>
					</el-select>
                </el-form-item>
                
                <el-form-item label="办理人：" v-if="spread">
                    <el-select v-model="from.serverName" placeholder="请选择" clearable>
                        <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item> -->
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
        <CaseTable ref="CaseTable" @setPageNum="setPageNum" @exports="exports"></CaseTable>
	</div>
</template>

<script>
import CaseServiceNew from '@/service/CaseServiceNew'
import CaseTable from "./components/CaseTableAccount";
export default {
    props:{},
    components:{
        CaseTable
    },
    computed:{
    },
	data() {
		return {
            // CaseServiceNew: new CaseServiceNew(),
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
                
            },
			optionsIndustryInfo:[], // 行业optins
			branchList:[],
			insuranceCompanyList:[],
			products:[],
			riskAreas:[],
			servers:[],
			industry:[],
			enterUsers:[],
		}
	},

	created(){
        this.initOptins()
	},
	methods: {
        // 初始
        initOptins(){
            this.getEnum()
            this.getCaseQueryConditionList()
            this.getCaseList()
        },
        async getEnum(){
            let sequipService = new CaseServiceNew()
            let {code,data} = await sequipService.getEnum()
            if(code === '0000') {
                this.getEbaoIndustry(data.industry)
            }
        },
        async getEbaoIndustry(industryData){
            let sequipService = new CaseServiceNew()
            let {code,data} = await sequipService.getEbaoIndustry()
            if(code === '0000') {
                this.industry = industryData.map(v1=>{
                    if(v1.key === 'EB') {
                        v1.child = data.map(item=>{
                            return {
                                key:item.productCategory,
                                value:item.productCategoryName,
                            }
                        })
                    }
                    return v1
                })
            }
        },
        // 获取列表反向加载数据
        async getCaseQueryConditionList(){
            let sequipService = new CaseServiceNew()
            let from = {
                type:'list'
            }
            let {code,data} = await sequipService.getCaseQueryConditionList(from)
            if(code === '0000') {
                let {branchList,insuranceCompanyList,products,riskAreas,servers,enterUsers} = data
                this.branchList = branchList
                this.insuranceCompanyList = insuranceCompanyList
                this.products = products
                this.riskAreas = riskAreas
                this.servers = servers
                this.enterUsers = enterUsers
            }
        },
        
        // 获取案件列表
        async getCaseList(){
            let sequipService = new CaseServiceNew()
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
                form.caseProgress = [101,201,301,401,402,403,404,405]
            }
            form.type = this.getType()
            delete form.timeTypes
            delete form.timeValueStart
            delete form.timeValueEnd
            delete form.reportNoType
            delete form.reportNoValue

            let {code,data} = await sequipService.getCaseAccountPage(form)
            if(code==='0000') {
                // this.$emit('setTable',data.list,data.total)
                let list = data.list.map(item=>{
                    return {
                        ...item,
                        ...item.caseInfo,
                        ...item.riskInfo,
                        ...item.policyInfoVo,
                        ...item.claimInfo,
                        ...item.endCaseInfo
                    }
                })
                this.$refs.CaseTable.setTable(list,data.total)
                if(list.length == 0){
                    this.$message.error('暂无数据')
                }
            }
        },
		searchview(){ //查询
            this.setPageNum(1)
            this.$refs.CaseTable.clearPage()
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
        async exports(){
            let sequipService = new CaseServiceNew()
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
                form.caseProgress = [101,201,301,401,402,403,404,405]
            }
            form.type = this.getType()
            delete form.timeTypes
            delete form.timeValueStart
            delete form.timeValueEnd
            delete form.reportNoType
            delete form.reportNoValue
            await sequipService.exportCaseAccount(form)
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
#caseListAccount {
    margin: 20px 20px 0;
    .w200 {
        width: 200px;
    }
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
