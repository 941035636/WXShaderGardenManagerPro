import $apiUrl from '../api/apiUrl'
import $axios from 'axios';
import {
	post,
	get
} from '../api/index'
import { getLogger } from '@/util/Logger'
const logger = getLogger("userManageService");
export default class userManageService {
	/*
	 *  用户关联业务员提交 函数
	 */	
	subSalesman(params) {
		return $axios({
			method: "post",
			url: $apiUrl.BING_CONTACT_PERSON,
			data: params
		}).then(res => {
			return res
		})
  }
  
  /*
	 * 查询企业业务员信息接口 函数
	*/
	getSalesman(params) {
		return $axios({
			method: 'get',
			url: $apiUrl.GETCONTACTPERSON,
			params: params
		}).then(res => {
			return res;
		})
	}
	getBranchInfo(){
		return $axios({
			method: 'get',
			url: $apiUrl.BRANCH_INFO+"/sequip",
		}).then(res => {
			return res;
		})
	}

	getBranchDescInfo(){
		return $axios({
			method: "get",
			url: $apiUrl.BRANCH_DESC_INFO,
			params: {"channelCode": "sequip"}
		}).then(res => {
			return res;
		})
	}

	registerUser(data){
		var opData = {
			businessTypeCode: data.vo.userName, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			adminName: data.vo.name
		}
		return $axios({
			method: "post",
			url: $apiUrl.USER_REGIST,
			data: data
		}).then(res=>{
			logger.info(data.vo.id?"M2-007":"M2-006", opData);
			return res;
		}).catch(error => {
			console.error(error);
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info(data.vo.id?"M2-007":"M2-006", opData);
		})
	}

	getRegisterUserList(data){
		return $axios({
			method: "get",
			url: $apiUrl.USER_REGIST_LIST,
			params: data
		}).then(res=> {
			return res;
		})
	}

	updateUserRegisterStatus(data){
		console.log(data);
		var opData = {
			businessTypeCode: data.userLoginId, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			isUsableText: data.status === '1'?'启用': '禁用',
		}
		return $axios({
			method: "get",
			url: $apiUrl.accountStatus,
			params: data
		}).then(res=>{
			logger.info("M2-002", opData);
			return res;
		}).catch(error => {
			console.error(error);
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M2-002", opData);
		})
	}
	/**
	 * 根据excel批量添加用户
	 * @param {formdata} data 
	 */
	batchUserFile(data){
		var opData = {
			businessTypeCode: sessionStorage.getItem("loginAccount"), // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			name: sessionStorage.getItem("userName"),
			branchCompanyName: sessionStorage.getItem("branchName")
		}
		return $axios({
			method: "post",
			url: $apiUrl.BATCHADD_B,
			data: data
		}).then(res => {
			logger.info("M2-005", opData);
			return res;
		}).catch(error => {
			console.error(error);
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M2-005", opData);
		})
	}
	batchUser(method = 'get', data){
		var opData = {
			businessTypeCode: data.bl, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			companyName: data.orgName,
			creditCode: data.bl
		}
		if(method!='post'){
			return $axios({
				method: method,
				url: $apiUrl.BATCHADD,
				params: data
			}).then(res => {
				return res;
			})
		}else{
			return $axios({
				method: method,
				url: $apiUrl.BATCHADD,
				data: data
			}).then(res => {
				logger.info("M2-004", opData);
				return res;
			}).catch(error => {
				console.error(error);
				opData.operationResult = "0";
				opData.failCause = error.message?error.message:error;
				logger.info("M2-004", opData);
			})
		}
		
  }
   /**
	 * 用户审核列表
	 * @param {json} 
	 */
	getUserAuthent(params){
		return $axios({
			method: 'get',
      url: $apiUrl.REVIEW_AUTHENT,
      params:params
		}).then(res => {
			return res
		}) 
	}
	
	getOrgNameBrach(data, isLoad = false){
		return $axios({
			method: 'get',
			url: $apiUrl.ORG_NAME_BRANCH,
			params: data,
			isLoad: isLoad
		}).then(res => {
			return res;
		})
	}

	/**
	 * 修改状态
	 * @param {json} data 
	 */
	updateBlStatus(data){

		return $axios({
			method: "post",
			url: $apiUrl.BL_STATUS,
			data: data
		}).then(res => {
			return res;
		})
  }
  
  /**
	 * 用户企业详情
	 * @param {userCode} 
	 */
	getUserDetail(userCode){
    return $axios({
			method: 'get',
			url: $apiUrl.USER_DETAIL + '?userCode=' + userCode,
		}).then(res => {
			return res;
		})
  }
  
   /**
   *  获取营销人员数据
   * @param {*} 
   */
  getController(data){
    return $axios({
      method: 'get',
      url: $apiUrl.CONTROLLERLIST,
      params:data,
    }).then(res => {
      return res
    })
  }

   /**
	 * 通过员工号查询私保用户详情
	 */
	EmployeeNum(code){
    return $axios({
      method: 'get',
      url: $apiUrl.EMPLOYEENUM+'?employeeNum='+code,
    }).then(res => {
      return res
    })
  }

