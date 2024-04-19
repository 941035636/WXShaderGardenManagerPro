// 创建 StatisticService 服务类
import apiUrl from '@/api/apiUrl'
import { post, get, patch, put, deletes } from '@/api/index'
export default class StatisticService {
    getdatetime() {//获取服务器时间
        return get(apiUrl.GETDATETIME).then(res => {
            return res;
        })
    }
    getStatisticlist(data) {//按条件查询电梯信息
        return post(apiUrl.STATISTICS_ELE, data).then(res => {
            return res;
        })
    }
    getStatisticDay(insureStartDate,insureEndDate) {//630投保数据统计
        return get(apiUrl.STATISTICS_DAY + '?insureStartDate=' + insureStartDate + '&insureEndDate=' + insureEndDate).then(res => {
            return res;
        })
    }
    getStatisticHour(insureStartDate,insureEndDate) {//每日实时投保数据统计
        return get(apiUrl.STATISTICS_HOUR + '?insureStartDate=' + insureStartDate + '&insureEndDate=' + insureEndDate).then(res => {
            return res;
        })
    }
    //业务台账-产品名称查询
    getProductName() {
        return get(apiUrl.GETPRONAME).then(res => {
            return res;
        })
    }
    //业务台账-保险机构查询
    getCompanyList() {
        return get(apiUrl.GETCOMPANYLIST).then(res => {
            return res;
        })
    }
    //业务台账-列表查询
    getAccountList(data) {
        return post(apiUrl.GETACCOUNTLIST,data).then(res => {
            return res;
        })
    }
    //电梯台账-列表查询
    postEleAccountList(data) {
        return post(apiUrl.POSTACCOUNTELELIST,data).then(res => {
            return res;
        })
    }
    //物业台账-列表查询
    postWYAccountList(data) {
        return post(apiUrl.POSTACCOUNTWYLIST,data).then(res => {
            return res;
        })
    }
    //人员台账-列表查询
    postPERAccountList(data) {
        return post(apiUrl.POSTACCOUNTPERLIST,data).then(res => {
            return res;
        })
    }
    //人员台账-列表查询
    postCableway(data) {
        return post(apiUrl.POSTCABLEWAYLIST,data).then(res => {
            return res;
        })
    }
    //人员台账-列表查询
    postShop(data) {
        return post(apiUrl.POSTSHOPLIST,data).then(res => {
            return res;
        })
    }
    /**
	 * 业务台账
	 * @param {*} data 查询业务台账传参
	 */
	getLedger(data) {
        return get(apiUrl.GET_LEDGER_DATA,data).then(res => {
            return res;
        })
	}
    //产品台账列表查询
    getProductAccount(data) {
        return post(apiUrl.GETPRODUCTACCOUNT,data).then(res => {
            return res;
        })
    }
}