// 创建 CaseService 服务类
import apiUrl from '@/api/apiUrl'
import { post, get, patch, put, deletes } from '@/api/index'
export default class CaseService {
    //地区查询
    getAreas() {
            return get(apiUrl.getArea).then(res => {
                return res;
            })
        }
        // 案件字典
    getDictionaries() {
            return get(apiUrl.CASE_DICTIONARIES + '?channelNo=sequip').then(res => {
                return res;
            })
        }
        // 根据条件查询案件列表
    getCaseList(form) {
            return get(apiUrl.CASE_LIST, form).then(res => {
                return res;
            })
        }
        // 根据案件id查询案件详情
    getCaseDetail(reportNo = '') {
            return get(apiUrl.CASE_DETAIL + '/' + reportNo).then(res => {
                return res;
            })
        }
        // 案件受理
    postAcception(form) {
            return post(apiUrl.CASE_ACCEPT, form).then(res => {
                return res;
            })
        }
        //案件回访列表查询
    searchRevisit(reportNo = '') {
            return get(apiUrl.CASE_REVISIT, { "reportNo": reportNo }).then(res => {
                return res;
            })
        }
        //案件回访增加
    addRevisit(form) {
            return post(apiUrl.CASE_REVISIT, form).then(res => {
                return res;
            })
        }
        //案件回访修改
    editRevisit(form) {
            return put(apiUrl.CASE_REVISIT, form).then(res => {
                return res;
            })
        }
        //案件回访删除
    delRevisit(id,reportNo) {
            return deletes(apiUrl.CASE_REVISIT + '/' + id + '/' + reportNo, { "id": id,"reportNo":reportNo }).then(res => {
                return res;
            })
        }
        //结案申请
    caseApplyOver(form) {
            return post(apiUrl.CASE_APPLYOVER, form).then(res => {
                return res;
            })
        }
        //结案审核
    caseAuditOver(form) {
            return post(apiUrl.CASE_AUDITOVER, form).then(res => {
                return res;
            })
        }
        //查询文件信息
    cateFilequery(reportNo) {
            return get(apiUrl.CASE_FILEQUERY + '?channel=sequip' + '&reportNo=' + reportNo).then(res => {
                return res;
            })
        }
        //保存文件信息
    cateFileprese(data) {
            return post(apiUrl.CASE_FILEPRESE, data).then(res => {
                return res;
            })
        }
        //删除文件信息
    cateFiledelete(resId,reportNo) {
            return deletes(apiUrl.CASE_FILEDELETE + '?channel=sequip' + '&resId=' + resId + '&reportNo=' + reportNo).then(res => {
                return res;
            })
        }
        //管理端报案信息修改
    cateModifyinfo(data) {
            return post(apiUrl.CASE_MODIFYINFO, data).then(res => {
                return res;
            })
        }
        //获取字典表
    getDist() {
            return get(apiUrl.CASE_DIST, { "channelNo": "sequip" }).then(res => {
                return res;
            })
        }
        //查询案件经过
    searchAccInfo(reportNo = '') {
            return get(apiUrl.CASE_SAVEADDINFO, { "reportNo": reportNo }).then(res => {
                return res;
            })
        }
        //保存案件经过
    saveAccInfo(form) {
            return post(apiUrl.CASE_SAVEADDINFO, form).then(res => {
                return res;
            })
        }
        //收款账户列表查询
    searchAccount(reportNo = '') {
            return get(apiUrl.CASE_ACCOUNT + '/' + reportNo).then(res => {
                return res;
            })
        }
        //收款账户增加
    addAccount(form) {
            return post(apiUrl.CASE_ACCOUNT, form).then(res => {
                return res;
            })
        }
        //收款账户修改
    editAccount(form) {
            return put(apiUrl.CASE_ACCOUNT, form).then(res => {
                return res;
            })
        }
        //收款账户删除
    delAccount(id) {
            return deletes(apiUrl.CASE_ACCOUNT + '/' + id, { "id": id }).then(res => {
                return res;
            })
        }
        //诉讼信息列表查询
    searchLitigation(reportNo = '') {
            return get(apiUrl.CASE_LITIGATION, { "reportNo": reportNo }).then(res => {
                return res;
            })
        }
        //诉讼信息增加
    addLitigation(form) {
            return post(apiUrl.CASE_LITIGATION, form).then(res => {
                return res;
            })
        }
        //诉讼信息修改
        // editLitigation(form) {
        //     return put(apiUrl.CASE_LITIGATION,form).then(res=>{
        //         return res;
        //     })
        // }
        //诉讼信息删除
    delLitigation(id) {
            return deletes(apiUrl.CASE_LITIGATION + '/' + id, { "id": id }).then(res => {
                return res;
            })
        }
        //编辑打款到账时间
    editPayment(form) {
            return post(apiUrl.CASE_PAYMENT, form).then(res => {
                return res;
            })
        }
        //删除打款到账时间
    delPayment(reportNo) {
            return deletes(apiUrl.CASE_PAYMENT + '/' + reportNo).then(res => {
                return res;
            })
        }
        //诉讼信息列表查询
    searchPayInfo(reportNo = '') {
            return get(apiUrl.CASE_PAYINFO, { "reportNo": reportNo }).then(res => {
                return res;
            })
        }
        //诉讼信息增加
    addPayInfoPF(form) {
            return post(apiUrl.CASE_PAYINFO, form).then(res => {
                return res;
            })
        }
        //索赔信息增加
        addPayInfoSP(form) {
            return post(apiUrl.CASE_PAYINFO_SUOPEI, form).then(res => {
                return res;
            })
        }
        //删除索赔信息
    delSource(reportNo) {
            return deletes(apiUrl.CASE_PAYINFO + '/' + reportNo).then(res => {
                return res;
            })
        }
        //服务人员认领案件
    casefwryrl(caseNo) {
            return post(apiUrl.CASE_FWRYRL + '?caseNo=' + caseNo).then(res => {
                return res;
            })
        }
        //4服务人员受理案件
    casesl(caseNo) {
            return post(apiUrl.CASE_SL + '?caseNo=' + caseNo).then(res => {
                return res;
            })
        }
        //5服务人员处理案件，进行案件信息录入。指定结案审核人
    casetjsl(caseNo) {
        return post(apiUrl.CASE_TJSH + '?caseNo=' + caseNo).then(res => {
            return res;
        })
    }
    overFlow(caseNo) {
        return post(apiUrl.CASE_TJJA + '?caseNo=' + caseNo).then(res => {
            return res;
        })
    }