  /**
	 * 根据分支机构名称/编码查询分支机构信息
	 */
	getBranchDetail(code){
    return $axios({
      method: 'get',
      url: $apiUrl.GETBRANCHDETAIL+'?branchCode='+code,
    }).then(res => {
      return res
    })
  }
  /**
	 * 查询前台角色接口接口
	 */
	getQueryRoleList(params){
    return $axios({
      method: 'get',
      url: $apiUrl.GET_QUERYROLELIST,
			params
    }).then(res => {
      return res
    })
  }
  /**
	 * 查询结构类型接口
	 */
	getOrganizationList(params){
    return $axios({
      method: 'get',
      url: $apiUrl.GET_ORGANIZATION_TYPE,
			params
    }).then(res => {
      return res
    })
  }
	/**
	 * 获取用户列表
	 * @returns 
	 */
	getUserInfoList(data){
		return $axios({
			method: 'post',
			url: $apiUrl.INFOLIST,
			data
		}).then(res => {
			return res.data;
		})
	}
	// 获取机构下部门 
	getBranchTree(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.GETBRANCHTREE,
			data: data,
		}).then(res => {
			return res
		})
	};
	// 获取保险公司
	getInscompany(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.GETINSCOMPANY,
			data: data,
		}).then(res => {
			return res
		})
	};
	/**
   * 根据社会信用代码查询企业是否存在
   * @param {*} 
   */
	querAndBl(data){
		return post($apiUrl.QUERBPCANDFBL, data).then(res => {
			return res;
		})
	}
	/**
   *  认证第一步，提交基本信息
   * @param {*} 
   */
	basicInform(data,toke){
    return post($apiUrl.COM_BASEINFO,data,toke).then(res => {
      return res;
    })
  }

  /**
   *  认证第二步，提交所有信息
   * @param {*} 
   */
  subAttesInForm(data,toke){
    return post($apiUrl.COM_UPLOAD_CARD,data,toke).then(res => {
      return res;
    })
  };
	// 更改账号
  replaceAccount(data,toke){
		var opData = {
			businessTypeCode: data.beforeAccount, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			adminName: data.adminName,
			beforeAccount: data.beforeAccount,
			afterAccount: data.afterAccount
		}
		delete data.adminName
		return $axios({
			method: "post",
			url: $apiUrl.REPLACE_ACCOUNT,
			data: data
		}).then(res => {
			logger.info("M2-009", opData);
			return res.data;
		}).catch(error => {
			console.error(error);
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M2-009", opData);
		})
  };
	// 保存星级
  saveStartLevel(data,toke){
    return post($apiUrl.SAVE_START_LEVEL,data,toke).then(res => {
      return res;
    })
  };
	// 变更星级
  updateStartLevel(data,toke){
    return post($apiUrl.UPDATE_START_LEVEL,data,toke).then(res => {
      return res;
    })
  };
	// 查询星级
  getStartLevel(params){
    return get($apiUrl.GET_START_LEVEL,params).then(res => {
      return res;
    })
  };
	// 查询枚举
	getCustomerManagementEnum(){
		return post($apiUrl.CUSTOMER_MANAGEMENT_ENUM).then(res => {
			return res;
		})
	};
	// 获取客户管理列表
	getCustomerManagementList(data){
		return post($apiUrl.CUSTOMER_MANAGEMENT_LIST,data).then(res => {
			return res;
		})
	};
	// 保存客户管理信息
	postCustomerManagementCreate(data){
		return post($apiUrl.CUSTOMER_MANAGEMENT_CREATE,data).then(res => {
			return res;
		})
	};
	// 更新客户管理信息
	updateCustomerManagementCreate(data){
		return post($apiUrl.CUSTOMER_MANAGEMENT_UPDATE,data).then(res => {
			return res;
		})
	};

	// 查询拜访枚举
	getCustomerVisitEnum(){
		return post($apiUrl.CUSTOMER_VISIT_ENUM).then(res => {
			return res;
		})
	};
	// 获取拜访列表
	getCustomerVisitList(data){
		return post($apiUrl.CUSTOMER_VISIT_LIST,data).then(res => {
			return res;
		})
	};
	// 保存拜访信息
	postCustomerVisitCreate(data){
		return post($apiUrl.CUSTOMER_VISIT_SAVE,data).then(res => {
			return res;
		})
	};
	// 查询拜访信息
	postCustomerVisitDetails(data){
		return post(`${$apiUrl.CUSTOMER_VISIT_DETAILS}${data}`).then(res => {
			return res;
		})
	};
	//地区查询
    getAreas() {
		return get($apiUrl.getArea).then(res => {
			return res;
		})
	}
	//查询分支机构全面营销人员
	getUserByNo(data) {
		return get($apiUrl.GET_USERSTAFF,data).then(res => {
			return res;
		})
	}
	//查询分支机构下联系人员信息
	getBranchPerson(data) {
		return get($apiUrl.BRANCH_PERSON,data).then(res => {
			return res;
		})
	}

	//导入模板
	postCustomerExcelImport(data,channel){
		return post($apiUrl.CUSTOMER_MANAGEMENT_IMPORT+`/${channel}`,data).then(res => {
			return res;
		})
	};
	//导出模板
	postCustomerExcelExport(data) {

		return $axios({
			method: 'post',
			url: $apiUrl.CUSTOMER_MANAGEMENT_EXPORT,
			data: data,
			responseType: "arraybuffer"
		}).then(res => {
			return res
		})
	};
	
	postVisitExport(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.CUSTOMER_VISIT_VISITEXPORT,
			data: data,
			responseType: "arraybuffer"
		}).then(res => {
			return res
		})
		
	};
	// 拜访图片日志
	caseLogInserlog(data) {
		return $axios({
			method: 'post',
			url: $apiUrl.CASE_LOG_INSERTLOG,
			data: data,
		}).then(res => {
			return res
		})
		
	};


}