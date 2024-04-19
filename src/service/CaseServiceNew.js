// 创建 CaseService 服务类
import apiUrl from '@/api/apiUrl'
import ResourcesService from './ResourcesService'
import { post, get, patch, put, deletes } from '@/api/index'
export default class CaseService extends ResourcesService {
    // 案件字典
    getEnum() {
        return get(apiUrl.CASE_ENUM_V2).then(res => {
            return res;
        })
    }
    // 案件受理
    acceptCase(form) {
        return post(`${apiUrl.ACCEPT_CASE_V2}`,form).then(res => {
            return res;
        })
    }
    // 撤销案件中止
    cancelPauseStatus(form) {
        return post(apiUrl.CANCEL_PAUSE_STATUS_V2, form).then(res => {
            return res;
        })
    }
    // 案件列表
    getCaseList(form) {
        return post(apiUrl.CASES_PAGE_V2, form).then(res => {
            return res;
        })
    }
    // 附件删除
    deleteFileInfo(form) {
        return get(apiUrl.DELETE_FILE_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 出险人信息删除
    deleteInsuredInfo(form) {
        return post(apiUrl.DELETE_INSURED_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 结案申请
    endCaseApply(form) {
        return post(apiUrl.END_CASE_APPLY_V2, form).then(res => {
            return res;
        })
    }
    // 结案信息填写(新增及修改)
    endCaseInfoSave(form) {
        return post(apiUrl.END_CASE_INFO_SAVE_V2, form).then(res => {
            return res;
        })
    }
    // 案件审批
    examCase(form) {
        return post(apiUrl.EXAM_CASE_V2, form).then(res => {
            return res;
        })
    }
    // 附件信息上传
    fileInfoUpload(form) {
        return post(apiUrl.FILE_INFO_UPLOAD_V2, form).then(res => {
            return res;
        })
    }
    // 附件信息上传(多文件)
    fileListInfoUpload(form) {
        return post(apiUrl.FILE_LIST_INFO_UPLOAD_V2, form).then(res => {
            return res;
        })
    }
    // 案件详情
    getCaseInfo(form) {
        return get(apiUrl.GET_CASE_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 行业信息获取
    getIndustryInfo() {
        return post(apiUrl.GET_INDUSTRY_INFO_V2,).then(res => {
            return res;
        })
    }
    // 保单信息获取
    getPolicyInfo(form) {
        return post(apiUrl.GET_POLICY_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 案件中止
    pauseCase(form) {
        return post(apiUrl.PAUSE_CASE_V2, form).then(res => {
            return res;
        })
    }
    // 保单信息填写(新增及修改)
    policyInfoSave(form) {
        return post(apiUrl.POLICY_INFO_SAVE_V2, form).then(res => {
            return res;
        })
    }
    // 险种查询
    policySearch(form) {
        return post(apiUrl.POLICY_SEARCH_V2, form).then(res => {
            return res;
        })
    }
    // 出险信息填写(新增及修改
    riskInfoSave(form) {
        return post(apiUrl.RISK_INFO_SAVE_V2, form).then(res => {
            return res;
        })
    }
    // 索赔信息填写(新增及修改)
    saveClaimInfo(form) {
        return post(apiUrl.SAVE_CLAIM_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 出险人信息保存
    saveInsuredInfo(form) {
        return post(apiUrl.SAVE_INSURED_INFO_V2, form).then(res => {
            return res;
        })
    }
    // 设备标的列表查询
    getElevatorList(form) {
        return post(apiUrl.GET_ELEVATOR_LIST_V2, form).then(res => {
            return res;
        })
    }
    // 人员标的列表查询
    getEmployeeList(form) {
        return post(apiUrl.GET_EMPLOYEE_LIST_V2, form).then(res => {
            return res;
        })
    }
    // 物业标的列表查询
    getPropertyList(form) {
        return post(apiUrl.GET_PROPERTY_LIST_V2, form).then(res => {
            return res;
        })
    }
    // 标的信息填写(新增及修改
    targetInfoSave(form) {
        return post(apiUrl.TARGET_INFO_SAVE_V2, form).then(res => {
            return res;
        })
    }
    // 状态统计
    getCaseStatusCnt(data) {
        return post(`${apiUrl.STATU_SCNT_V2}`,data).then(res => {
            return res;
        })
    }
    // 获取审核人员数据
    getCustomerByJt(data) {
        return get(apiUrl.customerUrl, data).then(res => {
            return res;
        })
    }
    // 获取列表反向加载
    getCaseQueryConditionList(data) {
        return get(apiUrl.GET_CASE_QUERY_CONDITION_LIST_V2,data).then(res => {
            return res;
        })
    }
    // 获取E保行业
    getEbaoIndustry(data) {
        return get(apiUrl.EBAO_INDUSTRY_V2,).then(res => {
            return res;
        })
    }
    // 案件拜访
    postVisitCreate(data) {
        return post(apiUrl.VISIT_CREATE_V2,data).then(res => {
            return res;
        })
    }
    // 获取服务器时间
    getTime(data) {
        return get(apiUrl.GET_TIME).then(res => {
            return res;
        })
    }
     /**
     * 索道标的查询接口
     * @param {*} data 
     * @returns 
     */
      getCablewayList (data) { 
		return post(apiUrl.GET_CABLEWAY_LIST_V2,data).then(res => {
            return res;
        })
	}
    /**
     * 商铺标的查询接口
     * @param {*} data 
     * @returns 
     */
     getShopList (data) { 
		return post(apiUrl.GET_SHOP_LIST_V2,data).then(res => {
            return res;
        })
	}
    /**
       * 获取案件列表
       * @param {*} data 
       * @returns 
       */
     getCaseAccountPage(data) {
        return post(apiUrl.CASE_ACCOUNT_PAGE_V2,data).then(res => {
            return res;
            })
    }
    /**
       * 导出案件列表
       * @param {*} data 
       * @returns 
       */
     exportCaseAccount(data) {
        return post(apiUrl.EXPORT_CASE_ACCOUNT_V2,data,{'responseType': 'blob'},true).then(res => {
           
            try{
                let fileName = this.getFileName(res.headers['content-disposition']);
                let href = this.getObjectURL(res.data);
                this.downLoadA(href, fileName);
                return res
            }catch(error){
            //   reject(error);
            }
          }).catch( error=>{
            // reject(error)
          })
            // return res;
    }
    /**
     * 案件提交接口
     * @param {*} data 
     * @returns 
     */
	caseCommit(data) {
        return post(apiUrl.REPORT_CASE_400_COMMIT_V2,data).then(res => {
            return res;
        })
	}
    /**
     * 案件转移接口
     * @param {*} data 
     * @returns 
     */
    transforServicor(data) {
        return post(apiUrl.TRANSFER_CASE_V2,data).then(res => {
            return res;
        })
	}
    /**
     * 文件下载
     * @param {*} data 
     * @returns 
     */
    fileZipDownload(data) {
        return post(apiUrl.FILE_ZIP_DOWNLOAD,data,{'responseType': 'blob'},true).then(res => {
        
        try{
            let fileName = this.getFileName(res.headers['content-disposition']);
            let href = this.getObjectURL(res.data);
            this.downLoadA(href, fileName);
            return res
        }catch(error){
        //   reject(error);
        }
        }).catch( error=>{
        // reject(error)
        })
        // return res;
    }
    /**
     * 案件报告
     * @param {*} data 
     * @returns 
     */
    downLoadEndCaseeoport(data) {
        return post(apiUrl.ENDCASEREPORT_CASE_V2+data,{},{'responseType': 'blob'},true).then(res => {
        
        try{
            let fileName = this.getFileName(res.headers['content-disposition']);
            let href = this.getObjectURL(res.data);
            this.downLoadA(href, fileName);
            return res
        }catch(error){
        //   reject(error);
        }
        }).catch( error=>{
        // reject(error)
        })
        // return res;
    }
}