    getCustomerByJt(data) {
        return get(apiUrl.customerUrl, data).then(res => {
            return res;
        })
    }
    deletesgl(id) {
        return deletes(apiUrl.CASE_DELETESGL + id).then(res => {
            return res;
        })
    }

    getcasesjlist(data) {
        return post(apiUrl.CASE_SJLIST,data).then(res => {
            return res;
        })
    }

    searchAppList(data) {//投保单列表数据接口
        return post(apiUrl.searchAppList,data).then(res => {
            return res;
        })
    }

    getInsurance(applicationFormCode,productCategory1) {//投保单号查询电梯
        return get(apiUrl.getInsurance + "?applicationFormCode=" + applicationFormCode).then(res => {
            if (res.code === '0000') {
                let data = [];
                if(res.list){
                    res.list.forEach(item => {
                        let ele = {
                            value: item.extendsList.find(item => item.fieldCode == 'S_O_000013') ? (item.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues ? item.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues : item.extendsList.find(item => item.fieldCode == 'S_O_000012').fieldValues) : '',
                            label: item.extendsList.find(item => item.fieldCode == 'S_O_000013') ? (item.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues ? item.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues : item.extendsList.find(item => item.fieldCode == 'S_O_000012').fieldValues) : '',
                            elevatorSeatAddress: item.extendsList.find(item => item.fieldCode == 'S_O_000017') ? item.extendsList.find(item => item.fieldCode == 'S_O_000017').fieldValues : '',
                            riskProvinceCode: item.extendsList.find(item => item.fieldCode == 'S_O_000066') ? item.extendsList.find(item => item.fieldCode == 'S_O_000066').fieldValues : '',
                            riskProvinceName: item.extendsList.find(item => item.fieldCode == 'S_O_000069') ? item.extendsList.find(item => item.fieldCode == 'S_O_000069').fieldValues : '',
                            riskCityCode: item.extendsList.find(item => item.fieldCode == 'S_O_000067') ? item.extendsList.find(item => item.fieldCode == 'S_O_000067').fieldValues : '',
                            riskCityName: item.extendsList.find(item => item.fieldCode == 'S_O_000070') ? item.extendsList.find(item => item.fieldCode == 'S_O_000070').fieldValues : '',
                            riskAreaCode: item.extendsList.find(item => item.fieldCode == 'S_O_000068') ? item.extendsList.find(item => item.fieldCode == 'S_O_000068').fieldValues : '',
                            riskAreaName: item.extendsList.find(item => item.fieldCode == 'S_O_000071') ? item.extendsList.find(item => item.fieldCode == 'S_O_000071').fieldValues : '',
                            theElevatorType: item.extendsList.find(item => item.fieldCode == 'S_O_000000') ? item.extendsList.find(item => item.fieldCode == 'S_O_000000').fieldValues : '',
                            value1: item.extendsList.find(item => item.fieldCode == 'S_O_000059') ? item.extendsList.find(item => item.fieldCode == 'S_O_000059').fieldValues : '',
                            label1: item.extendsList.find(item => item.fieldCode == 'S_O_000050') ? item.extendsList.find(item => item.fieldCode == 'S_O_000050').fieldValues : '',
                            value2: item.objectId,
                            label2: item.objectName,
                            propertyName: item.extendsList.find(v2 => v2.fieldCode == 'S_O_000108')?item.extendsList.find(v2 => v2.fieldCode == 'S_O_000108').fieldValues:'',
                        };
                        if(productCategory1 == 'jz'){
                            let userTypeList = [
                                {
                                    "code":"20DT351469",
                                    "value":"家庭教育类",
                                },
                                {
                                    "code":"20DT358522",
                                    "value":"烹饪类",
                                },
                                {
                                    "code":"20DT515860",
                                    "value":"保洁类",
                                },
                                {
                                    "code":"20DT754994",
                                    "value":"婚介婚庆类",
                                },
                                {
                                    "code":"20DT169839",
                                    "value":"其他类",
                                },
                                {
                                    "code":"20DT911671",
                                    "value":"宠物护养与植物养护类",
                                },
                                {
                                    "code":"20DT953387",
                                    "value":"接送类",
                                },
                                {
                                    "code":"20DT398423",
                                    "value":"维修保养类",
                                },
                                {
                                    "code":"20DT784875",
                                    "value":"高空作业类",
                                },
                                {
                                    "code":"20DT815195",
                                    "value":"护理类",
                                },
                                {
                                    "code":"20DT853198",
                                    "value":"搬家类",
                                }
                            ]
                            ele.value2 = item.extendsList.find(item => item.fieldCode == 'S_O_000049') ? item.extendsList.find(item => item.fieldCode == 'S_O_000049').fieldValues : '';
                            let S_O_000132 = item.extendsList.find(v2 => v2.fieldCode == 'S_O_000132')
                            let postName;
                            userTypeList.forEach(v1=>{
                                if(S_O_000132 && v1.code == S_O_000132.fieldValues){
                                    postName = v1.value
                                }
                            })
                            ele.postName = postName
                        }
                        data.push(ele);
                    });
                }
                return data;
            }
        })
    }


