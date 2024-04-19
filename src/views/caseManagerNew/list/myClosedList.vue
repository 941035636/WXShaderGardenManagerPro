<template>
	<div class="caseList" id="caseList">
		<CaseSerch ref="CaseSerch" :allCaseStatus="['301','401','402','403','404','405']" @setTable="setTable" @getCaseStatusCnt="getCaseStatusCnt" @clearStatus="clearStatus" @clearPage="clearPage"></CaseSerch>
        <div class="mt10 f16 status-but">
            <span class="ml20">状态：</span>
            <div>
                <el-button :type="caseProgress ==item.value ? 'warning' : ''" size="medium" round v-for="(item,index) in productCategory" :key="index" class="mr10 w80" @click="setCaseProgress(item.value)">{{item.label}}</el-button>
            </div>
            <div class="case-status-button2">
                <el-button :type="caseProgress ==item.value ? 'warning' : ''" size="medium" round v-for="(item,index) in productCategory2" :key="index" class="mr10 w80" @click="setCaseProgress(item.value)">{{item.label}}({{item.total}} 起)</el-button>
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
            caseProgress:'301,401,402,403,404,405',
            productCategory:[{
                value:'301,401,402,403,404,405',
                label:'全部',
            },{
                value:'301',
                label:'待审核',
            }],
            productCategory2:[{
                value:'401',
                label:'赔付结案',
                key:'settlement',
                total:'0'
            },{
                value:'404',
                label:'拒赔',
                key:'refuseSettlement',
                total:'0'
            },{
                value:'403',
                label:'销案',
                key:'cancelEnd',
                total:'0'
            },{
                value:'405',
                label:'零结',
                key:'zeroPay',
                total:'0'
            },{
                value:'402',
                label:'无效结案',
                key:'invalid',
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
                this.productCategory2.forEach((item)=>{
                    item.total = data[item.key]
                })
            }
        },
        // 案件进程
        setCaseProgress(value,isRef=true){
            this.caseProgress = value
            let obj = {
                caseProgress:value
            }
            if(isRef){
                this.$refs.CaseSerch.setCaseProgress(obj)
            }
        },
		setTable(data,total){
            this.$refs.CaseTable.setTable(data,total)
        },
        // 清除状态
        clearStatus(){
            this.setCaseProgress('301,401,402,403,404',false)
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
#caseList {
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
        .case-status-button2 {
            .w80 {
                min-width: 80px;
                border: 1px solid #1890FF;
                color:#1890FF;
            }
            .el-button--warning {
                background-color: #cde3f7;
            }
            .el-button:hover {
                background-color: #cde3f7;
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
