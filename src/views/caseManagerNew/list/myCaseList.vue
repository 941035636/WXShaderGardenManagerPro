<template>
	<div class="myCaseList" id="myCaseList">
		<CaseSerch ref="CaseSerch" :allCaseStatus="['101','201']" @setTable="setTable" @getCaseStatusCnt="getCaseStatusCnt" @clearStatus="clearStatus" @clearPage="clearPage"></CaseSerch>
        <div class="mt10 f16 status-but">
            <span class="ml20">状态：</span>
            <div>
                <el-button :type="statusButton ==item.value ? 'warning' : ''" size="medium" round v-for="(item,index) in productCategory" :key="index" class="mr10 w80" @click="setCaseProgress(item)">{{item.label}}</el-button>
            </div>
            <div class="case-status-button">
                <el-button :type="statusButton ==item.value ? 'warning' : ''" size="medium" round v-for="(item,index) in caseStatusOptins" :key="index" class="mr10 w80" @click="setCaseProgress(item)">{{item.label}}({{item.total}} 起)</el-button>
            </div>
        </div>
        <CaseTable ref="CaseTable" @setPageNum="setPageNum"></CaseTable>
        <CaseDetails></CaseDetails>
	</div>
</template>

<script>
import CaseDetails from '../details/index'
import CaseSerch from './components/CaseSerch'
import CaseTable from './components/CaseTable'
import CaseServiceNew from '@/service/CaseServiceNew'
export default {
    components:{
        CaseDetails,
        CaseSerch,
        CaseTable,
    },
	data() {
		return {
            caseProgress:'101,201',
            caseStatus:'0',
            statusButton:'1',
            productCategory:[{
                caseProgress:'101,201',
                caseStatus:'',
                value:'1',
                label:'全部',
            },{
                caseProgress:'101',
                caseStatus:'',
                value:'2',
                label:'待处理',
            },{
                caseProgress:'201',
                caseStatus:'',
                value:'3',
                label:'处理中',
            }],
            caseStatusOptins:[{
                caseProgress:'0,101,201',
                caseStatus:'1',
                value:'4',
                label:'中止',
                key:'paused',
                total:'0'
            },{
                caseProgress:'0,101,201',
                caseStatus:'2',
                value:'5',
                label:'驳回',
                key:'refuse',
                total:'0'
            }]
		}
	},

	created(){
	},
	methods: {
        // 获取案件状态统计
        async getCaseStatusCnt(form){
            let caseServiceNew = new CaseServiceNew()
            let {code,data} = await caseServiceNew.getCaseStatusCnt(form)
            if(code === '0000') {
                this.caseStatusOptins.forEach((item)=>{
                    item.total = data[item.key]
                })
            }
        },
        // 案件进程
        setCaseProgress(item,isRef=true){
            this.statusButton = item.value
            this.caseProgress = item.caseProgress
            this.caseStatus = item.caseStatus
            if(isRef){
                this.$refs.CaseSerch.setCaseProgress(item)
            }
        },
        
		setTable(data,total){
            this.$refs.CaseTable.setTable(data,total)
            
        },
        // 清除状态
        clearStatus(){
            this.setCaseProgress({
                caseProgress:'0,101,201',
                caseStatus:'',
                value:'1',
                label:'全部',
            },false)
        },
        // 初始话配置
        clearPage(){
            this.$refs.CaseTable.clearPage()
        },
		setPageNum(pageNum){
            this.$refs.CaseSerch.setPageNum(pageNum)
		},
	},
}
</script>

<style lang="less">
#myCaseList {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
    margin: 20px 20px 0;
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
    .status-but {
        margin-bottom: 10px;
        display: flex;
        .w80 {
			min-width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
        .el-button--warning {
			background-color: #ffe7ba;
		}
		
		.el-button:hover {
			background-color: #ffe7ba;
		}
        .case-status-button {
            .w80 {
                min-width: 80px;
                border: 1px solid #F5222D;
                color:#F5222D;
            }
            .el-button--warning {
                background-color: #f78c91;
            }
            .el-button:hover {
                background-color: #f78c91;
            }
        }
    }
    .content-table {
        padding: 20px 20px;
        background-color: #fff;
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
    .content-total {
        margin-top: 10px;
        text-align: right;
    }
    
}
</style>
