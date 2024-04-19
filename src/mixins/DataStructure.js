import moment from 'moment'
import { getProductCategory2 } from "@/util/getProductCategory2"; // 获取行业类型方法
export const DataStructure = {
    methods:{
        OrganizeData(form,insureds,productInfo,employee,policy,attachment,crossForm,agent,addList,settForm){
            let branchInfo = sessionStorage.getItem('branchInfo_01') ? JSON.parse(sessionStorage.getItem('branchInfo_01')) : null;
            let risk = this.getProductMessagea(productInfo,policy);
            let item1 = {
                entryType:"00", // 录入方式：单笔录入(00) / 批量导入(01)-显示-非必填
                amount: policy.premium, // 订单金额-显示-非必填
                source:"00", //订单来源：pc端(00) / 移动端(01) / 合作方(02)-显示-非必填
                operator:sessionStorage.getItem('userCode'), //操作人员编码-显示-非必填
                applicationForms:[
                    {
                        revenueRecognitionReason: crossForm.proofReason ?crossForm.proofReason: "", // 收入确认佐证原因-不可批改-显示-非必填
                        revenueRecognitionFile: crossForm.proofFile, // 收入确认佐证文件-不可批改-显示-非必填
                        revenueRecognitionOtherReason: crossForm.otherReas, // 收入确认佐证其他原因-不可批改-显示-非必填
                        revenueRecognitionTime: crossForm.incomeDate, // 收入确认时间点-不可批改-显示-非必填
                        reasonForBacklog: crossForm.proof, // 倒签原因-不可批改-显示-非必填"
                        applicationType:"00",//投保单类型：自助投保（00）/代投保（01）-显示-必填
                        endDate: moment(new Date(policy.endDate)).format("YYYY-MM-DD 23:59:59"),//保险止期：yyyy-MM-dd HH:mm:ss-显示-必填
                        cityCode: branchInfo ? branchInfo.cityCode : '',//城市编码-显示-非必填
                        renewalTimes:"",//续保次数-不显示-非必填
                        policy:{ //保单-显示-必填
                            policyNo:policy.policyNo, //保单号-显示-必填
                            issueDate:moment(new Date(policy.signedon)).format("YYYY-MM-DD 00:00:00"), //签单日期-显示-必填
                        },
                        productCategory1: productInfo.productSort,//产品分类1级-显示-非必填
                        productCategory2: getProductCategory2(productInfo.productCode),//产品行业分类编码
                        risk:risk.risk,
                        agents:[],//保单服务人员列表-显示-非必填
                        tempSerialNo:"", //暂存流水号-显示-非必填
                        channelType:"0001", //渠道类型-显示-非必填
                        productName:productInfo.productName, //产品名称：产品详情取值-显示-必填
                        policyKind:"01", //保单类型：电子保单(00) / 纸质保单(01)-显示-非必填
                        cityName: branchInfo ? branchInfo.cityName : '', //城市名称-显示-非必填
                        projectCode:productInfo.projectCode, //项目编码：产品详情取值-显示-必填
                        term: this.$stringHelper.countDay(policy.startDate,policy.endDate), //保单天数-显示-必填
                        productType:settForm && settForm.isPayType=='1'?"00":"01", //产品类型：财产(00) / 寿(01)-显示-必填
                        productType:"00", //产品类型：财产(00) / 寿(01)-显示-必填
                        prem:policy.premium, //投保单保费-显示-非必填
                        countyName:branchInfo ? branchInfo.countryName : '', //区县名称-显示-非必填
                        isRenewal:(policy.type == 2)?'Y':'N', //是否续保：是(Y) / 否(N)-不显示-非必填
                        provinceCode:branchInfo ? branchInfo.provinceCode :  sessionStorage.getItem('provinceCode').slice(0,2)+'0000', //省编码-显示-必填
                        channalCode:"sequip", //渠道编码：产品详情取值-显示-必填
                        branchName:sessionStorage.getItem('branchName'), //机构名称：用户未关联业务员必填-显示-非必填
                        branchCode:sessionStorage.getItem('branchCode'),  //机构编码：用户未关联业务员必填-显示-非必填
                        issueType:"00", //出单方式：线下出单(00) / 线上出单(01)-显示-非必填
                        factors:[ //保费计算因子-显示-非必填
                            {
                                factors:[
                                    {
                                        code:"", //保费因子子集合编码-显示-非必填
                                        name:"", //保费因子子集合名称-显示-非必填
                                        value:"" //保费因子子集合值-显示-非必填
                                    }
                                ],
                                code:"", //保费计算因子编码：产品中心取值-显示-非必填
                                related2:"", //保费计算关联2：被保人序号-显示-非必填
                                related1:"", //保费计算关联1：标的序号-显示-非必填
                                rate:"", //保费计算因子费率-显示-非必填
                                name:"", //保费计算因子名称：产品中心取值-显示-非必填
                                related3:"", //保费计算关联3：险种编码-显示-非必填
                                value:"" //保费计算因子值-显示-非必填
                            }
                        ],
                        mailType:"", //邮寄地址类型-显示-非必填
                        countyCode: branchInfo ? branchInfo.countyCode : '', //区县编码-显示-非必填
                        productCode:productInfo.productCode,  //产品编码：产品详情取值-显示-必填
                        ifSettlement:policy.ywFlag ? '1' : '0',
                        inputBy:window.sessionStorage.getItem('userName'),
                        checkBy:window.sessionStorage.getItem('userName'),
                        commissionContractNo: policy.table[0].code,//  委托合同编码
                        bailorCode: policy.table[0].customerCode,//  委托人编码
                        bailorName: policy.table[0].customerName,//  委托人名称
                        contractStart: policy.table[0].startTime,//  合同起期
                        contractEnd: policy.table[0].endTime,//  合同止期
                        originalStatus:"",  //投保单初始状态  -显示-非必填
                        corType:form.types,  //企业类型
                        policyHolder:{ //投保人-显示-必填
                            zipCode:"", //邮编(企)-显示-非必填
                            linkPhone:"", //联系人手机(企)-显示-非必填
                            provinceCode:form.location[0], //省编码(共)-显示-必填
                            cityCode:form.location[1], //城市编码(共)-显示-非必填
                            holderCode:form.userCode, //投保人编码(共)-显示-必填
                            businessLicenseNo:"", //营业执照号(企)-显示-非必填
                            type:'00', //投保人类型(共)：企业(00) / 自然人(01) / 虚拟(02)-显示-必填
                            linkTel:form.phone1, //联系人电话(企)-显示-非必填
                            threeInOneCode:form.type == '2' ? form.threeInOneCode : '', //三证合一代码(企)-显示-非必填
                            countyCode:form.location[2], //区县编码(共)-显示-非必填
                            organizationCode:form.type == '1' ? form.threeInOneCode : '', //组织机构编码(企)-显示-非必填
                            name:form.holderName, //投保人名称(共)-显示-必填
                            location:form.position, //详细地址(共)-显示-必填
                            fax:"", //传真(企)-显示-非必填
                            linkPerson:form.person1, //联系人名称(企)-显示-非必填
                            linkEmail:"", //联系人邮箱(企)-显示-非必填
                        },
                        provinceName:branchInfo ? branchInfo.provinceName : '', //省名称-显示-非必填
                        attachments:[], //投保单附件-显示-非必填
                        projectName:productInfo.projectName, //项目名称：产品详情取值-显示-必填
                        insureds:[ //被保人列表-显示-必填
                            
                        ],
                        safetyHouseCount:addList ? addList.length : '',//房屋数量
                        insuredEmployeesNum:productInfo.employees,
                        theElevatorNumber:productInfo.sequipmentNum,
                        estateManagementCount:productInfo.propertyNum,
                        startDate: moment(new Date(policy.startDate)).format("YYYY-MM-DD 00:00:00"), //保险起期：yyyy-MM-dd HH:mm:ss-显示-必填
                        renewalLastPolicyNo:(policy.type == 2)?policy.renewalLastPolicyNo:'', //续保保单号-不显示-非必填
                        applicationDate:'', //投保日期：yyyy-MM-dd HH:mm:ss-显示-非必填
                        // insuranceCompanies:[ //承保公司-显示-必填
                        //     {
                        //         role1:"03", //承保公司承保标记-显示-必填
                        //         code:policy.inusureCompanyCode, //承保公司编码-显示-必填
                        //         role2:"01", //承保公司出单标记-显示-必填
                        //         name:policy.inusureCompanyName, //承保公司名称-显示-必填
                        //         shareRate:policy.shareScale, //承保公司解付比例-显示-必填
                        //         backApplicationFormCode:"" //承保公司保单号-显示-非必填
                        //     }
                        // ]
                        insuranceCompanies:settForm && settForm.isPayType ?this.settCompanyDTO(settForm.tableData) :this.companyDTO(policy), // 出单承保公司集合
                        hasSettlement:settForm && settForm.isPayType?"01":"00", // 包含结算信息 00-不包含 01-包含-显示-非必填
                        "settlementDepartments":settForm && settForm.isPayType?[{
                          "branchCode":settForm && settForm.isPayType? settForm.settlementBranch:null,//"结算机构编码",
                          "branchName":settForm && settForm.isPayType? settForm.settlementBranchName:null, // "结算机构名称",
                          "departmentName":settForm && settForm.isPayType?settForm.settlementDepartmentName:null, // "结算部门名称",
                          "departmentCode":settForm && settForm.isPayType?settForm.settlementDepartment[0]:null,  // "结算部门编码",
                          "settlementCompanies":settForm && settForm.isPayType? this.handleSettCompany(settForm.tableList,policy.premium) :null,  // 结算公司
                          "type":settForm && settForm.isPayType? 0:1, // "公司类型0-结算信息 1-转付信息",
                          "remittanceCompanies":settForm && settForm.isPayType=='1' ?null:settForm.tableData, // 转付公司集合
                        }]:[],
                    }
                ]
            }
            if(productInfo.productSort == 'jc') {
                let obj = {
                    name:insureds.entityInfo,
                    type:insureds.type,    // 被保人类型（企业（00）自然人（01）虚拟（02））（投保人性质）
                    entityInfo:insureds.entityInfo,     // 被保人描述
                    insuranceObjects:addList,
                    safetyHouseCount:addList ? addList.length : '',//房屋数量
                };
                item1.applicationForms[0].insureds[0] = obj;
            } else {
                let obj = {
                    zipCode:"", //邮编(企)-显示-非必填
                    linkPhone:insureds.phone1, //被保人联系人手机(企)-显示-非必填
                    licenseNo:"", //许可证号(企)-显示-非必填
                    isHolder:"", //被保人是否同投保人(共)-显示-非必填
                    provinceCode:insureds.location[0], //省编码(共)-显示-必填
                    cityCode:insureds.location[1], //城市编码(共)-显示-非必填
                    businessLicenseNo:"", //营业执照号(企)-显示-非必填
                    type:'00', //被保人类型(共)：企业(00) / 自然人(01) / 虚拟(02)-显示-非必填
                    linkTel:insureds.phone1, //联系人电话(企)-显示-非必填
                    threeInOneCode:insureds.type == '2' ? insureds.threeInOneCode : '', //三证合一代码(企)-显示-非必填
                    // attachments:[ //被保人附件列表(共)-显示-非必填
                    //     {
                    //         id:"", //被保人附件id-显示-非必填
                    //         type:"" //被保人附件类型-显示-非必填
                    //     }
                    // ],
                    managerType:"", //经营性质(企)-显示-非必填
                    countyCode:insureds.location[2], //区县编码(共)-显示-非必填
                    organizationCode:insureds.type == '1' ? insureds.threeInOneCode : '', //组织机构编码(企)-显示-非必填
                    name:insureds.holderName, //被保人名称(共)-显示-必填
                    location:insureds.position, //详细地址(共)-显示-必填
                    linkPerson:insureds.person1, //联系人名称(企)-显示-非必填
                    linkEmail:"", //联系人邮箱(企)-显示-非必填
                };
                // 历史问题，之前入参地方错误
                if(productInfo.productSort == 'wy'){
                    obj.insuranceObjects=[{
                        estateManagementCount:productInfo.propertyNum,
                    }]
                }
                item1.applicationForms[0].insureds[0] = obj;
            }
            if(policy.table[0].renew || policy.table[0].renew == 0) {
                item1.applicationForms[0].renew = policy.table[0].renew;
            }
            policy.urlId.forEach(ele =>{
                let obj = {
                    id:ele.fileId,
                    type:"A002"
                }
                item1.applicationForms[0].attachments.push(obj)
            })
            if(agent && agent.smsAgentCode) {
                item1.applicationForms[0].agents.push(agent);
                item1.applicationForms[0].schanelCode = '05'
            }
            let data = {
                endDate:moment(new Date(policy.endDate)).format("YYYY-MM-DD 23:59:59"),//: 保险止期 ,
                json:JSON.stringify(item1),// 发送投保中心报文 ,
                insuredAmount:policy.amount*10000,// 保额 ,
                policyHolder:form.holderName,// 投保人名称 ,
                policyHolderCode:form.userCode,// 投保人编码 ,
                policyNo:policy.policyNo,// 保单号 ,
                premium:policy.premium,// 保费 ,
                productCode:productInfo.productCode,// 产品编码 ,
                productName:productInfo.productName,// 产品名称 ,
                startDate:moment(new Date(policy.startDate)).format("YYYY-MM-DD 00:00:00"),// 保险起期 ,,
                userBranchCode:window.sessionStorage.getItem('branchCode'),// 录单人分支机构编码 ,
                userBranchName:window.sessionStorage.getItem('branchName'),// 录单人分支机构名称 ,
                userCode:window.sessionStorage.getItem('userCode'),// 录单人编码 ,
                userName:window.sessionStorage.getItem('userName'),// 录单人名称
            }
            return data;
        },
        getProductMessagea(data,policy){
            let datas = {
                risk:[],
                coverage:0
            }
            data.itemM.forEach(item =>{
                let obj = {
                    riskFlag2:item.riskFlag2, //主附标识：主险(M) / 附加险(A)-显示-必填
                    duties:[],
                    mainRiskCode:item.riskCode, //主险编码：产品中心取值-显示-必填
                    riskCode:item.riskCode, //险种代码：产品详情取值-显示-必填
                    amount: policy.amount*10000, // 限额
                };
                item.duties.forEach(item1 =>{
                    let obj1 = {
                        dutyCode:item1.dutyCode,
                        dutyName:item1.dutyName,
                        dutyLimits:[]
                    }
                    item1.dutyLimits.forEach(item2 =>{
                        item2.list.forEach(item3 =>{
                            if(item3.disabled){
                                let obj2 = {
                                    code:item2.code,
                                    name:item2.name,
                                    valueCode:item3.valueCode,
                                    value:''
                                }
                                if(item2.name == '企业累计责任限额'){
                                    datas.coverage = Number(item3.showValue)
                                }
                                if(item3.limitValue.indexOf("|*|") != -1){
                                    data.itemM.forEach(ele =>{
                                        ele.duties.forEach(ele1 =>{
                                            ele1.dutyLimits.forEach(ele2 =>{
                                                if(ele2.code == item3.limitValue.split("|*|")[0]){
                                                    ele2.list.forEach(ele3 =>{
                                                        if(ele3.disabled){
                                                            obj2.value = ele3.showValue * item3.limitValue.split("|*|")[1] / 100;
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }else{
                                    obj2.value = item3.showValue;
                                }
                                obj1.dutyLimits.push(obj2)
                            }
                        })
                    })
                    obj.duties.push(obj1)
                })
                datas.risk.push(obj)
            })
            data.itemA.forEach(item =>{
                let obj = {
                    riskFlag2:item.riskFlag2, //主附标识：主险(M) / 附加险(A)-显示-必填
                    duties:[],
                    mainRiskCode:item.riskCode, //主险编码：产品中心取值-显示-必填
                    riskCode:item.riskCode, //险种代码：产品详情取值-显示-必填
                };
                item.duties.forEach(item1 =>{
                    let obj1 = {
                        dutyCode:item1.dutyCode,
                        dutyName:item1.dutyName,
                        dutyLimits:[]
                    }
                    item1.dutyLimits.forEach(item2 =>{
                        item2.list.forEach(item3 =>{
                            if(item3.disabled){
                                let obj2 = {
                                    code:item2.code,
                                    name:item2.name,
                                    valueCode:item3.valueCode,
                                    value:''
                                }
                                if(item3.limitValue.indexOf("|*|") != -1){
                                    data.itemM.forEach(ele =>{
                                        ele.duties.forEach(ele1 =>{
                                            ele1.dutyLimits.forEach(ele2 =>{
                                                if(ele2.code == item3.limitValue.split("|*|")[0]){
                                                    ele2.list.forEach(ele3 =>{
                                                        if(ele3.disabled){
                                                            obj2.value = ele3.showValue * item3.limitValue.split("|*|")[1] / 100;
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })
                                    data.itemA.forEach(ele =>{
                                        ele.duties.forEach(ele1 =>{
                                            ele1.dutyLimits.forEach(ele2 =>{
                                                if(ele2.code == item3.limitValue.split("|*|")[0]){
                                                    ele2.list.forEach(ele3 =>{
                                                        if(ele3.disabled){
                                                            obj2.value = ele3.showValue * item3.limitValue.split("|*|")[1] / 100;
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }else{
                                    obj2.value = item3.showValue;
                                }
                                obj1.dutyLimits.push(obj2)
                            }
                        })
                    })
                    obj.duties.push(obj1)
                })
                datas.risk.push(obj)
            })
            return datas;
        },
        companyDTO(data){ // 
            let list = JSON.parse(sessionStorage.getItem('inusureCompanysData'));
            // role1  01主承 02共保  03独立承保
            // role2 01出单 02 跟单
            let DTOList = [];
            DTOList = list.map(item => {
              if(item.shareType == '1'){
                return {
                  role1:"01", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                //   role2:"01", //承保公司出单标记-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                  shareRate:item.shareScale, //承保公司解付比例-显示-必填
                }
              }else if(item.shareType == '2'){
                return {
                  role1:"02", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                  shareRate:item.shareScale, //承保公司解付比例-显示-必填
                }
              }else if(item.shareType == '3' && item.code == data.inusureCompanyCode){
                return {
                  role1:"03", //承保公司承保标记-显示-必填
                  code:data.inusureCompanyCode, //承保公司编码-显示-必填
                //   role2:"01", //承保公司出单标记-显示-必填
                  name:data.inusureCompanyName, //承保公司名称-显示-必填
                  shareRate:data.shareScale, //承保公司解付比例-显示-必填
                }
              }else if(item.partyRole == '2' && item.insuringType == 'Y' && item.code == data.inusureCompanyCode){
                return {
                //   role1:"01", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                  role2:"01", //承保公司出单标记-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                //   shareRate:item.shareScale, //承保公司解付比例-显示-必填
                }
              }else if(item.partyRole == '2' && item.insuringType == 'N'){
                return {
                //   role1:"02", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                  role2:"02", //承保公司出单标记-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                //   shareRate:item.shareScale, //承保公司解付比例-显示-必填
                }
              }

            }).filter(item2 => item2 !== undefined); 
            return DTOList;
        },
        settCompanyDTO(list){
            let DTOList = [];
            DTOList = list.map(item =>{
              if(item.isIssue == '01'){
                return {
                  role1:"01", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                  role2:"01", //承保公司出单标记-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                  shareRate:(item.ratio/100).toFixed(4), //承保公司解付比例-显示-必填
                  sharePremium:item.amount, // 保费
                }
              }else{
                return {
                  role1:"02", //承保公司承保标记-显示-必填
                  code:item.code, //承保公司编码-显示-必填
                  name:item.name, //承保公司名称-显示-必填
                  shareRate:(item.ratio/100).toFixed(4), //承保公司解付比例-显示-必填
                  sharePremium:item.amount, // 保费
                }
              }
            })
            return DTOList;
        },
        handleSettCompany(list,prem){
            // list  结算公司集合
            let arr = JSON.parse(JSON.stringify(list));
            let DTOList = [];
            DTOList = arr.map(item =>{
              // 结算比例，（没有内联时为承保比例，有内联时，用输入金额除以父集计算出的初始金额乘以承保比例）
              if( !item.flag && !item.flagInput){ 
                item['settlementRatio'] = Number(item.ratio/100).toFixed(4)  
              }else{
                let num = arr.find(item => item.flagInput).oldAmount  // 内联的保险公司父集计算出来的初始金额。
                item['settlementRatio'] = ((item.settlementAmount/num)*Number(item.ratio/100)).toFixed(4)  // 输入金额除以父集计算出的初始金额乘以承保比例
              }
              item['settlementRatioAmount'] = (prem *item.settlementRatio).toFixed(4) // 总保费乘结算比例，
              if(item.commissionType == '00'){  // 比例时，佣金率传入必须为小数
                item.commissionValue = (item.commissionValue*100/10000).toFixed(4)
              }
              return item;
            })
            return DTOList;
        },
    }
}