    policydetails(data) { //保单详情
        return post(apiUrl.POLICYDETAILS, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }


    addpolicy(data) { //添加或修改保单
        return post(apiUrl.ADD_POLICY, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    exportsdt(data) { //电梯责任险数据导出
        return get(apiUrl.CASE_DCDT, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    exportsgz(data) { //雇主责任险数据导出
        return get(apiUrl.CASE_DCGZ, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    exportsty(data) { //团意责任险数据导出
        return get(apiUrl.CASE_DCTY, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    exportssd(data) { //索道责任险数据导出
        return get(apiUrl.CASE_DCSD, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    transFormMediateSequip(data) { // 案件变更服务人员
        return post(apiUrl.TRANSFORMMEDIATE, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //案件中止申请
    stopCase(data) {
        return post(apiUrl.STOPCASE, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //案件中止解除
    relieveStop(id) {
        return deletes(apiUrl.STOPCASE + '/' + id).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //选中服务人员转移
    transforServicor(data) {
        return post(apiUrl.TRANSFORMMEDIATE,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //全部服务人员转移
    transforServicorAll(data) {
        return post(apiUrl.TRANSFORMSERVICORALL,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //查询案件同步列表
    getSyncCaseList(data) {
        return get(apiUrl.CASE_ASYN_LIST, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //根据报案号查询同步记录
    getSyncCaseRecord(data) {
        return get(apiUrl.CASE_RECORD + '/' + data, ).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //案件同步
    caseAsync(data) {
        return post(apiUrl.CASE_ASYNC,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //E保保单接口
    getCaseEBaoPolList(data) {
        return get(apiUrl.GET_EBAO_POLICY,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }



    /**
     * 新案件相关接口
     * --------------------
     * --------------------
     * 开始
     */
    // 查询当前用户部门
    selectByEmployeeNum(data) {
        return get(apiUrl.SELECT_BY_EMPLOYEE_NUM, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取案件资料赔付列表
    getPFConfig(data){
        return post(apiUrl.GET_PF_CONFIG,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //新增、修改案件资料赔付
    saveConfig(data){
        return post(apiUrl.SAVE_CONFIG,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    //删除接口
    deleteConfig(id) {
        return post(apiUrl.DELETE_CONFIG + '?id=' + id).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取资料管理列表
    getLxConfig(data){
        return post(apiUrl.GET_LX_CONFIG,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //创建/修改案件资料配置模板
    createProductConfig(data){
        return post(apiUrl.CREATE_PRODUCT_CONFIG,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //案件资料配置模板分页查询
    productConfigPages(data){
        return post(apiUrl.PRODUCT_CONSIG_PAGES,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取保司列表
    getInsuranceCompanyName(){
        return post(apiUrl.GET_INSURANCE_COMPANY_NAME).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    
    //新增判断当前有没有
    existConfig(insuranceName,productCode){
        return post(apiUrl.EXIST_CONSIG +'?' + 'insuranceName='+insuranceName + '&productCode=' + productCode).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取案件资料模板详情
    getTemplateDetail(insuranceName,productCode){
        return post(apiUrl.GET_TEMPLATE_DETAIL +'?' + 'insuranceName='+insuranceName + '&productCode=' + productCode).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //审核接口
    examine(data){
        return post(apiUrl.EXAMINE,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //删除案件资料模板
    deleteTemplate(insuranceName,productCode,version){
        return post(apiUrl.DELETE_TEMPLATE + '?=insuranceName=' + insuranceName + '&productCode=' + productCode + '&version=' + version).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取案件资料模板配置详情
    getTemplateItemList(templateId){
        return post(apiUrl.GET_TEMPLATE_ITEM_LIST + '?=templateId=' + templateId).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取树形结构回显层级
    getTemplateItemListTree(templateId){
        return post(apiUrl.GET_TEMPLATS_ITEM_LIST_TREE + '?=templateId=' + templateId).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
}