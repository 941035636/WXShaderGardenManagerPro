//导入接口管理模块
import $apiUrl from "../api/apiUrl";
import $axios from "axios";
import utils from '@/util/stringHelper' 
import { getLogger } from "@/util/Logger";
import {post,get,patch,put,deletes}from '@/api/index'
const logger = getLogger("videoService");
/**
 * 视频服务
 */
export default class videoService {
	videoListInfo(
		pn = 1,
		ps = 10,
		name = "",
		typeId = "",
		uploadStartTime,
		uploadEndTime,
		orderby = "upload_time",
		desc = true
	) {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.LIST_INFO,
				method: "get",
				params: {
					pn: pn,
					ps: ps,
					name: name,
					typeId: typeId,
					uploadStartTime: uploadStartTime,
					uploadEndTime: uploadEndTime,
					orderby: orderby,
					desc: desc,
				},
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}

	videoDetail(data) {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.VIDEODETA,
				method: "get",
				params: data,
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}
	videoAddInfo(jsonObj = {}) {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.VIDEO_ADD_INFO,
				method: "post",
				data: jsonObj,
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}

	videoTypeInfo(kind = "video") {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.LIST_TYPE_INFO,
				method: "get",
				params: {
					kind: kind,
				},
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}
	//在线学习统计列表
	videoOnlineLearn(form) {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.VIDEO_LEARN,
				method: "get",
				params: form,
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}
	//根据类型查询字典表名称列表
	videoDictKind(kind = "industry") {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.LIST_TYPE_INFO,
				method: "get",
				params: {
					kind: kind,
				},
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}

	//视频项目列表初始化接口
	videoProjectList() {
		return new Promise((resolve, reject) => {
			$axios({
				url: $apiUrl.VIDEO_PRIJECT,
				method: "get",
			}).then((res) => {
				console.log(res);
				if (res.data.code == "0000") {
					resolve(res);
				} else {
					reject(res.data.msg);
				}
				return res;
			});
		});
	}
	//视频列表导出接口
	videoListExport(data) {
		return $axios({
			url: $apiUrl.VIDEO_EXPORT,
			method: "get",
			params: data,
			responseType: "arraybuffer",
		}).then((res) => {
			return res;
		});
	}
	videoSticalExport(data) {
		return $axios({
			url: $apiUrl.VIDEO_EXCEL,
			method: "get",
			params: data,
			responseType: "arraybuffer",
		}).then((res) => {
			return res;
		});
	}
  // 视频培训相关接口
	//获取视频列表
	getVideoList(data) {
		return get($apiUrl.VIDEO_LIST, data).then((res) => {
			return res;
		});
	}
	//上传视频封面
	uploadVideoImg(data) {
		return post($apiUrl.VIDEO_IMG_UPLOAD, data).then((res) => {
			return res;
		});
	}
	//添加视频
	postAddVideo(data) {
		return post($apiUrl.POST_VIDEO, data).then((res) => {
			return res;
		});
	}
	//更新视频
	putEditVideo(id, data) {
		return put($apiUrl.POST_VIDEO + "/" + id, data).then((res) => {
			return res;
		});
	}
	//删除视频
	deleteVideo(id) {
		return deletes($apiUrl.POST_VIDEO + "/" + id).then((res) => {
			return res;
		});
  }
  //证件上传
  cateUploadAuth(data,applicationName,free,businessTypeCode) { 
    return post(utils.Format($apiUrl.COM_UPLOAD_AUTH, applicationName,free,businessTypeCode), data).then(res => {
        if (res.code === '0000') {
            return res;
        }
    })
  }
}
