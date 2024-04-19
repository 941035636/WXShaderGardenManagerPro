import RidesService from '@/service/RidesService'
import CorrectionManagement from '@/service/CorrectionManagement'
import ProductService from '@/service/ProductService'
import CaseService from '@/service/CaseService.js';
import claim from '@/service/claim.js';
import {elevator} from '@/server/accidenServer.js';
import jiaZhengUserType from '../../static/data/jiaZhengUserType.json';
import caseSettleType from '../../static/data/caseSettleType.json';

export const CaseList = {
    data() {
      return {
        caseService: new CaseService(),
        claim: new claim(),
        Elevator:new elevator(),
        RidesService: new RidesService(),
        CorrectionManagement:new CorrectionManagement(),
        ProductService: new ProductService(),
        showBranch:true, // 是否是总部账号
        userTypeList:[], // 家政用户类型
      }
    },
    created(){
      this.policyStatu();
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
      /**
       * 获取案件状态字典表，
       * @param {*} code 代表从什么地方调用
       */
      async getDist(code) {
        let res = await this.caseService.getDist();
        if(res.code == '0000') {
          let reportStatus = []
          if(code === 'pending') {
            // 待关联保单，待受理，处理中
            reportStatus = res.data.reportStatus.filter((item)=> item.value=='00' ||item.value=='02' || item.value=='03' || item.value=='04');
            reportStatus.unshift({
              "value":"00,02,03,04",
              "label":"全部"
            })
          } else if (code === 'closed') {
            reportStatus = res.data.reportStatus.filter((item)=> item.value=='05' || item.value=='06');
            reportStatus.unshift({
              "value":"05,06",
              "label":"全部"
            })
          } else {
            reportStatus = res.data.reportStatus
            reportStatus.unshift({
              "value":"all",
              "label":"全部"
            })
          }
          this.reportStatus = reportStatus
          this.$store.commit('updataCsaeDictionaries',res.data);
          await this.caseList();
        }
      },
      // 获取案件列表
      async caseList(){
        this.formInline.pn = this.pageNum;
        if(this.regionCoding.length == 1){
          this.formInline.provinceCode = this.regionCoding[0];
          this.formInline.cityCode = "";
          this.formInline.areaCode = "";
        }else if(this.regionCoding.length == 2){
          this.formInline.provinceCode = this.regionCoding[0];
          this.formInline.cityCode = this.regionCoding[1];
          this.formInline.areaCode = "";
        }else if(this.regionCoding.length == 3){
          this.formInline.provinceCode = this.regionCoding[0];
          this.formInline.cityCode = this.regionCoding[1];
          this.formInline.areaCode = this.regionCoding[2];
        }else{
          this.formInline.provinceCode = "";
          this.formInline.cityCode = "";
          this.formInline.areaCode = "";
        }
        let form = JSON.parse(JSON.stringify(this.formInline))
        form.reportStatusList = form.reportStatusList == 'all' ? '' : form.reportStatusList
        let res = await this.caseService.getCaseList(form);
        if(res.code == '0000'){
          let promiseAll = []
          let dataCaseList = res.list.map(item=>{
            let reportStatusName = this.reportStatus.find(v1=>v1.value == item.reportStatus)
            let branchName = this.branchList.find(v2=>v2.jtBranchCode == item.branchCode)
            let riskTypName = caseSettleType.riskTypeList.find(v1=>v1.code == item.riskType)
            item.reportPhone = item.reportPhone ? this.$stringHelper.changePhone(item.reportPhone):''
            item.reportStatusName =  reportStatusName?reportStatusName.label:'无'
            item.branchName = branchName ? branchName.jtBranchName : '无'
            item.riskTypName = riskTypName ? riskTypName.name : ''
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
          });
          Promise.all(promiseAll).then(()=>{
            this.dataCaseList = dataCaseList
          }).catch((error)=>{
            console.log(error);
          })
          this.total = res.total;
        }
      },
    }
      
}