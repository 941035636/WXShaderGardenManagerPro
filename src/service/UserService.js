
// 创建 UserService 服务类
import {post,get,patch,put,deletes}from '@/api/index'
import apiUrl from '@/api/apiUrl'
import utils from '@/util/stringHelper'
import axios from 'axios'
import {getLogger} from '../util/Logger'
const logger = getLogger('UserService')
export default class UserService {

  UserService () { // 构造函数
  }

  //获取图片验证码
  getImgCode(){
	let time = new Date().getTime();
	return axios.get(apiUrl.kaptcha + time,{responseType: "arraybuffer",}).then(res => {
		let imgData = {};
		imgData.data = 'data:image/png;base64,' + btoa(
			new Uint8Array(res.data)
			.reduce((data, byte) => data + String.fromCharCode(byte), '')
		);
		imgData.header = res.headers;
		return imgData
	})
	.then(data => {
		return  data;
	})
  }
  getKaptchaImg(captchaBase64Url) {
	return axios.get(captchaBase64Url, { responseType: 'arraybuffer' }).then(response => {
		let imgData = {};
		　　imgData.data = 'data:image/png;base64,' + btoa(
	　　　　new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
	　　);
		return imgData
	}).then(data => {
		return data
	})
}
// 登录注册模块
	codeValidate (signcode) { // 图形验证码接口
		return get(apiUrl.vrifyKaptcha + '?signcode=' + signcode).then(res=>{
			return res;
		})
   	}
  	login (data,imgcode) { // 登录方法
		return post(apiUrl.loginAdmin,data,imgcode).then(res=>{
			return res;
		})
	}
  loginByToken(data) {//通过token登录
    return get(apiUrl.loginByToken,data).then(res=>{
        return res;
    })
  }
  register(data){ // 注册方法
    return post(apiUrl.register,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })

  }
  ResSmscode(username){ // 获取注册短信验证码
    return post(apiUrl.registerCode + '?phoneNum=' + username).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  valimgcode(imgcode){ // 验证图片验证码
    return get(apiUrl.registerImgCode + "?signcode=" + imgcode + "&channelNo=sequip").then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  getSmsCode(phone){ // 获取登录短信验证码
    return post(apiUrl.loginsmsCode+ "?phoneNum="+phone).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
	}
	logout(authorization = '') {	// 退出登陆	
    return post(apiUrl.LOGOUT_URL,{'authorization':authorization})
      .then(response => {
        return response
      })
  }	
  storeInfo(userCode){ // 存储企业信息
    return get(apiUrl.USER_DETAIL + '?userCode='+userCode).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })

  }
  // 找回密码
  passReturn(data){ // 找回密码
    return post(apiUrl.passwordBack,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  // 个人信息模块
  personInfo(data){ // 个人信息添加/修改
    return post(apiUrl.UserPersonal,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  personEcho(data){ // 个人信息回显
    return get(apiUrl.UserPersonal,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  // 忘记密码 身份验证模块
  authentication(data){ //验证身份
    return get(apiUrl.ServiceInterface,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
	 bindphone(data){//绑定手机号码
	  return post(apiUrl.BindPhone,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
  modfiyphone(data){//修改绑定手机号码
    return post(apiUrl.ModifyBindPhone,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  // 企业认证模块
	 authenticationSequipErpTem(data,resToken){ // 认证
		data.imageUrl1 = undefined;
		data.imageUrl2 = undefined;
		data.imageUrl3 = undefined;
	  return post(apiUrl.AUTH_ENTS,data,resToken).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
  AuthenInfo(data){ // 企业认证信息
    return get(apiUrl.COM_INFO,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  // 企业认证查询
  queryAuthentication(data){ // 企业认证信息
    return get(apiUrl.COM_AUTHENTICATION,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  IndustryField(data){ // 行业领域
    return get(apiUrl.COM_AREA,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  business(data){ // 经营数据
    return get(apiUrl.COM_AREA,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
  saveInfo(data){ // 保存基本信息
    return post(apiUrl.COM_BASEINFO,data).then(res=>{
      if(res){
        return res;
      }
    })
  }
  uploadImg(){ //上传图片
    return post(apiUrl.uploadImg,data).then(res=>{
      if(res.code === '0000'){
        return res;   
         }
    })
  }
  uploadCertif(data){ // 查询需上传证件
    return get(apiUrl.COM_CARD,data).then(res=>{
      if(res.code === '0000'){
        return res;
      }
    })
  }
	eleselect(data){ //产品电梯列表
	  return post(apiUrl.ELE_SELECT,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	batchimports(data){ //导入人员
	  return post(apiUrl.BATCHIMPORTS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }else{
				return res;
			}
	  })
	}
	batchimportss(data){ //导入人员
	  return post(apiUrl.BATCHIMPORTSS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }else{
				return res;
			}
	  })
	}
	batchele(data){ //pc批量保存电梯
	  return post(apiUrl.BATCHELE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	eledelete(data){ //删除电梯
	  return deletes(apiUrl.ELEDELETE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	selectbycode(data){ //精确查询电梯
	  return get(apiUrl.SELECTBYCODE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	seleadd(data){ //添加电梯
	  return post(apiUrl.SELEADD,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	searchAppDetailPro(data){ //投保单详情
	  return post(apiUrl.SEARCH_APPDE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	orderdetails(data){ //订单详情
	  return post(apiUrl.ORDER_DETAILS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	orderlist(data){ //订单列表
	  return get(apiUrl.SEARCH_LIST,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	cancelorder(data){ //订单取消
	  return post(apiUrl.CANCEL_ORDER,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	selectTempForm(data){ //暂存单查询
	  return post(apiUrl.SELECT_TEMPFORM,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	policylist(data){ //保单列表
	  return get(apiUrl.POLICY_LIST,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	policydetails(data){ //保单详情
	  return post(apiUrl.POLICY_DETAILS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	getArea(){ //地区三级联动
	  return get(apiUrl.getArea).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	
	elementRelaConfId(){ //获取投保人性质
	  return get(apiUrl.ELEMENYT_RELACONF_ID).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	enterprisestypes(){ //获取企业类型
	  return get(apiUrl.ELEMENYT_TYPES).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	enterprisestype(){ //获取企业星级
	  return get(apiUrl.ELEMENYT_TYPE).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	elementRelaConf(){ //获取用户类型
	  return get(apiUrl.ELEMENYT_RELACONF).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
    
  productDetalis (id = '') {  // 获取产品详情
    return get(apiUrl.PRODUCT_DETAILS, {'id': id})
      .then(response => {
        return response
      })
  }
  downLoad (id = '') {  // 文件下载
    return get(apiUrl.COM_DOWN_LOAD, {"fileId":id})
      .then(response => {
        return response
      })
  }
	template(data){ //模板下载
	  return get(apiUrl.TEMPLATE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	getInsurance(data){ //标的查询
	  return get(apiUrl.GETINSURANCE,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	premiums(data){ //批单保费计算
	  return post(apiUrl.PRODUCT_COMPUTES,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	getpolitydetails(data){ //责任险保单详情查询
	  return get(apiUrl.GETPOLICYDEATIS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	getappdetails(data){ //投保单详情
	  return get(apiUrl.APP_DETAILS,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}
	getappid(data){ //保单资源id
	  return get(apiUrl.APP_DETAILSID,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
	}

	Register(data){ //特设渠道后台注册用用户
		return post(apiUrl.REGISTER,data).then(res=>{
		  if(res.code === '0000'){
			return res;
		  }
		})
	}

	getuserlist(data){ //用户列表查询接口
		return post(apiUrl.USERLIST,data).then(res=>{
			logger.info('A0901',res,data) 
			return res;
		})
	}

	changepwd(data) { //修改登录密码
        return post(apiUrl.ModifyLoginPwd, data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
	}
	
	getDataPushList(policyNo) { //查询质监局推送信息
        return get(apiUrl.DATAPUSHLIST + '?policyNo=' + policyNo).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
	}
	
	dataPushList(applicationFormCode,productCode) { //质监局推送信息
        return get(apiUrl.DATAPUSH + '?applicationFormCode=' + applicationFormCode + '&productCode=' + productCode).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
	}
	getResToken() { // 重访攻击校验接口（用户中心获取标识）
        return axios.get(apiUrl.RESUB_TOKEN).then(res => {
            return res.data
        })
        .then(data => {
            return  data;
        })
    }
	getSerachName(data) { // 获取企业单位名称
        return get(apiUrl.SERACHNAME,data).then(res => {
			return res;
        })
        
	}
	getIP() { // 获取用户IP
        return get(apiUrl.GET_USER_IP).then(res => {
            return res;
        })
	}
	//获取第三方账号列表
	getThirdAcc(form) {
		return post(apiUrl.GET_USER_THIRD,form).then(res => {
            return res;
        })
	}
	//增加第三方账户
	addThirdAccount(data) {
		return post(apiUrl.ADD_USER_THIRD,data).then(res => {
            return res;
        })
	}
	//更新第三方账户
	updateThirdAcc(data) {
		return post(apiUrl.UPDATA_USER_THIRD,data).then(res => {
            return res;
        })
	}
	//获取数据权限
	getAuth(data) {
		return get(apiUrl.GET_USER_AUTH,data).then(res => {
            return res;
        })
	}
	getCorp(name) { // 企查猫
		return get(apiUrl.SEARCH_USER_DETAILS+name+'/cat?extendParam=%7B%22type%22%3A%22JSON%22%7D').then(res => {
			return res;
		})
	}
	//获取合同用户列表
	getCustomerList(data) {
		return post(apiUrl.CUSTOMER_LIST,data).then(res => {
						return res;
				})
	}
	//查询分支机构全面营销人员
	getUserByNo(data) {
        return get(apiUrl.GET_USERSTAFF,data).then(res => {
			return res;
		})
    }
	//获取视频列表
	getVideoList(data) {
        return get(apiUrl.VIDEO_LIST,data).then(res => {
			return res;
		})
    }
	//上传视频封面
	uploadVideoImg(data) {
		return post(apiUrl.VIDEO_IMG_UPLOAD,data).then(res => {
			return res;
		})
	}
	//添加视频
	postAddVideo(data) {
		return post(apiUrl.POST_VIDEO,data).then(res => {
			return res;
		})
	}
	//更新视频
	putEditVideo(id,data) {
		return put(apiUrl.POST_VIDEO + '/' + id,data).then(res => {
			return res;
		})
	}
	//删除视频
	deleteVideo(id) {
		return deletes(apiUrl.POST_VIDEO + '/' + id).then(res => {
			return res;
		})
	}
	// 保存星级
	saveStartLevel(data){
		return post(apiUrl.SAVE_START_LEVEL,data).then(res => {
			return res;
		})
	};
	// 变更星级
	updateStartLevel(data){
		return post(apiUrl.UPDATE_START_LEVEL,data).then(res => {
			return res;
		})
	};
	// 查询星级
  getStartLevel(params){
    return get(apiUrl.GET_START_LEVEL,params).then(res => {
      return res;
    })
  };
	//拜访所有相关下拉列表(visitMode-拜访方式 visitStage-阶段及内容)
	getVisitDist() {
        return get(apiUrl.VISIT_DIST).then(res => {
			return res;
		})
    }
	//拜访列表接口
	getVisitList(data) {
        return get(apiUrl.VISIT_LIST,data).then(res => {
			return res;
		})
    }
	//新增拜访记录
	postAddRecord(data) {
		return post(apiUrl.VISIT_ADD,data).then(res => {
			return res;
		})
	}
	//编辑拜访记录
	postEditRecord(data) {
		return post(apiUrl.VISIT_EDIT,data).then(res => {
			return res;
		})
	}
	//拜访记录详情
	getRecordDetail(data) {
		return get(apiUrl.VISIT_EDTAIL,data).then(res => {
			return res;
		})
	}
	//查询分支机构下联系人员信息
	getBranchPerson(data) {
		return get(apiUrl.BRANCH_PERSON,data).then(res => {
			return res;
		})
	}
	// 更改账号
  replaceAccount(data,toke){
    return post(apiUrl.REPLACE_ACCOUNT,data).then(res => {
			logger.info('M5-008',res,data)
      return res;
    })
  };
	 // 个人认证信息查询
	queryAuthenticationPer(data) {
		return get(apiUrl.AUTHENTAEQUIPPERSON, {...data, 'channelCode': 'sequip'}).then(res => {
				if (res.code === '0000') {
						return res;
				}
		})
	}
	cateUploadAuth(data,applicationName,free,businessTypeCode) { //证件上传
		return post(utils.Format(apiUrl.COM_UPLOAD_AUTH, applicationName,free,businessTypeCode), data).then(res => {
				if (res.code === '0000') {
						return res;
				}
		})
}
	//获取短信验证码接口
	getSMSCode(params, headers){
		return get(apiUrl.loginsmsCode,params,headers).then(res => {
			return res;
		})
	}
}


