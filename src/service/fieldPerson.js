import $apiUrl from '../api/apiUrl'
import $axios from 'axios';

export default class userManage {
	/**
	 * 外勤人员列表
	 * 
	 */
	fieldPersonnelList(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.FIELD_PERSONNELLIST,
			data: data
		}).then(res => {
			return res.data
		})
	}



	/**
 * 外勤人员详情
 * 
 */
	fieldPersonnelDetails(id) {
		return $axios({
			method: 'get',
			url: $apiUrl.FIELD_PERSONNEL_DETAILS + '/' + id,

		}).then(res => {
			return res.data
		})
	}


	/**
* 外勤人员列表反向加载查询条件
* 
*/
	fieldPersonnelCond() {
		return $axios({
			method: 'get',
			url: $apiUrl.FIELD_PERSONNEL_COND

		}).then(res => {
			return res.data
		})
	}


	/**
	 * 删除外勤人员
	 * 
	 */
	delFieldPersonnel(id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.DEL_FIELD_PERSONNEL + '/' + id,

		}).then(res => {
			return res.data
		})
	}

	/**
	 * 添加外勤人员
	 * 
	 */
	createFieldPersonnel(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.CREATE_FIELD_PERSONNEL,
			data
		}).then(res => {
			return res.data
		})
	}

	/**
	 * 修改外勤人员状态
	 * 
	 */
	alterFieldPersonnelStatus(id) {
		return $axios({
			method: 'put',
			url: $apiUrl.ALTER_FIELD_PERSONNEL_STATUS + '/' + id,
		}).then(res => {
			return res.data
		})
	}


	/**
	 * 修改外勤人员
	 * 
	 */
	alterFieldPersonnel(id, data) {
		return $axios({
			method: 'put',
			url: $apiUrl.ALTER_FIELD_PERSONNEL + '/' + id,
			data
		}).then(res => {
			return res.data
		})
	}





}
