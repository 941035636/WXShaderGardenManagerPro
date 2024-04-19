/**新闻模块 */
//导入接口管理模块
import $apiUrl from '../api/apiUrl'
import $axios from 'axios';
import { getLogger } from '@/util/Logger'
const logger = getLogger("newsService");
export default class newsService {
	/**
	 * 获取栏目列表接口
	 * @param {*} data  获取栏目传参
	 */
	getColumnList(data) {
		return $axios({
			method: 'get',
			url:$apiUrl.columntype,
			params: data
		}).then(res => {
			return res
		})
	}
	/**
	 * 修改栏目创建类别
	 * @param {*} data 修改栏目传参
	 */
	createColumn(data) {
		return $axios({
			method: 'put',
			url: $apiUrl.newtype,
			data: data
		}).then(res => {
			return res
		})
	}
	/**
	 * 创建创建栏目创建类别
	 * @param {*} data 
	 */
	creClm(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.newtype,
			data: data
		}).then(res => {
			return res
		})
	}
	/**
	 * 删除栏目接口
	 * @param {*} id 栏目类别的id
	 */
	delColumn(id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.newtypedel,
			params: {
				id: id
			}
		}).then(res => {
			return res
		})
	}
	/**
	 * 新闻详情接口
	 * @param {*} id //新闻id
	 */
	getNewsDetail(id) {
		return $axios({
			method: 'get',
			url: $apiUrl.news_detail,
			params: {
				id: id
			}
		}).then(res => {
			return res
		})
	}

	/**
	 * 创建新闻接口
	 * @param {*} data 创建新闻传参
	 */
	createNews(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.newinfo,
			data: data
		}).then(res => {
			return res
		})
	}
	/**
	 * 修改新闻接口
	 * @param {*} data 修改新闻传参
	 */
	updateNews(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.upnewinfo,
			data: data
		}).then(res => {
			return res
		})
	}
	/**
	 * 删除新闻接口
	 * @param {*} id 新闻id
	 */
	delNews(id) {
		return $axios({
			method: 'delete',
			url: $apiUrl.newinfodel,
			params: {
				id: id
			}
		}).then(res => {
			return res
		})
	}
	/**
	 * 新闻资讯列表接口
	 * @param {*} data 获取新闻列表传参
	 */
	getNewsList(data) {
		return $axios({
			method: 'get',
			url: $apiUrl.newsManagement_list,
			params: data
		}).then(res => {
			return res
		})
  }
  getTypeList() {
		return $axios({
			method: 'get',
			url: $apiUrl.NEWLISTTYPE
		}).then(res => {
			return res
		})
  }
  


}
