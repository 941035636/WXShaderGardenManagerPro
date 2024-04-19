//导入接口管理模块
import $apiUrl from '../api/apiUrl'
import { post, get ,deletes} from '@/api/index'
export default class AchievementService {
	/**
	 * 绩效列表查询
	 * @param {Object} data 查询数据
	 */	 
    getAch(data) {
		return post($apiUrl.ACHIEVE_SEARCH,data).then(res=>{
			return res;
		})
	}
	/**
	 * 绩效明细查询
	 * @param {Object} data 查询数据
	 */
	getAchDetail(data) {
		return post($apiUrl.ACHIEVE_DETAIL,data).then(res=>{
			return res;
		})
	}
	/**
	 * 月结记录列表查询
	 * @param {Object} data 查询数据
	 */	 
    getMonth(data) {
		return post($apiUrl.ACHIEVE_MONTH,data).then(res=>{
			return res;
		})
	}
	//查询已记录险种
	getRiskCodeList() {
		return get($apiUrl.SEARCHRISKCODE).then(res => {
			return res;
		})
	}
	//佣金统计信息
	getSum(data) {
		return post($apiUrl.GETSUN,data).then(res => {
			return res;
		})
	}
	//批量添加记录
	postRecord(data) {
		return post($apiUrl.POSTPLINSERT,data).then(res => {
			return res;
		})
	}
	//绩效修改
	postUpdataRecord(data) {
		return post($apiUrl.POSTUPDATAPER,data).then(res => {
			return res;
		})
	}
	//刷新
	refreshRow(data) {
		return post($apiUrl.POSTREFRESH,data).then(res => {
			return res;
		})
	}
	//导出佣金明细表
	exportExcel(data) {
		return post($apiUrl.JXEXPORTSS,data).then(res => {
			return res;
		})
	}
	//删除佣金明细表记录
	delRecord(id) {
		return deletes($apiUrl.DELETEJX + '?id=' + id).then(res => {
			return res;
		})
	}
}
