import $apiUrl from '../api/apiUrl'
import { post, get} from '../api/index'
import $axios from 'axios';

export default class claim {
    /**
     * 认领案件列表
     * @returns 
     */
    selectDockingClaimList(data) {
        return post($apiUrl.SELECT_DOCKING_CLAIM_LIST,data,{headers: {
            branchCode: window.sessionStorage.getItem('branchCode')
        }},).then(res=>{
            return res;
		})
    }

    /**
     * 根据案件号/报案号查询对接案件信息
     * @param {*} params 
     * @returns 
     */
    queryCaseDockingByCaseNo(params) {
        return get($apiUrl.QUERY_CASE_DOCKING_BY_CASE_NO, params).then(res => {
            return res;
        })
    }

     querySysDictMenu(channelNo) {
        return $axios({
			method: 'GET',
            url: `${$apiUrl.SYS_DICT}?channelNo=${channelNo}`,
            headers: {
                branchCode: window.sessionStorage.getItem('branchCode')
            },
		}).then(res => {
			return res.data
		}) 
     }

    /**
     * 根据分支机构编码查询分支机构人员
     * @param {*} data 
     * @returns 
     */
    queryPersonByJtBranchCode(data) {
		return get($apiUrl.customerUrl, data).then(res => {
            return res;
        })
	}
    // 案件同步数据
    caseAsync(data) {
		return post($apiUrl.SYS_CASE_SEQUIP , data).then(res => {
			return res
		})
	}
    casestart(reportNo) { //1.案件提交给400进行报案
        return post(`${$apiUrl.FINISH_REPORT_CASE}?reportNo=${reportNo}`,).then(res => {
			return res
		})
	}
    //添加报案
    addCase(data) {
        return post($apiUrl.REPORTED_INFO_BY_400, data).then(res => {
			return res
		})
	}
    //新增保司江泰案件关联表数据
    insertCaseAssociation(data) {
        return post($apiUrl.INSERT_CASE_ASSOCIATION, data).then(res => {
			return res
		})
	}
    // 修改案件关联表引用状态
    updateBsJtCaseStatus(data) {
        return get($apiUrl.UPDATE_BS_JT_CASE_REF_STATUS, data).then(res => {
			return res
		})
	}
    // 修改对接案件引用状态
    updateCaseStatus(data) {
        return get($apiUrl.UPDATE_CASE_REF_STATUS, data).then(res => {
			return res
		})
	}
}