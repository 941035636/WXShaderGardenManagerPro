import CaseServiceNew from '@/service/CaseServiceNew'

export const CaseList = {
    data() {
      return {
        CaseServiceNew:new CaseServiceNew(),
        showBranch:true,
        formInline:{
            orderBy:'reportTime',
            desc:true,
            reportNo:null,
            policyNo:null,
            holderName:null,
            riskType:null,
            productCode:null,
            reportStatus:null,
            provinceCode:null,
            cityCode:null,
            areaCode:null,
            nameOrCodeOrId:null,
            startReportTime:null,
            endReportTime: null,
            startRiskTime: null,
            endRiskTime: null,
            pn:1,
            ps:10,
            substate: null,
            reportStatusList:'0,101,201',
            timeTypes: '2', // 时间类型标识
        },
      }
    },
    created(){
      this.policyStatu();
    //   this.getCaseList()
    },
    methods:{
        // 根据权限获取配置文件,获取产品
        policyStatu(){ 
            this.userTypeList = jiaZhengUserType.userTypeList
            if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
            this.showBranch = true;
            }else{
            this.showBranch = false;
            }
        },
        // 获取案件列表
        async getCaseList(){
            let {code,data} = await this.CaseServiceNew.getCaseList({})
        },
      
    }
      
}