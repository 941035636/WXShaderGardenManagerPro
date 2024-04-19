import $apiUrl from '../api/apiUrl'
import $axios from 'axios';

export default class userManage {
	/**
	 * 新增机构
	 * @param {json} data
	 */
	addOrganization(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ORGANIZATION_SAVE + data.servicename,
			data: data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 修改机构
	 * @param {json} data
	 */
	updateOrganization(data) {
		return $axios({
			method: 'put',
			url: $apiUrl.ORGANIZATION_UPDATE + data.servicename,
			data: data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 删除机构
	 * @param {json} data
	 */
	delOrganization(servicename, id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.ORGANIZATION_DELETE + servicename + '/' + id,

		}).then(res => {
			return res.data
		})
	}
	/**
	 * 关联专员
	 * @param {json} data
	 */
	linkAccount(servicename,id,data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ACCOUNT_LINK + servicename + '/' + id,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 关联专员
	 * @param {json} data
	 */
	unlinkAccount(servicename,data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ACCOUNT_UNBOUNDE + servicename ,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 详情页已关联专员列表
	 * @param {json} data
	 */
	linkAccountList(servicename,id) {
		return $axios({
			method: 'get',
			url: $apiUrl.ACCOUNT_LINK + servicename + '/' + id,
		
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 关联产品
	 * @param {json} data
	 */
	linkAccidentPro(servicename,id,data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ACCCIDENT_PRO_LINK + servicename + '/' + id,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 修改关联产品
	 * @param {json} data
	 */
	putAccidentPro(servicename,id,data) {
		return $axios({
			method: 'put',
			url: $apiUrl.ACCCIDENT_PRO_LINK + servicename + '/' + id,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 删除关联产品
	 * @param {json} data
	 */
	delAccidentPro(servicename,id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.ACCCIDENT_PRO_LINK + servicename + '/' + id,
		
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 机构详情
	 * @param {json} data
	 */
	detailOrganization(data) {
		return $axios({
			method: 'get',
			url: $apiUrl.ORGANIZATION_DETAIL + data.servicename + '/' + data.code,

		}).then(res => {
			return res.data
		})
	}
	/**
	 * 机构列表
	 * @param {json} data
	 */
	organizationList(servicename,params) {
		return $axios({
			method: 'get',
			url: $apiUrl.ORGANIZATION_LIST + servicename,
			params
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 异步加载获取四级地址
	 * @param {json} data
	 */
	getArea(params,type) {
		return $axios({
			method: 'get',
			url: $apiUrl.AREA_GET + params+'/'+type,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 按级别查询地区
	 * @param {json} data
	 */
	getAreaLeave(params,type) {
		return $axios({
			method: 'get',
			url: $apiUrl.AREA_LEAVE_GET + type,
			params
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 获取地址name
	 * @param {json} data
	 */
	getAreaName(id) {
		return $axios({
			method: 'get',
			url: $apiUrl.AREA_NAME_GET + id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 机构列表
	 * @param {json} data
	 */
	 getEnum(params) {
		return $axios({
			method: 'get',
			url: $apiUrl.ENUM_GET,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 机构关联专家
	 * @param {json} data
	 */
	 getOrgExpert(params,servicename,id) {
		return $axios({
			method: 'get',
			url: $apiUrl.EXPERT_DETAIL_ORG+servicename+'/'+id,
			params
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 安全专家详情
	 * @param {json} data
	 */
	 getExpertDetail(id) {
		return $axios({
			method: 'get',
			url: $apiUrl.EXPERT_DETAILS+id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 删除安全专家
	 * @param {json} data
	 */
	 deleteExpert(id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.EXPERT_DELETE+id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 安全专家新增
	 * @param {json} data
	 */
	expertAdd(id,data) {
		return $axios({
			method: 'post',
			url: $apiUrl.EXPERT_ADD+id+'/'+'03',
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 安全专家列表
	 * @param {json} data
	 */
	expertList(params) {
		return $axios({
			method: 'get',
			url: $apiUrl.EXPERT_LIST,
			params
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 安全专家修改
	 * @param {json} data
	 */
	expertUpdate(data) {
		return $axios({
			method: 'put',
			url: $apiUrl.EXPERT_UPDATE,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 安全专家状态修改
	 * @param {json} data
	 */
	expertStatus(data) {
		return $axios({
			method: 'put',
			url: $apiUrl.EXPERT_STATUS,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 生产单位新增
	 * @param {json} data
	 */
	enterpriseAdd(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ENTERPRISE_ADD,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 生产单位修改
	 * @param {json} data
	 */
	enterpriseUpdate(data,id) {
		return $axios({
			method: 'put',
			url: $apiUrl.ENTERPRISE_ADD+'/'+id,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 生产单位详情
	 * @param {json} data
	 */
	enterpriseDetail(id) {
		return $axios({
			method: 'get',
			url: $apiUrl.ENTERPRISE_ADD+'/'+id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 删除生产单位
	 * @param {json} data
	 */
	enterpriseDelete(id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.ENTERPRISE_ADD+'/'+id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 生产单位列表
	 * @param {json} data
	 */
	enterpriseList(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.ENTERPRISE_LIST,
			data
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 生产单位状态修改
	 * @param {json} data
	 */
	enterpriseStatus(id) {
		return $axios({
			method: 'put',
			url: $apiUrl.ENTERPRISE_STATUS+'/'+id,
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 行业分类/管理分类
	 * @param {json} data
	 */
	dictGet(loop,id) {
		return $axios({
			method: 'get',
			url: $apiUrl.DICT_GET+loop+'/'+id,
	
		}).then(res => {
			return res.data
		})
	}
	/**
	 * 预防 / 专家库 / EHR专家库
	 * @param {json} data
	 */
	 ehrpostList(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.EHR_DATABASE,
			data
		}).then(res => {
			return res.data
		})
	}
}
