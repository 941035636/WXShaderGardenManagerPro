<template>
    <div style="padding: 0 20px 0 20px;">
        <div class="titleClass">
            <div>{{ productItem.name + '（' + productItem.code + '）' + '/' + inusureCompanyItem.name}}</div>
            <div>操作人：{{ (basicData.creator || '--') + ' 于 ' +  (basicData.updateTime || '--') }}</div>
        </div>
        <div class="hintClass">
            <div class="iconClass"><i class="el-icon-warning-outline"></i></div>
            <div>请为“主承公司”配置案件资料信息</div>
        </div>
        <DatumNewly ref="datumNewly" :currentTime="basicData.updateTime" @triggerClick="createProductConfig"/>
    </div>
</template>
<script>
import dateService from "@/service/dateService.js";
import CaseService from '@/service/CaseService.js';
import DatumNewly from '../../components/datumNewly.vue';

export default {
    components:{
        DatumNewly
    },
    data() {
        return {
            dateSer: new dateService(),
            caseService: new CaseService(),
            inusureCompanyItem:{},
            productItem:{},
            currentTime:'',
            departmentCode:'',
            departmentName:'',
            basicData:{},
        }
    },
    computed:{
       
	},
    created() {},
	mounted() {
        this.productItem = JSON.parse(this.$route.query.paramsata).productItem;
        this.inusureCompanyItem = JSON.parse(this.$route.query.paramsata).inusureCompanyItem;
        if(JSON.parse(this.$route.query.paramsata).basicData){
            this.basicData =  JSON.parse(this.$route.query.paramsata).basicData;
        };
        this.getSelectByEmployeeNum();
    },
	methods: {
        //获取当前用户信息接口
        async getSelectByEmployeeNum() {
            let params = {
                userCode: window.sessionStorage.getItem("userCode"),
            };
            let res = await this.caseService.selectByEmployeeNum(params)
            if (res.code === '0000') {
                this.departmentCode = res.data.departmentCode;
                this.departmentName = res.data.departmentName;
            }
        },
        //获取当前时间
        // async getNewData(){ 
        //     let {data} = await this.dateSer.getDate();
        //     if(data.code == '0000'){
        //         this.currentTime = data.data;
        //     }
        // },
        //新增接口
        async createProductConfig (e,explain,key,id){
            let data = {
                branch:window.sessionStorage.getItem("branchName"),//创建人机构
                branchCode:window.sessionStorage.getItem("branchCode"),//创建人机构编码
                // caseType:'',//案件类型
                // createTime:'',//创建时间

                creator:window.sessionStorage.getItem("userName"),//创建人
                creatorCode: window.sessionStorage.getItem("userCode"),//创建人编码

                dept:this.departmentName,//创建人部门
                deptCode:this.departmentCode,//创建人部门编码
                // endTime:'',//停用时间
                // examine:'',//审核人
                // examineCode:'',//审核人编码
                items:e,
                id:id ? id : '',
                insuranceCode:this.inusureCompanyItem.code,//出单公司编码
                insuranceName:this.inusureCompanyItem.name,//出单公司名称 
                // order:'',//排序
                productCode:this.productItem.code,//产品编码 
                productName:this.productItem.name,//产品名
                // shortCode:'',//短编码
                // startTime:'',//启用时间
                status:key == '0' ? '100' : '200',//状态
                statusName:key == '0' ? '待发布' : '有更新',//列表状态名
                // updateTime:'',//修改时间
                // useTimes:'',//使用次数
                // version:''//版本
                remark:explain,//描述
            };
            let res = await this.caseService.createProductConfig(data);
            if(res.code === '0000'){
                if(key == '0'){
                    // this.backtrackList();
                    this.assignmentID(res.data);
                }else if(key == '1'){
                    this.$router.push({
                        path: '/case/result',
                    })
                }
                 
            }
        },
        assignmentID(id){
            this.$refs.datumNewly.assignmentID(id);
        },
        backtrackList(){
            this.$router.push({
                path:'/case/datum/list',
            })
        },
    }
}
</script>
<style lang="less" scoped>
.titleClass{
    font-size: 16px;
    background-color: #fff;
    padding: 0 58px 0 58px;
    height: 77px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.hintClass{
    background-color: #FEFFE6;
    height: 67px;
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding-left:58px;
    color: #FA8C16;
    font-size: 18px;
    font-weight: bold;
    .iconClass{
        font-size: 30px;
        margin-right: 26px;
    }
}
</style>