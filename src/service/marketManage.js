 //导入接口管理模块
 import $apiUrl from '../api/apiUrl'
 import $axios from 'axios';

 export default class dateService {
 	/**
 	 * 请求服务器时间
 	 * @param {json} 
 	 */
 	getDate(data) {
 		return $axios({
 			method: 'get',
 			url: $apiUrl.GETDATE,
 		}).then(res => {
 			return res
 		})
 	}
	/**
	 * 查询分支机构人员
	 *
	 * @param {*} data
	 * @returns
	 * @memberof marketService
	 */
	batchPerson(data) {
		return $axios({
			method: 'get',
			url: $apiUrl.BATCH_PERSON, //$apiUrl.BATCH_PERSON
			params: data
		}).then(res => {
			return res
		})
	}
 }
