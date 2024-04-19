import moment from 'moment'
import dateService from "../service/dateService.js";
let currentDate = moment().format('YYYY年MM月DD日')
async function getData() {
    let dateSer = new dateService()
    let res = await dateSer.getDate()
    if(res.data.code === '0000') {
        currentDate = moment(res.data.data).format('YYYY年MM月DD日')
    }
}
getData()
export default class template {
    
    /**
     * 固定报文
     * @param {Object} insurance 投保单报文
     * @param {Array} factorList 产品因子数组
     */
    publicBaoWen (insurance = {},factorList = []) {
        let Product = new product()
        let PtringHelper = new stringHelper()
        let factorMap = Product.getFactor(factorList)
        let dynamic =  'dynamicBaoWen' + insurance.productCode
        let dynamicBaoWen = this[dynamic](insurance,factorMap)
        let managerTypeObj = {
            'A':'个体/民营企业',
            'B':'国有企业',
            'C':'三资企业',
            'OT':'其他',
        }
        let areaMap = JSON.parse(window.sessionStorage.getItem('areaMap')) 
        let holderProvinceName = areaMap[insurance.holder.corporation.provinceCode]
        let holderCityName = areaMap[insurance.holder.corporation.cityCode]
        let holderCountyName = areaMap[insurance.holder.corporation.countyCode]
        let insureProvinceName = areaMap[insurance.insuredList[0].corporation.provinceCode]
        let insureCityName = areaMap[insurance.insuredList[0].corporation.cityCode]
        let insureCountyName = areaMap[insurance.insuredList[0].corporation.countyCode]
        let data = {
            "appCode":insurance.applicationFormCode, //投保单号
            "holderName":insurance.holder.corporation.name, //投保人名称
            "holderPhone":insurance.holder.corporation.linkPhone,  //投保人电话
            "holderAddress":`${holderProvinceName}${holderCityName}${holderCountyName}${insurance.holder.corporation.location}`,  //投保人地址
            "insureName":insurance.insuredList[0].corporation.name,   //被保人名称
            "insurePhone":insurance.insuredList[0].corporation.linkPhone?insurance.insuredList[0].corporation.linkPhone:insurance.insuredList[0].corporation.linkTel,  //被保人电话
            "insureAddress":insurance.insuredList[0].isHolder == 'Y' ? 'Y': `${insureProvinceName}${insureCityName}${insureCountyName}${insurance.insuredList[0].corporation.location}`,  // 被保人地址与投保人一致传'Y' ,不一致传地址信息
            "managerType":insurance.holder.corporation.managerType ? managerTypeObj[insurance.holder.corporation.managerType] : '',  //经营性质
            "businessScope":insurance.holder.corporation.businessScope,  //经营范围
            "threeInOneCode":insurance.insuredList[0].corporation.threeInOneCode, //被保人社会信用代码
            "licenseNo":insurance.insuredList[0].corporation.licenseNo,  //生产许可证号
            "prem":insurance.afterPrem,  //保费 数字写法
            "premCap":PtringHelper.smalltoBIG(insurance.afterPrem),  //保费 中文写法
            "industry":insurance.insuredList[0].corporation.industryKind,    // 行业类型
            "trem":PtringHelper.differMonth(insurance.endDate,insurance.startDate),  //保障时长 月为单位
            "startTime":moment(insurance.startDate).format('YYYY年MM月DD日'),  //保险起期 yyyy年MM月dd日
            "endTime":moment(insurance.endDate).format('YYYY年MM月DD日'),   //保险止期 yyyy年MM月dd日
            "createName":window.sessionStorage.getItem('userName'),
            "createBy":window.sessionStorage.getItem('userCode'),
            "pagePolicy":insurance.policyKind === '00'?'N':'Y', // 保单类型00电子保单01纸质保单
            "pagePolicyAddress":`${insureProvinceName}${insureCityName}${insureCountyName}${insurance.insuredList[0].corporation.location}`,
            "linkPerson":insurance.holder.corporation.linkPerson,
            "nowDate":currentDate, // 当前时间
        };

        return Object.assign(dynamicBaoWen,data)
    }
    /**
     * @param {object} insurance 投保单信息
     * @param {object} factorMap 因子map 
     */
    dynamicBaoWen20PR879497 (insurance = {},factorMap = {}) {
        let PtringHelper = new stringHelper()
        let obj = {
            "S_I_000037":"",  //工程合同金额 单位万元
            "S_I_000038":"",  //项目名称
            "S_I_000039":"",  //项目地址
            "S_I_000368":"",  //风险类别  一般风险工程 ,高风险工程
            "S_I_000363":"",  //企业安全生产标准化考评调整系数  上年度企业安全生产标准化考评不合格  上年度企业安全生产标准化考评合格  上年度企业安全生产标准化考评优良
            "S_I_000364":"",  //企业安全标准化优良工地调整系数
            "S_I_000365":"",  //企业不配合率调整系数
            "S_I_000367":"",  //开工时机调整系数
            "S_I_000366":"",  //企业建筑安全事故调整系数
        };
        
        for (let key in obj) {
            let keyValue = insurance.insuredList[0].corporation.extendList.find(item => item.key == key)
            obj[key] = keyValue ? keyValue.value : ''
            if (key != 'S_I_000037' && key != 'S_I_000038' && key != 'S_I_000039') {
                obj[key] =  factorMap.get(obj[key])
            } else if(key == 'S_I_000037') {   // 转换金额
                obj[key] = PtringHelper.unitConvert(obj[key],true)
            }
        }
        obj.insurance24OfHours = insurance.riskList.some(item => item.riskFlag2 == "A") ? '1' : '0'  // 附加二十四小时险 是否勾选 1 勾选 0 否
        insurance.riskList.find(item => item.riskFlag2 == 'M').dutyList.forEach(v1 => {
            if (v1.dutyCode == '20ZR219428') {
                obj.limitSum = PtringHelper.unitConvert(v1.dutyLimits[0].value) // 累计责任限额
            } else if (v1.dutyCode == '20ZR788550') {
                obj.limitPerAccident = PtringHelper.unitConvert(v1.dutyLimits[0].value)  // 每次事故每人责任限额
            }
        })
        return obj
    }
    /**
     * @param {object} insurance 投保单信息
     * @param {object} factorMap 因子map 
     */
    dynamicBaoWen21PR728703 (insurance = {},factorMap = {}) {
        let PtringHelper = new stringHelper()
        let obj = {
            "S_I_000037":"",  //工程合同金额 单位万元
            "S_I_000038":"",  //项目名称
            "S_I_000039":"",  //项目地址
            "S_I_000377":"",  //企业上一保单未发生亡人事故
        };
        for (let key in obj) {
            let keyValue = insurance.insuredList[0].corporation.extendList.find(item => item.key == key)
            obj[key] = keyValue ? keyValue.value : ''
            if (key != 'S_I_000037' && key != 'S_I_000038' && key != 'S_I_000039' && key != 'S_I_000377') {
                obj[key] =  factorMap.get(obj[key])
            }
        }
        let riskList = {
            "insuranceOtherEmploy":'21XZ551157',
            "insuranceThirdParty":'21XZ114141',
            "insurance24OfHours":'21XZ353839',
            "insuranceInfectious":'21XZ987479',
        }
        for (let key in riskList) {
            obj[key] = insurance.riskList.some(item => item.riskCode == riskList[key]) ? '1' : '0'
        }
        insurance.riskList.find(item => item.riskFlag2 == 'M').dutyList.forEach(v1 => {
            if (v1.dutyCode == '21ZR528491') {
                let value = v1.dutyLimits.find(v2=>v2.code == '21XE565428')
                obj.limitPerAccident =  PtringHelper.unitConvert(value.value)  
            }
        })
        return obj
    }
    /**
     * 续保建议书下载
     * @param {object} 台账信息
     */
    renewalRecommendation(standingBook={},policyDetail={},caseDetails={}){
        let data = {
            "holderName":policyDetail.holderName.replace('公司',''),
            "year":moment(standingBook.insuranceEndDate).format('YYYY'),
            "policyNo":standingBook.policyNo,
            "endDate":moment(standingBook.insuranceEndDate).format('YYYY年MM月DD日'),
            "startDate":moment(standingBook.insuranceStartDate).format('YYYY年MM月DD日'),
            "prem":standingBook.actualPrem.toFixed(2),
            "issueCompanyName":standingBook.companyName,
            "mainRiskName":policyDetail.mainRiskName,
            "addRiskNames":policyDetail.addRiskNames,
            "amount":parseFloat((standingBook.accuLimit/10000).toPrecision(12)),
            "accidentAmount":"0",   // 每次事故限额 不处理
            "perAmount":parseFloat((standingBook.perLimit/10000).toPrecision(12)),
            "now":currentDate,
            "caseNum":caseDetails.caseNum,
            "closeCaseNum":caseDetails.closeCaseNum,
            "payMoney": caseDetails.payMoney,
            "notCloseCaseNum":caseDetails.notCloseCaseNum,
            "estimatedLossAmount": caseDetails.estimatedLossAmount,
            "lossRatio": caseDetails.lossRatio,
            "deathNum": caseDetails.deathNum,
            "injuredNum": caseDetails.injuredNum,
            "lossAmount": caseDetails.lossAmount,
            "cases": caseDetails.cases,
            "createName":window.sessionStorage.getItem('userName'),
            "createBy":window.sessionStorage.getItem('userCode'),
            "customerLevel":policyDetail.customerLevel
        }
        return data
    }
    /**
     * 事故预防财务申请表
     */
    preventionFinance(obj={}) {
        let data = {
            contractNo:obj.contractNo,
            insuranceCorporationName:obj.orgName,
            createTime:obj.createTime,
            insuranceProductName:obj.insuranceProductName,
            projectName:obj.projectName,
            startTime:obj.startTime,
            endTime:obj.endTime,
            remark:obj.remark,
            "createName":window.sessionStorage.getItem('userName'),
            "createBy":window.sessionStorage.getItem('userCode'),
        }
        return data
    }
}
class product {
    /**
     * 获取所有的产品因子数据
     * @param {Arrat} factorList 产品因子数组
     */ 
    getFactor (factorList = []) {
        let map = new Map();
        factorList.forEach(v1 => {
            if (v1.riskFlag != 'M' && v1.riskFlag != 'A') {
                v1.list.forEach(v2 => {
                    map.set(v2.code,v2.value)
                })
            }
        })
        return map 
    }
}
class stringHelper {
    // 转换金额大写
    smalltoBIG(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
    /**
     * 转换金额
     * @param {*} num 
     * @param {*} isToFixed 是否保留后两位 true保留，false不保留
     */
    unitConvert(num, isToFixed = false) {
        var moneyUnits = ["元", "万元", "亿元", "万亿"] 
        var dividend = 10000;
        var curentNum = num;
        //转换数字 
        var curentUnit = moneyUnits[0];
        //转换单位 
        for (var i = 0; i <4; i++) { 
            curentUnit = moneyUnits[i] 
            if(this.strNumSize(curentNum)<5){ 
                break;
            }
            curentNum = curentNum / dividend 
        } 
        let toFixedNum = isToFixed ? 2 : 0
        return `${curentNum.toFixed(toFixedNum)}  ${curentUnit}`;
    }
    strNumSize(tempNum){ 
        var stringNum = tempNum.toString() 
        var index = stringNum.indexOf(".") 
        var newNum = stringNum;
        if(index!=-1){
            newNum = stringNum.substring(0,index) 
        } 
        return newNum.length
    }
    /**
     * 两个时间相差的月数
     * @param {*} date1 大的时间
     * @param {*} date2 小的时间
     */
    differMonth(endData, startData) {
        var eData = new Date(endData)
        var sData = new Date(startData)
        var diffYearNum = eData.getFullYear() - sData.getFullYear()
        var diffMonthNum = eData.getMonth() - sData.getMonth()
        var diffDayNum = eData.getDate() - sData.getDate()
        return diffYearNum * 12 + diffMonthNum + (diffDayNum >= 0 ? 1 : 0)
    }


    
}