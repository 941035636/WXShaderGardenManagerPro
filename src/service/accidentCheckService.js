//导入接口管理模块
import $apiUrl from '../api/apiUrl'
import { post, get ,deletes,put} from '@/api/index'

export default class accidentCheckService {
	/**
	 * 模板列表
	 * @param {*} id  删除当前集合的id
	 */
	 delCheckTep(id) {
		return deletes($apiUrl.CHECK_TEMPLATE+'/'+id).then(res=>{
			return res;
		})
	}
	/**
	 * 模板列表
	 * @param {*} data  创建模板传参
	 */
	 getCheckTep(data) {
		return get($apiUrl.CHECK_TEMPLATE,data).then(res=>{
			return res;
		})
	}
	 
	  
	/**
	 * 创建模板
	 * @param {*} data  创建模板传参
	 */
	subCheckTep(data) {
		return post($apiUrl.CHECK_TEMPLATE,data).then(res=>{
			return res;
		})
	}
   
  
  /**
	 * 修改模板
	 * @param {*} data
	 */
   putCheckTep(data) {
		return put($apiUrl.CHECK_TEMPLATE,data).then(res=>{
			return res;
		})
	}
	/**
	 * 模板详情
	 * @param {*} id  当前项标识
	 */
	dilsCheckTep(id){
		return get($apiUrl.CHECK_TEMPLATE+'/'+id).then(res=>{
			return res;
		})
	}
	
	  /**
		 * 检查项列表
		 * @param {*} data 
		 */
	getChecList(data){
		return get($apiUrl.CHECK_GROUP,data).then(res=>{
			return res;
		})
	} 
	
	/**
	 * 创建检查项
	 * @param {*} data 
	 */
	subCheckGroup(data){
		return post($apiUrl.CHECK_GROUP,data).then(res=>{
			return res;
		})
	}
	
	/**
	 * 修改检查项
	 * @param {*} id
	 */
	putCheckGroup(data){
		return put($apiUrl.CHECK_GROUP,data).then(res=>{
			return res;
		})
	}
	
	/**
	 * 删除检查项
	 * @param {*} id
	 */
	delCheckGroup(id){
		return deletes($apiUrl.CHECK_GROUP+'/'+id).then(res=>{
			return res;
		})
	}
	
	/**
	 * 创建试题
	 * @param {*} data
	 */
	subQuestion(data){
		return post($apiUrl.CHECK_QUESTION,data).then(res=>{
			return res;
		})
	}
	/**
	 * 试题列表
	 * @param {*} data
	 */
	getQuestion(data){
		return get($apiUrl.CHECK_QUESTION,data).then(res=>{
			return res;
		})
	}
	
	/**
	 * 试题列表
	 * @param {*} id
	 */
	delQuestion(id){
		return deletes($apiUrl.CHECK_QUESTION+'/'+id).then(res=>{
			return res;
		})
	}
	/**
	 * 试题列表
	 * @param {*} data
	 */
	putQuestion(data){
		return put($apiUrl.CHECK_QUESTION,data).then(res=>{
			return res;
		})
	}
	
	/**
	 * 获取检查表格数据
	 * @param {*} data
	 */
	getAnswerData(data){
		return get($apiUrl.CHECK_ANSWER+data.activityId+"?corpCode="+data.corpCode).then(res=>{
			return res;
		})
	}
	
	/**
	 * 判断企业排查是常规排查还是检查表排查接口
	 * @param {*} data
	 */
	getCheckType(data){
		return get($apiUrl.CHECK_TYPE,data).then(res=>{
			return res;
		})
	}
	
	/**
	 * 下载检查表
	 * @param {*} data
	 * @param {*}  activityId 活动id
	 * @param {*}  corpCode 企业code
	 */
	downloadCheck(data){
		return get($apiUrl.CHECK_DOWNLOAD,data).then(res=>{
			return res;
		})
	}
}
