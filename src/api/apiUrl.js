/*
 *接口名称管理及不同服务接口服务配置文件
 * @version 1.0.0
 * @edit: quweina
 */
if (process.env.NODE_ENV === 'development') {
    //本地开发
    var root = '/api';
    // var base = "http://gw-dev.jiangtai.com";
    var base = "/restApi";
    var ROOT_TESHE = base + "/sequip-svc"; //  特设地址    
    // var ROOT_TESHE = "/rest"; //  特设地址
    var ROOT_PRODUCT = base + "/prod-svc"; // 产品中心
    var ROOT_USER = base + "/user-svc"; // 用户中心
    var POOT_ORDER = base + "/ins-order"; //订单中心
    var ROOT_TOUBAO = base + "/ins-svc"; // 投保中心
    var ROOT_POL = base + "/pol-svc"; // 批单
    var ROOT_RESOURCE = base + "/res-svc";
    var ROOT_RESOURCE_NEW = base;
    var login = base + '/user-svc' //大平台登录
    var codeimgUrl = base + '/user-svc'; //验证码图片
    var insurance = base + "/es-svc"; // 投保轨迹
    var ROOT_INV = base + "/invoice-svc"; // 发票
    // var ROOT_CASE = base + '/case-svc'; // 案件
    var ROOT_CASE = base + '/abts-case-svc'; // 案件
    // var ROOT_CASE1 = 'http://10.10.71.97:6250'; // 案件
    // var ROOT_CASE = 'http://10.10.71.136:6250'; // 案件
    var ROOT_SATS = base + "/statistic-svc"; // 数据中心
    var ROOT_TESHE_PWEB = "http://sequip-pweb-dev.jiangtai.com/#/"; //  特设地址pweb网址
    var ROOT_TESHE_ENT_WEB = "http://sequip-ent-web-dev.jiangtai.com/#/"; //  特设地址ent-web网址
    // var ROOT_TESHE_PWEB ="http://localhost:8080/#/"; //  特设地址pweb网址
    var POOT_RECTIFY = "http://10.10.71.97:6343";
    var POOT_RECTIFY = base + "/abts-svc";
    var ROOT_BMS = '/bms-api'; //业务结算状态查询
    var ROOT_LOG = base + '/record-svc'; // 日志
    var DOMAIN_NAME = '.jiangtai.com';
    var ROOT_YG = base + "/sttl-man"; // 业务结算平台
    var ROOT_ANBAO = base + "/safety-man"; //  安保地址
    var ROOT_MDM = base + "/mdm-svc";
    var ROOT_EBAO = base + "/jtpf/ebao-svc";
    var EBAO_CASE_SVC = base + "/ebao-case-svc"; // e保后台
    var ROOT_PHONE = 'http://sequip-ent-web-dev.jiangtai.com/#/';
} else if (process.env.NODE_ENV === 'start') {
    //线上dev
    var root = process.env.ROOT_TESHE; //根服务
    // var base = "http://gw-dev.jiangtai.com";
    var base = "/_gw";
    var ROOT_TESHE = base + "/sequip-svc"; //  特设地址
    var ROOT_PRODUCT = base + "/prod-svc"; // 产品中心
    var ROOT_USER = base + "/user-svc"; // 用户中心
    var POOT_ORDER = base + "/ins-order"; //订单中心
    var ROOT_TOUBAO = base + "/ins-svc"; // 投保中心
    var ROOT_POL = base + "/pol-svc"; // 批单
    var ROOT_RESOURCE = base + "/res-svc";
    var ROOT_RESOURCE_NEW = base;
    var insurance = base + "/es-svc"; // 投保轨迹
    var login = base + '/user-svc' //大平台登录
    var codeimgUrl = base + '/user-svc'; //验证码图片
    var ROOT_INV = base + "/invoice-svc"; // 发票
    // var ROOT_CASE = base + '/case-svc'; // 案件
    var ROOT_CASE = base + '/abts-case-svc'; // 案件
    var ROOT_SATS = base + "/statistic-svc"; // 数据中心
    var ROOT_TESHE_PWEB = "//sequip-pweb-dev.jiangtai.com/#/"; //  特设地址pweb网址
    var ROOT_TESHE_ENT_WEB = "http://sequip-ent-web-dev.jiangtai.com/#/"; //  特设地址ent-web网址
    var ROOT_LOG = base + '/record-svc'; // 日志
    var POOT_RECTIFY = base + "/abts-svc";
    var ROOT_BMS = base + '/bms-api'; //业务结算状态查询
    var DOMAIN_NAME = '.jiangtai.com';
    var ROOT_YG = base + "/sttl-man"; // 业务结算平台
    var ROOT_ANBAO = base + "/safety-man"; //  安保地址
    var ROOT_MDM = base + "/mdm-svc";
    var ROOT_EBAO = base + "/jtpf/ebao-svc";
    var EBAO_CASE_SVC = base + "/ebao-case-svc"; // e保后台
    var ROOT_PHONE = 'http://sequip-ent-web-dev.jiangtai.com/#/';
}
if (process.env.NODE_ENV === 'test') {
    //线上测试
    var root = process.env.ROOT_TESHE; //根服务
    // const base = "http://gw-test.jiangtai.com";
    const base = "/_gw";
    var ROOT_TESHE = base + "/sequip-svc"; //  特设地址
    var ROOT_PRODUCT = base + "/prod-svc"; // 产品中心
    var ROOT_USER = base + "/user-svc"; // 用户中心
    var POOT_ORDER = base + "/ins-order"; //订单中心
    var ROOT_TOUBAO = base + "/ins-svc"; // 投保中心
    var ROOT_POL = base + "/pol-svc"; // 批单
    var ROOT_RESOURCE = base + "/res-svc";
    var ROOT_RESOURCE_NEW = base;
    var insurance = base + "/es-svc"; // 投保轨迹
    var login = base + '/user-svc' //大平台登录
    var codeimgUrl = base + '/user-svc'; //验证码图片
    var ROOT_INV = base + "/invoice-svc"; // 发票
    // var ROOT_CASE = base + "/case-svc"; // 案件
    var ROOT_CASE = base + "/abts-case-svc"; // 案件
    var ROOT_SATS = base + "/statistic-svc"; // 数据中心
    var ROOT_TESHE_PWEB = "//sequip-pweb-test.jiangtai.com/#/"; //  特设地址pweb网址
    var ROOT_TESHE_ENT_WEB = "http://sequip-ent-web-test.jiangtai.com/#/"; //  特设地址ent-web网址
    var ROOT_LOG = base + '/record-svc'; // 日志
    var POOT_RECTIFY = base + "/abts-svc";
    var ROOT_BMS = base + '/bms-api'; //业务结算状态查询
    var DOMAIN_NAME = '.jiangtai.com';
    var ROOT_YG = base + "/sttl-man"; // 业务结算平台
    var ROOT_ANBAO = base + "/safety-man"; //  安保地址
    var ROOT_MDM = base + "/mdm-svc";
    var ROOT_EBAO = base + "/jtpf/ebao-svc";
    var EBAO_CASE_SVC = base + "/ebao-case-svc"; // e保后台
    var ROOT_PHONE = 'http://sequip-ent-web-test.jiangtai.com/#/';
} else if (process.env.NODE_ENV === 'pre') {
    //预生产
    var root = process.env.ROOT_TESHE; //根服务
    var base = "http://gw-pre.jiangtai.com";
    var ROOT_TESHE = base + "/sequip-svc"; //  特设地址
    var ROOT_PRODUCT = base + "/prod-svc"; // 产品中心
    var ROOT_USER = base + "/user-svc"; // 用户中心
    var POOT_ORDER = base + "/ins-order"; //订单中心
    var ROOT_TOUBAO = base + "/ins-svc"; // 投保中心
    var ROOT_POL = base + "/pol-svc"; // 批单
    var ROOT_RESOURCE = base + "/res-svc";
    var ROOT_RESOURCE_NEW = base;
    var insurance = base + "/es-svc"; // 投保轨迹
    var login = base + '/user-svc' //大平台登录
    var codeimgUrl = base + '/user-svc'; //验证码图片
    var ROOT_INV = base + "/invoice-svc"; // 发票
    // var ROOT_CASE = base + '/case-svc'; // 案件
    var ROOT_CASE = base + '/abts-case-svc'; // 案件
    var ROOT_SATS = base + "/statistic-svc"; // 数据中心
    var ROOT_TESHE_PWEB = "http://sequip-pweb-pre.jiangtai.com/#/"; //  特设地址pweb网址
    var ROOT_TESHE_ENT_WEB = "http://sequip-ent-web-pre.jiangtai.com/#/"; //  特设地址ent-web网址
    var ROOT_LOG = 'http://gw.jiangtai.com/record-svc'; // 日志
    var ROOT_ABTS = base + "/abts-svc";
    var ROOT_BMS = base + '/bms-api'; //业务结算状态查询
    var DOMAIN_NAME = '.jiangtai.com';
    var ROOT_YG = base + "/sttl-man"; // 业务结算平台
    var ROOT_ANBAO = base + "/safety-man"; //  安保地址
    var ROOT_MDM = base + "/mdm-svc";
    var ROOT_EBAO = base + "/jtpf/ebao-svc";
    var EBAO_CASE_SVC = base + "/ebao-case-svc"; // e保后台
    var ROOT_PHONE = 'http://sequip-ent-web-pre.jiangtai.com/#/';
} else if (process.env.NODE_ENV === 'production') {
    //生产
    var root = process.env.ROOT_TESHE; //根服务
    var base = "/_gw";
    var ROOT_TESHE = base + "/sequip-svc"; //  特设地址
    var ROOT_PRODUCT = base + "/prod-svc"; // 产品中心
    var ROOT_USER = base + "/user-svc"; // 用户中心
    var POOT_ORDER = base + "/ins-order"; //订单中心
    var ROOT_TOUBAO = base + "/ins-svc"; // 投保中心
    var ROOT_POL = base + "/pol-svc"; // 批单
    var ROOT_RESOURCE = base + "/res-svc";
    var ROOT_RESOURCE_NEW = base;
    var insurance = base + "/es-svc"; // 投保轨迹
    var login = base + '/user-svc' //大平台登录
    var codeimgUrl = base + '/user-svc'; //验证码图片
    var ROOT_INV = base + "/invoice-svc"; // 发票
    // var ROOT_CASE = base + "/case-svc"; // 案件
    var ROOT_CASE = base + "/abts-case-svc"; // 案件
    var ROOT_SATS = base + "/statistic-svc"; // 数据中心
    var ROOT_TESHE_PWEB = "//www.chinasequipins.com/#/"; //  特设地址pweb网址
    var ROOT_TESHE_ENT_WEB = "http://ent-web.chinasequipins.com/#/"; //  特设地址ent-web网址
    var ROOT_LOG = base + '/record-svc'; // 日志
    var POOT_RECTIFY = base + "/abts-svc";
    var ROOT_BMS = base + '/bms-api'; //业务结算状态查询
    var DOMAIN_NAME = '.chinasequipins.com';
    var ROOT_YG = base + "/sttl-man"; // 业务结算平台
    var ROOT_ANBAO = base + "/safety-man"; //  安保地址
    var ROOT_MDM = base + "/mdm-svc";
    var ROOT_EBAO = base + "/jtpf/ebao-svc";
    var EBAO_CASE_SVC = base + "/ebao-case-svc"; // e保后台
    var ROOT_PHONE = 'http://ent-web.chinasequipins.com/#/';
}

let loginUrl = {
    //登录模块
    loginAdmin: ROOT_USER + '/api/v1/login', //登录接口
    loginOut: ROOT_USER + '/api/v1/loginOut', //取消登录
    // kaptcha: ROOT_USER + '/api/v1.5/kaptcha?timestamp=', //验证码获取
    kaptcha: ROOT_USER + '/api/v2/kaptcha?timestamp=', //验证码获取
    vrifyKaptcha: ROOT_USER + '/api/v1.5/vrifyKaptcha', // 验证码验证
    customerUrl: ROOT_USER + '/api/v1/selectChannelManager', //根据角色和分支机构编码查询人员
    // ModifyLoginPwd: ROOT_USER + '/api/v1/changePassword' //修改登录密码(POST)
    ModifyLoginPwd: ROOT_USER + '/api/v1.5/changePassword', //修改登录密码(POST)
    GET_USER_IP: ROOT_TESHE + '/api/v1/util/getIpAddress', //获取用户ip
    GET_USER_THIRD: ROOT_TESHE + '/api/v1/iot/selectList', //获取第三方账号
    ADD_USER_THIRD: ROOT_TESHE + '/api/v1/iot/register', //新增第三方账号
    UPDATA_USER_THIRD: ROOT_TESHE + '/api/v1/iot/update', //更新第三方账号
    BRANCH_INFO: ROOT_USER + '/api/v1/user/branchInfoByChannel', // 获取分支机构
    GETBRANCHTREE:ROOT_USER +'/api/v1/dyna_query/list/user_getBranchTreeByParentCode', // 获取分支机构下部门
    BRANCH_INFO_NEW: ROOT_USER + '/api/v1/getJtBranchByChannel', // 获取分支机构
    GET_USER_AUTH: ROOT_USER + '/api/v1/queryUserRoleAndAuthority', //获取数据权限接口
    SAVE_START_LEVEL: ROOT_USER + "/api/v1/saveStartLevel", // 保存客户星级
    UPDATE_START_LEVEL: ROOT_USER + "/api/v1/updateStartLevel", // 修改客户星级
    REPLACE_ACCOUNT: ROOT_USER + "/api/v1/replaceAccount", // 更改用户账号
    GET_START_LEVEL: login + "/api/v1/getStartLevel", // 查询客户星级
    loginsmsCode: ROOT_USER + '/api/v1.5/regMsg', //登录短信验证码接口(POST)
}

let accidentUrl = {
    // 事故预防
    listinit: root + '/acdentpre/v1/listinit', //事故预防申请查询页的参数初始化接口
    list: root + '/acdentpre/v1/list', //查询事故预防申请列表接口
    create: root + '/acdentpre/v1/create', //创建事故预防申请接口
    acdappinit: root + '/acdentpre/v1/acdappinit', //事故预防初始化
    corps: root + '/acdentpre/v1/corps', //企业列表
    prefund: root + '/acdentpre/v1/prefund', //可支出金额
    detail: root + '/acdentpre/v1/detail', //查询事故预防申请详情接口
    popuapplymodify: root + '/acdentpre/v1/popuapplymodify', // 业务员预防申请修改
    applymodify: root + '/acdentapprove/v1/applymodify', //专员预防申请修改
    accident_applydelete: root + '/acdentapprove/v1/applydelete', // (取消按钮)	专员预防申请删除
    approve: root + '/acdentapprove/v1/approve', // 预防申请审核接口
    operate: root + '/acdentapprove/v1/operate', // 审批流程按钮接口

}
let InsuranceUrl = {
    // 事故预防
    // lists: insurance + '/data/sequip_ins_trace/search', //投保轨迹数据查询服务接口
    lists: insurance + '/api/v2/data/sequip_ins_trace/search', //投保轨迹数据查询服务接口

}

let areasUrl = { // 地区查询
    getArea: ROOT_USER + '/api/v1/getArea/0',
    GETAREAUSER: ROOT_USER + '/api/v1/getArea',
    getBranchByCode: ROOT_USER + '/api/v1/selectBranchDetailVO',//根据分支机构编码查询分支机构信息
}
let elevatorUrl = { // 电梯
    getElevator: ROOT_TESHE + '/api/v1/elevatorEquipments', // 电梯列表
    getApplication: ROOT_TESHE + '/api/v1/policy/equimentGetPolicy', //根据电梯编号,出厂编号查询保单
    getAppDetailPro: ROOT_TOUBAO + '/applicationforms/searchAppDetailPro', // 投保单详情查询
    getInsurance: ROOT_TOUBAO + '/insurance_objects', //投保单号查询电梯
    GETINSURANCE: ROOT_TOUBAO + '/insurance_objects', //投保单号查询标的
    modifyElevator: ROOT_TESHE + '/api/v1/elevatorEquipments/update', // 修改电梯信息
    CABLEWAYLIST: ROOT_TESHE + '/api/v1/cablewayEquioments/list', // 索道列表
    ELEVSTATIS: ROOT_TESHE + '/api/v1/equipmentsCount/select', // 全国电梯保有量
    ELEEXPORT: ROOT_TESHE + '/api/v1/equipmentsCount/export', // pc端全国电梯保有量导出
    ELEDETAILS: ROOT_TESHE + '/api/v1/elevatorEquipments/selectOne', // 电梯详情
    EQUIPMENTDATAENTRY: ROOT_TESHE + '/api/v1/equipmentsCount', // 设备数据录入
    MODIFYUPDATE: ROOT_TESHE + '/api/v1/equipmentsCount', // 设备数据更新
    DELETEINFO: ROOT_TESHE + '/api/v1/equipmentsCount', // 设备数据删除
    COMPENSATION: ROOT_TESHE + '/api/v1/payoutInfo/selectPayoutByeID', // 赔付信息查询
    ELEVATOR_ADD: ROOT_TESHE + '/api/v1/elevatorEquipments/insert', // 增加电梯
    DOWNLODA_FILE: ROOT_TESHE + '/api/v1/templateDownload/downloadFile', // 下载模版
    NEW_TEMPLATE: ROOT_TESHE + '/api/v1/templateDownload', // 模板下载
    ELEVATOR_DETAILS: ROOT_TESHE + '/api/v1/elevatorEquipments/selectOne', // 电梯详情接口
    NEWCABLEWAY: ROOT_TESHE + '/api/v1/cablewayEquioments', // 新增索道信息
    DELETECABLEWAY: ROOT_TESHE + '/api/v1/cablewayEquioments', // 删除索道信息
    MODIFYCABLEWAY: ROOT_TESHE + '/api/v1/cablewayEquioments', // 修改索道信息
    NEWADDED: ROOT_TESHE + '/api/v1/payoutInfo/insertPayout', // 添加赔付信息
    TOUPDATE: ROOT_TESHE + '/api/v1/payoutInfo/updatePayout', // 更新赔付信息
    deletePayoutByID: ROOT_TESHE + '/api/v1/payoutInfo/deletePayoutByID', // 根据索道ID删除赔付信息
    RESOURCEID: ROOT_TOUBAO + '/bind_resources/res/elevator/', // 根据标的ID查询资源ID
    QUERYRES: ROOT_TOUBAO + '/bind_resources/res', // 广东电梯新产品查询资源ID
    NEW_TEMPLATE: ROOT_TESHE + '/api/v1/templateDownload', // 模板下载
    DOWNLODA_PD_TEM: ROOT_TESHE + '/api/v1/templateImport/addPdElevatorExcel', // 批单补录清单上传
    DOWNLODA_PD_TEM_GZ: ROOT_TESHE + '/api/v1/templateImport/addUserExcel', // 批单补录清单上传-雇主
    POSTPOLICYBYCODE: ROOT_TOUBAO + '/report/reportInsuranceObjectPolicy/v1',
    POSTPOLICYBYCODETY: ROOT_TOUBAO + '/report/reportPersonnelPolicy/v1',
    POLICYSEMPLOY: ROOT_TESHE + '/api/v1/policy/employeeGetPolicy', //根据人员编号查询保单
    POSTEMPLOYEELIST: ROOT_TESHE + '/api/v1/subject/getEmployeeList', //标的查询-人员
    POSTSEQUIPSEARCHLIST: ROOT_TESHE + '/api/v1/subject/getElevatorList', //标的查询-电梯
    POSTPROPERTYLIST: ROOT_TESHE + '/api/v1/subject/getPropertyList', //标的查询-物业
    GET_CABLEWAY_LIST: ROOT_TESHE + '/api/v1/subject/getCablewayList', //标的查询-索道
    GET_SHOP_LIST: ROOT_TESHE + '/api/v1/subject/getShopList', //标的查询-索道
    POSTCONDETAIL: ROOT_MDM + '/api/v1/dyna_query/one/contractDetails',//委托协议详情
    POSTCONDOWNLOAD: ROOT_MDM + '/api/v1/contract/file/download?fileId=',//委托协议下载
}
let productUrl = {
    PRODUCT_DISPLAY: ROOT_PRODUCT + '/api/v1/product_display', // 产品
    searchAppList: ROOT_TESHE + '/api/v1/policy/getPolicyList', //投保单列表
    searchComAppList: ROOT_TOUBAO + '/applicationforms/med/manager/wyb', //合作渠道投保单列表,
    searchAppLists: ROOT_TESHE + '/api/v1/policy/getPolicyCablewayList', //管理端索道投保单列表查询
    PRO_LIST: ROOT_PRODUCT + '/product_channel/sequip', // 产品列表页
    PRO_LIST_V3: ROOT_PRODUCT + '/api/v3/product_channel/sequip', // 产品列表页
    searchAppDETAILS: ROOT_TOUBAO + '/applicationforms/searchAppDetailPro', //投保单详情
    modifypremium: ROOT_TESHE + '/api/v1/policy/updateElevatorPrem', // 修改保费接口
    appCodeAuth: ROOT_TOUBAO + '/applicationforms/updateApplicationStatus', //审核投保单
    APPLICATION_FORMS: ROOT_TOUBAO + '/risks/prems', // 修改保费接口
    UPDATE_PREMIUM_FACTORS: ROOT_TOUBAO + '/applicationforms/updatePremiumFactor/00/', // 修改保费因子
    PRODUCT_DETAILS: ROOT_PRODUCT + '/productdetailsvc', // 产品详情页
    PRODUCT_COMPUTE: ROOT_PRODUCT + '/calpremiums', // 保费计算
    SUBMIT_ORDER: POOT_ORDER + '/order/submitOrder', // 提交订单
    PRE_RECORD: ROOT_TESHE + '/api/v1/preRecord', // 预录接口保存（电梯）
    SAVE_TEMPFORM: POOT_ORDER + '/order/saveTempForm', // 预录的流水号
    PRE_RECORDID: ROOT_TESHE + '/api/v1/preRecord/', // 预录单条查询
    APP_DETAILSID: ROOT_TESHE + '/api/v1/policy/getResourceID', // 保单资源id
    DETAILSPOLICY: ROOT_TOUBAO + '/assembly/generateHtml/', // 投保单html页面
    PRE_RECORDS: ROOT_TESHE + '/api/v1/preRecord', //投保单预录更新
    DELETES_RECORDS: ROOT_TESHE + '/api/v1/preRecord/', //投保单预录删除
    PAYMENTNOTICE: ROOT_TESHE + '/api/v1/email/sendPay', //通知用户支付投保单
    CHECKINVOICE: ROOT_INV + '/invoice/manageSequipQueryInvoicePolicyList', //特设查询待开票查询接口
    BINDINVOICE: ROOT_TESHE + '/api/v1/invoice/bind', //上传发票信息
    XIAZAIFAPIAO: ROOT_INV + "/invoice/invoiceSequipExport", //发票导出
    PATINTO: ROOT_TESHE + '/api/v1/pay/payOrderApplicant', //支付中心订单数据查询
    PATINTO_ONLINE: POOT_RECTIFY + '/pay/v1/trades',
    PATINTO_ONLINE_EXPORT: POOT_RECTIFY + '/pay/v1/trades_download',
    TEMPLATEDOWNLOAD: ROOT_TESHE + '/api/v1/templateDownload',
    POST_RECONCILIATION: ROOT_TESHE + '/api/v1/reconciliation',
    PATOUT: ROOT_TESHE + '/api/v1/pay/exportPayOrderApplicant', //支付中心订单数据导出
    PATOUTS: ROOT_TOUBAO + '/applicationforms/tour/issue/fail/', //报文失败原因
    FAILUREPACKET: ROOT_TESHE + '/api/v1/policy/getIssueFailData', //根据投保单号查询出但失败的报文
    DATAPUSHLIST: ROOT_TESHE + '/api/v1/pushrecord/list', //查询质监局推送信息
    DATAPUSH: ROOT_TESHE + '/api/v1/pushrecord/push', //质监局推送信息
    ISREPUSH: ROOT_TOUBAO + '/issuelog/repush', //出单重推
    LiftStatistics: ROOT_TESHE + '/api/v1/policy/getStatistics', //管理端电梯投保单查询统计信息
    CHECKINVOICES: ROOT_TOUBAO + '/common/invoice/00/', //发票信息查询
    PAY_INFO: ROOT_USER + '/api/v1.5/user/branchAccount', //根据产品编码查线下支付账户
    GET_AREA: ROOT_USER + '/api/v1/user/getAreaInfoList',//获取地区信息
    INVOICEDOWNLOAD: ROOT_INV + '/invoice/fileId/download', // 发票返回下载地址接口
    POSTELEVATORSEQUEL: ROOT_TOUBAO + '/applicationforms/sequip/elevatorSequel/', // 追加设备接口
    GETPOLICYFACTORSDETAILS: POOT_ORDER + '/order/getSpecialCalculatePremiumReq/00/', // 获取投保单详情
    DOWNLOAD_RIDER: ROOT_POL + '/endorsement/v2/queryEndorsementFile',
    RISK_DISPLAY: ROOT_PRODUCT + '/api/v1/risk_display',
    POLICYSUPPLEMENT: ROOT_TESHE + '/api/v1/order/offlineRecord', // 线下录单-录入
    POLICYSUPPLEMENTLIST: ROOT_TESHE + '/api/v1/order/offlineRecordList', // 线下录单列表查询
}

let prerecordedUrl = {
    AUTHENTAEQUIP: ROOT_USER + '/api/v1/authentSequipInfo', // 获取认证信息
    AUTHENTAEQUIPPERSON: ROOT_USER + '/api/v1/queryPersonalUserAuthenInfo', // 获取认证信息-个人
    PRERECORD_LIST: ROOT_TESHE + '/api/v1/preRecord/List', // 预录单列表
    CUSTOMER_LIST: ROOT_TESHE + '/api/v1/order/getUpdateCustomerRecord', // 合同用户列表
}
// 资源接口地址
let resourcesUrl = {
    BATCH_UPLOAD: ROOT_RESOURCE + '/res/v3/batchupload',  //文件上传（新）
    DOWNLOAD_FILE: ROOT_RESOURCE + '/res/v3/download', // 文件下载
    VIDEO_LIST: POOT_RECTIFY + '/media/v1/video/sequip', // 视频列表
    VIDEO_IMG_UPLOAD: POOT_RECTIFY + '/v1/file/17', // 视频封面图片上传
    POST_VIDEO: POOT_RECTIFY + '/media/v1/video/sequip', // 共享视频上传保存
    SHARE_URL: ROOT_PHONE,
    VISIT_DIST: ROOT_TESHE + '/visit/v1/drop-down/list', //拜访所有相关下拉列表
    VISIT_LIST: ROOT_TESHE + '/visit/v1/list', //拜访列表
    VISIT_ADD: ROOT_TESHE + '/visit/v1/create', //新增拜访
    VISIT_EDIT: ROOT_TESHE + '/visit/v1/alter', //编辑拜访
    VISIT_EDTAIL: ROOT_TESHE + '/visit/v1/detail', //拜访记录详情
    BRANCH_PERSON: ROOT_USER + '/api/v1/queryContactPerson', // 查询分支机构下联系人员信息
    EXPORTSS_VISIT: ROOT_TESHE + '/visit/v1/visit/report', //拜访导出接口
}
let usercenterUrl = {
    COM_INDENT: ROOT_RESOURCE + '/res/download?fileId=', // 图片回显（接口废弃）
    COM_INDENT1: ROOT_RESOURCE, // 下载资源地址
    SHOW_VIDEO: ROOT_RESOURCE + '/res/v3/download?free=1&fileId=', // 视频地址
    COM_UPLOAD: ROOT_RESOURCE + '/res/batchupload', // 图片上传
    COM_UPLOAD_AUTH: ROOT_RESOURCE + '/res/v3/batchupload?applicationName={0}&free={1}&businessTypeCode={2}', // 图片上传
    COM_INDENT_SHOW: ROOT_RESOURCE_NEW, //新的图片回显地址
    USERLIST: ROOT_USER + '/api/sequipUserList', // 用户列表查询
    USERLOGIN: ROOT_USER + '/api/loginLog', // 账号状态修改
    USERINFO: ROOT_USER + '/api/v1/user/userInfo', // 用户基本信息查询
    ELEMENYT_RELACONF_ID: ROOT_USER + '/api/v1.5/orgElementList/sequip?elementRelaConfId=21', // 投保人性质 (GET)
    ELEMENYT_TYPES: ROOT_USER + '/api/v1.5/orgElementList/sequip?elementRelaConfId=38', // 企业类型 (GET)
    ELEMENYT_RELACONF: ROOT_USER + '/api/v1.5/orgElementList/sequip?elementRelaConfId=22', // 用户类型 (GET)
    MEMBERSHIPTYPE: ROOT_USER + '/api/v1.5/orgElementList/sequip?elementRelaConfId=44', // 会员类型 (GET)
    AUTH_ENTS: ROOT_USER + '/api/v1/authenticationSequipErpTem', // 认证
    COM_AUTHENTICATION: ROOT_USER + '/api/v1/authentSequipInfo', // 认证信息查询
    ENTERPRISESTAR: ROOT_USER + '/api/getSequipVipTypeList', // 特设查询会员列表
    REVISINGENTERPRISES: ROOT_USER + '/api/v1/sequipChangeVipType', // 特设渠道修改会员类型
    ELEMENYT_TYPE: ROOT_USER + '/api/v1.5/orgElementList/sequip?elementRelaConfId=39', // 企业星级 (GET)
    RESETPASSWORD: ROOT_USER + '/api/v1/resetPassword', // 重置密码
    REGISTER: ROOT_USER + '/api/v1/sequipRegister', // 特设渠道后台注册用用户
    REGISTER_LD: ROOT_USER + '/api/v1/syncCustomerData', // 特设渠道线下录单新增用户
    RESUB_TOKEN: ROOT_RESOURCE_NEW + '/idg-svc/api/v1/resub_token', // 重访攻击校验接口（用户中心获取标识）
    SERACHNAME: ROOT_USER + '/api/v1/orgInfoByNameAndBranch', // 模糊搜索企业名称
    SEARCH_USER_DETAILS: ROOT_ANBAO + '/corp/v1/deatils/', // 企查猫
    GET_USERSTAFF: ROOT_USER + '/api/v1/controllerList', // 查询全面营销人员信息
}
let Approval = {
    APPROVALTIME: ROOT_POL + '/liabilitySvc/v1/queryLiabilityPolDetail', //批单保单详情
    APPROVALDATALIST: ROOT_POL + '/specialSvc/querySpecialEndorsementList', //批单列表
    APPROVALDATALISTS: ROOT_POL + '/specialSvc/querySpecialInsuranceObject', //根据批单申请号查询标的信息
    APPROVAL: ROOT_POL + '/specialSvc/v1/querySpecialEquipmentEndorseDetail', //特设批单详情
    APPROVALPAY: ROOT_POL + '/endorsement/endorsPremiumConfirm', //批单保费到账确认
    Informationinput: ROOT_POL + '/endorsement/v1/entryEndorsementNo', //出单后批单号等批单信息录入
    submitEndors: ROOT_POL + '/endorsement/v2/submitEndors', //批单申请提交接口
    TestingUniqueness: ROOT_POL + '/liabilitySvc/v1/validEndorsementsNoUniq', //校验渠道批单号唯一性
    Batchlistpush: ROOT_TESHE + '/api/v1/batchProcessing/pd', //通过投保单号处理批单数据
    POLICYDETAILS: ROOT_TOUBAO + '/policy/searchPolDetailNew', // 保单详情
    BATCH_DETAIL: ROOT_POL + '/specialSvc/v1/querySpecialEquipmentEndorseDetail', //查询批单详情接口
    PDSHENHE: ROOT_POL + '/endorsement/v1/endorsementAudit', //批单审核
    POSTSEQUIPLIST: ROOT_TESHE + '/api/v1/endorsementElevator/insert', //批单上传设备清单
    POSTSEQUIPDATALIST: ROOT_TESHE + '/api/v1/endorsementElevator/selectList', //批单补录清单列表
    POSTPERSONLIST: ROOT_TESHE + '//api/v1/endorsementEmployee/insert', //批单上传人员清单
    POSTPERSONDATALIST: ROOT_TESHE + '/api/v1/endorsementEmployee/selectList', //批单补录清单列表-人员
    POSTSENDEMAIL: ROOT_TESHE + '/api/v1/ele/renewalRemind', //续保提醒发送邮件
    POSTPUSHLOGS: ROOT_TESHE + '/api/v1/renewal/logList', //续保提醒日志列表
    POSTEMAILLIST: ROOT_TESHE + '/api/v1/emailConfig/list', //查询邮件配置列表
    POSTADDEMAILLIST: ROOT_TESHE + '/api/v1/emailConfig/insert', //新增续保邮件配置
    POSTUPDATEEMAILLIST: ROOT_TESHE + '/api/v1/emailConfig/update', //修改续保邮件配置
    ELEVATOREXPORT: ROOT_TESHE + '/api/v1/subject/elevatorExport', // 设备清单最终导出
    EMPLOYEEEXPORT: ROOT_TESHE + '/api/v1/subject/employeeExport', // 人员清单最终导出
    PROPERTYEXPORT: ROOT_TESHE + '/api/v1/subject/propertyExport', // 人员清单最终导出
    CABLEWAYEXPORT: ROOT_TESHE + '/api/v1/subject/cablewayExport', // 索道清单最终导出
    SHOPEXPORT: ROOT_TESHE + '/api/v1/subject/shopExport', // 商铺清单最终导出
}
let InsurancepolicyUrl = {
    BINDRES: ROOT_TOUBAO + '/bind_resources', //绑定资源ID关联关系
    PREMIUMACCE: ROOT_TESHE + '/api/v1/order/confirmAmount', //保费到账
    POLICYUPLOAD: ROOT_TESHE + '/api/v1/order/offlineIssue', //保单上传
    EXPORTSS: ROOT_TESHE + '/api/v1/policy/exportPolicyList', //导出投保单
    EXPORTSSC: ROOT_TESHE + '/api/v1/policy/exportCablewayPolicyList', //管理端导出投保单列表
    EXPORTEQUIPMENT: ROOT_TESHE + '/api/v1/elevatorEquipments/exportManagerExportElevator', //导出设备
    NationalElevator: ROOT_TESHE + '/api/v1/elevatorData/getNationalElevator', //全国电梯投保概览
    ProvinceElevator: ROOT_TESHE + '/api/v1/elevatorData/getProvinceElevator', //全国电梯投保分布
    ElevatorDutyPremium: ROOT_TESHE + '/api/v1/elevatorData/getElevatorDutyPremium', //电梯责任险总保费数据
    searchShortTermHis: ROOT_TESHE + '/api/v1/policy/searchShortTermHis', //短期单记录查询
    EXPORTPDLIST: ROOT_TESHE + '/api/v1/pol/exportList', //批单列表导出

}
let Case = {
    CASE_LIST: ROOT_CASE + '/sequip/manageReportedInfo', //案件列表
    CASE_DETAIL: ROOT_CASE + '/sequip/manageReportedInfo', //案件详情
    CASE_REVISIT: ROOT_CASE + '/sequip/revisit', //案件回访
    CASE_APPLYOVER: ROOT_CASE + '/sequip/settlement/apply', //结案申请
    CASE_ACCEPT: ROOT_CASE + '/sequip/acception', //案件受理
    CASE_FILEQUERY: ROOT_CASE + '/channel/file/getByReportNo', //查询文件信息
    CASE_FILEPRESE: ROOT_CASE + '/channel/file/save', //保存文件信息
    CASE_FILEDELETE: ROOT_CASE + '/channel/file/delete', //删除文件信息
    CASE_DICTIONARIES: ROOT_CASE + '/sys/dict', //案件字典
    CASE_MODIFYINFO: ROOT_CASE + '/sequip/manageReportedInfo', //管理端报案信息修改
    CASE_DIST: ROOT_CASE + '/sys/dict', //字典表书
    CASE_SAVEADDINFO: ROOT_CASE + '/sequip/accidentAndCasualty', //保存事故经过，人员
    CASE_ACCOUNT: ROOT_CASE + '/sequip/account', //收款账户
    CASE_LITIGATION: ROOT_CASE + '/sequip/litigation', //诉讼信息
    CASE_PAYMENT: ROOT_CASE + '/sequip/payment', //打款信息
    CASE_PAYINFO: ROOT_CASE + '/sequip/loss', //赔付信息
    CASE_PAYINFO_SUOPEI: ROOT_CASE + '/sequip/closure-apply', //索赔信息
    CASE_AUDITOVER: ROOT_CASE + '/sequip/settlement/audit', //结案审核
    CASE_FWRYRL: ROOT_CASE + '/sequip/flow/claimCase', //3服务人员认领案件
    CASE_SL: ROOT_CASE + '/sequip/flow/acceptCase', //4服务人员受理案件
    CASE_TJSH: ROOT_CASE + '/sequip/flow/recordCase', //5服务人员处理案件，进行案件信息录入。指定结案审核人
    CASE_TJJA: ROOT_CASE + '/sequip/flow/auditCase',
    CASE_DELETESGL: ROOT_CASE + '/sequip/loss/loss3/', //索赔资料-估损/理赔明细
    CASE_EXCEL: ROOT_CASE + '/sequip/excel/download', //列表导出
    CASE_SJLIST: ROOT_CASE + '/sequip/caseList', //电梯责任险数据
    CASE_DCDT: ROOT_CASE + '/sequip/excel/dtDownload', //电梯责任险数据导出
    CASE_DCGZ: ROOT_CASE + '/sequip/excel/gzDownload', //雇主责任险数据导出
    CASE_DCTY: ROOT_CASE + '/sequip/excel/tyDownload', //团意责任险数据导出
    CASE_DCSD: ROOT_CASE + '/sequip/excel/sdDownload', //索道责任险数据导出
    POLICYDETAILS: ROOT_TOUBAO + '/policy/searchPolDetailNew', // 保单详情
    ADD_POLICY: ROOT_CASE + '/safety/caseRecord/addPolicy', //添加或修改保单
    TRANSFORMMEDIATE: ROOT_CASE + '/safety/caseRecord/transFormMediate', //添加或修改保单 //选中服务人员转移
    CASE_ASYN_LIST: ROOT_CASE + '/sequip/syn_case_list',//案件同步列表
    CASE_RECORD: ROOT_CASE + '/safety/syn_case_log',//案件同步记录
    CASE_ASYNC: ROOT_CASE + '/safety/syn_case/sequip',//案件同步 
    STOPCASE: ROOT_CASE + '/deal/reportRecord/pauseRecord', //案件中止
    TRANSFORMSERVICORALL: ROOT_CASE + '/sequip/transMediateBatch', //全部服务人员转移
    GET_EBAO_POLICY: ROOT_EBAO + '/case/policy/list', // 查询E保保单接口
}
let Statistics = {
    GETDATETIME: ROOT_TESHE + '/api/v1/util/getDateJson',//获取服务器时间
    STATISTICS_ELE: ROOT_TESHE + '/api/v1/statisticElevator/list', //按条件查询电梯信息
    STATISTICS_EXPORT: ROOT_TESHE + '/api/v1/statisticElevator/export', //按条件导出电梯信息
    STATISTICS_SCREEN: ROOT_SATS + '/api/v1/sequip/queryElevatorTotal', //查询电梯统计信息
    STATISTICS_DAY: ROOT_TESHE + '/api/v1/statisticElevator/accident/630', //630投保数据统计
    STATISTICS_HOUR: ROOT_TESHE + '/api/v1/statisticElevator/accident/hour', //每日实时投保数据统计,
    GETELESUM: ROOT_TESHE + '/api/v1/ele/getSum', //在保电梯统计查询
    GETTOPFIVE: ROOT_TESHE + '/api/v1/ele/rank5', //保费前五分支机构查询
    GETPROMAP: ROOT_TESHE + '/api/v1/ele/provinceMap',//省分布图
    GETCITYMAP: ROOT_TESHE + '/api/v1/ele/cityMap',//市分布图
    GETCOUNTRYMAP: ROOT_TESHE + '/api/v1/ele/countryMap',//区分布图
    GETYEARANDMONTH: ROOT_TESHE + '/api/v1/ele/yearAndMonth', //获取年度和月度同比保费
    GETPRONAME: ROOT_TESHE + '/api/v1/ledger/productNames',//业务台账-产品名称查询
    GETCOMPANYLIST: ROOT_TESHE + '/api/v1/ledger/insuranceCompanys',//保险机构查询
    GETCOMPANYLIST_BX:ROOT_MDM + '/api/v1/dyna_query/list/getInscompany', // 获取全部保险公司
    GETINSCOMPANY:ROOT_MDM+'/api/v1/dyna_query/list/getInscompany', // 查询保险公司
    GETACCOUNTLIST: ROOT_TESHE + '/api/v1/ledger/policy',//业务台账
    EXPORTACCOUNT: ROOT_TESHE + '/api/v1/ledger/policyExcel',//业务台账导出
    EXPORTELEACCOUNT: ROOT_TESHE + '/api/v1/ledger/elevatorExcel',//电梯台账导出
    EXPORTPERACCOUNT: ROOT_TESHE + '/api/v1/ledger/employeeExcel',//人员台账导出
    EXPORTWYACCOUNT: ROOT_TESHE + '/api/v1/ledger/propertyExcel',//物业台账导出
    POSTACCOUNTELELIST: ROOT_TESHE + '/api/v1/ledger/elevator',//电梯台账
    POSTACCOUNTWYLIST: ROOT_TESHE + '/api/v1/ledger/property',//物业台账
    POSTACCOUNTPERLIST: ROOT_TESHE + '/api/v1/ledger/employee',//人员台账
    POSTCABLEWAYLIST: ROOT_TESHE + '/api/v1/ledger/cableway',// 索道台账
    CABLEWAYEXCEL: ROOT_TESHE + '/api/v1/ledger/cablewayExcel',//物业台账导出
    POSTSHOPLIST: ROOT_TESHE + '/api/v1/ledger/shop',//人员台账
    SHOPEXCEL: ROOT_TESHE + '/api/v1/ledger/shopExcel',//人员台账
    GETPRODUCTACCOUNT: ROOT_TESHE + '/api/v1/productAccount/getList',//产品赔付率
    EXPORTPRODUCTACCOUNT: ROOT_TESHE + '/api/v1/productAccount/getList/download',//产品赔付率导出
}
let Rectify = {
    VERIFICATION_URL: POOT_RECTIFY + '/approve/v1/approve/correct',//冲正审核
    GETRECDETAIL: POOT_RECTIFY + '/correct/v1/record/',//冲正申请详情
    GETOPTION: POOT_RECTIFY + '/approve/v1/operate/correct',//获取审核操作按钮
    GETHISTORY: POOT_RECTIFY + '/approve/v1/history/correct',//获取审核操作历史
    GETPUNCHLIST: POOT_RECTIFY + '/approve/v1/history/correct',//获取审核操作历史
    GETPUNCHLIST: POOT_RECTIFY + '/correct/v1/records', // 冲正列表
    GETCZDIST: POOT_RECTIFY + '/common/v1/enum/reason_type', // 冲正原因获取
    SETOUNCH: POOT_RECTIFY + '/correct/v1/record', // 冲正接口
    // GETOPTIONS: POOT_RECTIFY + '/correct/v1/record', // 冲正列表查询条件
    COMMISSION: ROOT_BMS + '/vouchers/commission/sequip', // 佣金凭证查询接口
    PAYMENT: ROOT_BMS + '/vouchers/payment/sqeuip', // 解付状态查询接口
    SETTLRMENT: ROOT_BMS + '/vouchers/settlement/sequip', // 结算单查询接口
    SEARCHRISKCODE: ROOT_TESHE + '/api/v1/query/getRiskName',//查询已记录险种
    GETSUN: ROOT_TESHE + '/api/v1/performance/getSum',//佣金统计信息
    POSTPLINSERT: ROOT_TESHE + '/api/v1/performance/insert',//批量新增绩效
    POSTUPDATAPER: ROOT_TESHE + '/api/v1/performance/update',//绩效修改
    POSTREFRESH: ROOT_TESHE + '/api/v1/performance/refresh',//刷新
    JXEXPORTSS: ROOT_TESHE + '/api/v1/performance/detailExcel', //导出佣金表
    DELETEJX: ROOT_TESHE + '/api/v1/performance/delete', //删除绩效
    PUTSEARCHKQFLAG: ROOT_BMS + '/corrections/selectCorrectFperiodBySignTime', // 冲正查询跨期状态
}
let ActionLog = {
    ACTION_LOG: ROOT_LOG + '/api/v1/record',
    GETRECORD: ROOT_LOG + '/api/v1/record',
    ROOT_GETEWARY: base
}
let YGSearchUrl = {
    YGPOLICYNODEL: ROOT_YG + '/Mhds/mhdsDitchSelectByPolicyNo',
    YGDATE: ROOT_BMS + '/case/_bai/selectperiod',
    YGPOLICYCOMFIRM: ROOT_YG + '/Mhds/mhdsDitchClaim',
    GETKQSELECT: ROOT_USER + '/api/v1/elementrelavalues?elementRelaId=61',
}
let productConfig = {
    PRODUCTINSERTORUPDATA: ROOT_TESHE + '/api/v1/product/insertOrUpdate',
    PRODUCTCONDIGGETLIST: ROOT_TESHE + '/api/v1/productConfig/getList',
    PRODUCTGETLIST: ROOT_TESHE + '/api/v1/product/_bai/getList',
    CONFIGINSERTORUPDATE: ROOT_TESHE + '/api/v1/productConfig/insertOrUpdate',
    GETPRODUCTDETAILS: ROOT_TESHE + '/api/v1/product/',
    GETPRODUCTVONFIGDETAILS: ROOT_TESHE + '/api/v1/productConfig/',
    GETPRODUCTVONFIGALLDETAILS: ROOT_TESHE + '/api/v1/productConfig/getAllList',
    POSTEMPTY: ROOT_TESHE + '/api/v1/productConfig/empty',
}
let achievements = {
    ACHIEVE_SEARCH: ROOT_TESHE + '/api/v1/performance/list',//绩效列表查询
    ACHIEVE_DETAIL: ROOT_TESHE + '/api/v1/performance/detail',//绩效明细查询
    ACHIEVE_MONTH: ROOT_TESHE + '/api/v1/performance/monthList',//月结记录查询
}
// 缓存机制接口
let riderUrl = {
    POSTRIDER: POOT_RECTIFY + '/cache/v1/value/', //设置缓存
    GETRIDER: POOT_RECTIFY + '/cache/v1/value/', //获取缓存
}
// 合同接口
let contractUrl = {
    SEARCH_CONTRACT: ROOT_MDM + '/api/v1/dyna_query/list/contractList', //查询合同
    SEND_CONTRACT: ROOT_TESHE + '/api/v1/order/updateCustomer', //通知后端更新合同
}
let accidentUserURL = {
    //企业信息
    ACCOUNT_LINK: ROOT_TESHE + '/api/organization/v1/linkAccount/', // 关联专员
    ACCOUNT_UNBOUNDE: ROOT_TESHE + '/api/organization/v1/unboundCommissioner/', // 取消关联专员
    ACCCIDENT_PRO_LINK: ROOT_TESHE + '/api/organization/v1/linkAccidentProduct/', // 关联产品
    ORGANIZATION_SAVE: ROOT_TESHE + '/api/organization/v1/save/', // 新增机构
    ORGANIZATION_DELETE: ROOT_TESHE + '/api/organization/v1/organization/', // 新增机构
    ORGANIZATION_UPDATE: ROOT_TESHE + '/api/organization/v1/update/', // 修改机构
    ORGANIZATION_DETAIL: ROOT_TESHE + '/api/organization/v1/details/', // 机构详情
    ORGANIZATION_LIST: ROOT_TESHE + '/api/organization/v1/list/', // 机构列表
    ENTERPRISE_ADD: ROOT_TESHE + '/api/organization/v1/org', // 生产单位新增/修改
    ENTERPRISE_LIST: ROOT_TESHE + '/api/organization/v1/orgs', // 生产单位列表
    ENTERPRISE_STATUS: ROOT_TESHE + '/api/organization/v1/Status/', // 生产单位状态
    DICT_GET: ROOT_TESHE + '/common/dict/items/', // 行业分类，管理分类
    AREA_GET: ROOT_TESHE + '/common/area/v1/next/', // 四级下拉地址
    AREA_NAME_GET: ROOT_TESHE + '/common/area/v1/region/', // 四级下拉地址
    AREA_LEAVE_GET: ROOT_TESHE + '/common/area/v1/', // 下拉地址安级别查询
    EXPERT_LIST: ROOT_TESHE + '/api/expert/v1/list', // 专家列表
    EXPERT_ADD: ROOT_TESHE + '/api/expert/v1/save/', // 新增专家
    EXPERT_DELETE: ROOT_TESHE + '/api/expert/v1/expert/', // 新增专家
    EXPERT_UPDATE: ROOT_TESHE + '/api/expert/v1/alter', // 修改专家
    EXPERT_STATUS: ROOT_TESHE + '/api/expert/v1/alter/dataStatus', // 修改专家状态
    EXPERT_DETAILS: ROOT_TESHE + '/api/expert/v1/details/', // 专家详情
    EXPERT_DETAIL_ORG: ROOT_TESHE + '/api/organization/v1/orgExpertDetials/', // 服务机构关联专家
    ENUM_GET: ROOT_TESHE + '/common/v1/str/enum', //枚举类
    QUERY_ACCIDENT_PRODUCT: ROOT_TESHE + '/api/organization/v1/queryAccidentProduct', // 查询当前产品
}
// 事故预防
let accidentURL = {
    GET_PROJECTS_LIST: ROOT_TESHE + '/acdpre/v1/projects', // 项目列表
    GET_TRANSFER_LIST: ROOT_TESHE + '/acdpre/v1/projectList', // 项目列表
    TRANFER_DETAIL: ROOT_TESHE + '/acdpre/v1/commissioner', // 项目转移详情

    ADD_PROJECTS: ROOT_TESHE + '/acdpre/v1/project', // 新增项目,删除
    ADD_PLAN: ROOT_TESHE + '/acdpre/v1/plan', // 新增计划
    UPDATA_PLAN_STATUS: ROOT_TESHE + '/acdpre/v1/plan/status/', // 更新计划状态
    GET_PLAN: ROOT_TESHE + '/acdpre/v1/plan/', // 获取计划详情
    ADD_PLAN_FILE: ROOT_TESHE + '/acdpre/v1/plan', // 获取计划详情
    PLAN_SUMMARY: ROOT_TESHE + '/acdpre/v1/', // 服务总结
    ADD_DANGER: ROOT_TESHE + '/acdpre/v1/danger', // 新增隐患记录，新增风险记录,删除
    ADD_RECHECK: ROOT_TESHE + '/acdpre/v1/recheck', // 新增管控记录，新增复查记录
    PUT_FINISH: ROOT_TESHE + '/acdpre/v1/finish/', // 项目总结
    ADD_PROJECT_FILE: ROOT_TESHE + '/acdpre/v1/project/', // 新增项目文件
    ADD_FILE_LABEL: ROOT_TESHE + '/common/v1/fileLabelType', // 新增文件标签
    DELETES_FILE: ROOT_TESHE + '/acdpre/v1/file/', // 删除文件
    ROLE_PORJECT_LIST: ROOT_TESHE + '/acdpreapprove/v1/roleAcdpreList', // 审核列表
    ROLE_PORJECT_DETAILS: ROOT_TESHE + '/acdpreapprove/v1/operate', // 审核详情
    ROLE_PORJECT_HANDLE: ROOT_TESHE + '/acdpreapprove/v1/approve', // 审核处理
    GET_PLAN_LIST: ROOT_TESHE + '/acdpre/v1/plans', // 计划列表
    DOWNLOAD_TEMPLATE_FLIE: ROOT_TESHE + '/acdpre/v1/templateFile', // 下载人员列表
    GETDATE: ROOT_TESHE + '/common/v1/date', // 获取服务器时间

    EHR_DATABASE: ROOT_MDM + "/api/v1/dyna_query/list/getExpert",//EHR专家库

    ADDAGENT: POOT_RECTIFY + '/agent/v1/save', // 服务经纪添加
    AGENTQUERYLIST: POOT_RECTIFY + '/agent/v1/queryList', // 服务经纪列表
    AGENTDEL: POOT_RECTIFY + '/agent/v1/del', // 服务经纪删除
    AGENTALTER: POOT_RECTIFY + '/agent/v1/alter', // 服务经纪修改
    AGENTDETAIL: POOT_RECTIFY + '/agent/v1/details',//服务经纪详情
    APPOINTRECORD: POOT_RECTIFY + '/agent/v1/appointmentRecord',//预约记录信息列表
    APPOINTUPDATE: POOT_RECTIFY + '/agent/v1/alterAppointmentRecord',//预约记录状态更新
    AGENTUNHANDLED: POOT_RECTIFY + '/agent/v1/unhandled/sequip', // 经纪人处理记录
    STATERECORD: POOT_RECTIFY + '/agent/v1/alterAppointmentRecord', // 预约记录状态更新

    CHECK_TEMPLATE: ROOT_TESHE + '/template/v1/check_template', // 创建模板
    CHECK_GROUP: ROOT_TESHE + '/template/v1/check_template_group', // 创建检查项
    CHECK_QUESTION: ROOT_TESHE + '/template/v1/check_template_question', // 创建试题
    CHECK_ANSWER: ROOT_TESHE + '/template/v1/answer/', // 获取检查表格数据
    CHECK_TYPE: ROOT_TESHE + '/template/v1/check_type', // 判断企业排查是常规排查还是检查表排查
    CHECK_DOWNLOAD: ROOT_TESHE + '/template/v1/check_template_download', // 下载检查表

}

// 自定义模板
let template = {
    CUSTOM_TEMPLATE: POOT_RECTIFY + '/template/v1/custom_template',
    CUSTOM_TEMPLATE_LOAD: POOT_RECTIFY + '/template/v1/custom_template_load/',
    CUSTOM_LOG: POOT_RECTIFY + '/template/v1/custom_log',
}
// 案件认领
let claim = {
    SELECT_DOCKING_CLAIM_LIST: EBAO_CASE_SVC + "/common/docking/selectDockingClaimList", // 认领案件列表
    QUERY_CASE_DOCKING_BY_CASE_NO: EBAO_CASE_SVC + "/common/docking/queryCaseDockingByCaseNo", // 根据案件号/报案号查询对接案件信息
    SYS_DICT: EBAO_CASE_SVC + "/sys/dict",
    INSERT_CASE_ASSOCIATION: EBAO_CASE_SVC + "/common/docking/insertCaseAssociation", // 新增保司江泰案件关联表数据
    UPDATE_BS_JT_CASE_REF_STATUS: EBAO_CASE_SVC + "/common/docking/updateBsJtCaseRefstatus", // 修改案件关联表引用状态
    UPDATE_CASE_REF_STATUS: EBAO_CASE_SVC + "/common/docking/updateCaseRefstatus", // 修改对接案件引用状态
    SYS_CASE_SEQUIP: ROOT_CASE + "/safety/syn_case/sequip",
    FINISH_REPORT_CASE: ROOT_CASE + "/sequip/flow/finishReportCase",
    REPORTED_INFO_BY_400: ROOT_CASE + "/sequip/reportedInfoBy400",
    // SELECT_DOCKING_CLAIM_LIST: 'http://10.10.32.76:6250/common/docking/selectDockingClaimList',
}


let accidentCase = {
    ACCIDENT_CASE_LIST: ROOT_TESHE + "/api/v1/accidentCase/_bai/getList", // 事故案例列表查询
    ACCIDENT_CASE_DETAIL: ROOT_TESHE + "/api/v1/accidentCase/_bai/", // 事故案例查询
    ACCIDENT_CASE_ADD_UPDATE: ROOT_TESHE + "/api/v1/accidentCase/insertOrUpdate", // 添加或修改事故案例
    ACCIDENT_CASE_DELETE: ROOT_TESHE + "/api/v1/accidentCase/", // 事故案例删除
    ACCIDENT_CASEF_ILE_DELETE: ROOT_TESHE + "/api/v1/accidentCaseFile/", // 事故案例附件删除
    ACCIDENT_CASE_LOG_LIST: ROOT_TESHE + "/api/v1/accidentCaseLog/getList", // 操作日志列表查询
    ACCIDENT_CASE_LOG_ADD: ROOT_TESHE + "/api/v1/accidentCaseLog/_bai/insert", // 添加操作日志
}
let CASE_V2_URL = {
    ACCEPT_CASE_V2: ROOT_CASE + '/sequipv2/acceptCase', // 案件受理
    CANCEL_PAUSE_STATUS_V2: ROOT_CASE + '/sequipv2/cancelPauseStatus', // 撤销案件中止
    CASES_PAGE_V2: ROOT_CASE + '/sequipv2/casesPage', // 案件列表
    DELETE_FILE_INFO_V2: ROOT_CASE + '/sequipv2/deleteFileInfo', // 附件删除
    DELETE_INSURED_INFO_V2: ROOT_CASE + '/sequipv2/deleteInsuredInfo', // 出险人信息删除
    END_CASE_APPLY_V2: ROOT_CASE + '/sequipv2/endCaseApply', // 结案申请
    END_CASE_INFO_SAVE_V2: ROOT_CASE + '/sequipv2/endCaseInfoSave', // 结案信息填写(新增及修改)
    EXAM_CASE_V2: ROOT_CASE + '/sequipv2/examCase', // 案件审批
    FILE_INFO_UPLOAD_V2: ROOT_CASE + '/sequipv2/fileInfoUpload', // 附件信息上传
    FILE_LIST_INFO_UPLOAD_V2: ROOT_CASE + '/sequipv2/fileListInfoUpload', // 附件信息上传
    GET_CASE_INFO_V2: ROOT_CASE + '/sequipv2/getCaseInfo', // 案件详情
    GET_INDUSTRY_INFO_V2: ROOT_CASE + '/sequipv2/getIndustryInfo', // 行业信息获取
    GET_POLICY_INFO_V2: ROOT_CASE + '/sequipv2/getPolicyInfo', // 保单信息获取
    PAUSE_CASE_V2: ROOT_CASE + '/sequipv2/pauseCase', // 案件中止
    POLICY_INFO_SAVE_V2: ROOT_CASE + '/sequipv2/policyInfoSave', // 保单信息填写(新增及修改)
    POLICY_SEARCH_V2: ROOT_CASE + '/sequipv2/policySearch', // 险种查询
    RISK_INFO_SAVE_V2: ROOT_CASE + '/sequipv2/riskInfoSave', // 出险信息填写(新增及修改
    SAVE_CLAIM_INFO_V2: ROOT_CASE + '/sequipv2/saveClaimInfo', // 索赔信息填写(新增及修改)
    SAVE_INSURED_INFO_V2: ROOT_CASE + '/sequipv2/saveInsuredInfo', // 出险人信息保存
    GET_ELEVATOR_LIST_V2: ROOT_CASE + '/sequipv2/subject/getElevatorList', // 设备标的列表查询
    GET_EMPLOYEE_LIST_V2: ROOT_CASE + '/sequipv2/subject/getEmployeeList', // 人员标的列表查询
    GET_PROPERTY_LIST_V2: ROOT_CASE + '/sequipv2/subject/getPropertyList', // 物业标的列表查询
    GET_CABLEWAY_LIST_V2: ROOT_CASE + '/sequipv2/subject/getCablewayList', // 索道标的列表查询
    GET_SHOP_LIST_V2: ROOT_CASE + '/sequipv2/subject/getShopList', // 商铺标的查询接口
    TARGET_INFO_SAVE_V2: ROOT_CASE + '/sequipv2/targetInfoSave', // 标的信息填写(新增及修改
    CASE_ENUM_V2: ROOT_CASE + '/sequipv2/enum/total', // 枚举
    STATU_SCNT_V2: ROOT_CASE + '/sequipv2/index/statusCnt', // 状态统计
    GET_CASE_QUERY_CONDITION_LIST_V2: ROOT_CASE + '/sequipv2/enum/getCaseQueryConditionList', // 案件反查接口
    EBAO_INDUSTRY_V2: ROOT_CASE + '/sequipv2/ebao/industry', // 获取E保行业
    VISIT_CREATE_V2: ROOT_CASE + '/sequipv2/visit/create', // 拜访接口
    CASE_ACCOUNT_PAGE_V2: ROOT_CASE + '/sequipv2/caseAccountPage', // 拜访接口
    EXPORT_CASE_ACCOUNT_V2: ROOT_CASE + '/sequipv2/exportCaseAccount', // 台账导出
    GET_TIME: ROOT_TESHE + '/api/v1/util/getTime', // 拜访接口
    REPORT_CASE_400_COMMIT_V2: ROOT_CASE + '/sequipv2/reportCase400/commit', // 拜访接口
    FILE_ZIP_DOWNLOAD: POOT_RECTIFY + '/v1/fileZipDownload', // 文件全部下载
    TRANSFER_CASE_V2: ROOT_CASE + '/sequipv2/transferCase', // 案件转移
    ENDCASEREPORT_CASE_V2: ROOT_CASE + '/sequipv2/endCaseReport/', // 案件报告
}
// 续保跟踪 
let renewalService = {
    RENEWAL_CONDITION: ROOT_TESHE + "/renewal/v1/renewal-condition", // 保单追踪查询条件
    RENEWAL_INFO: ROOT_TESHE + "/renewal/v1/renewal-info", // 保单追踪修改续保情况
    RENEWAL_MANAGER: ROOT_TESHE + "/renewal/v1/renewal-manager", // 保单追踪修改业务经理信息
    RENEWAL_REPORT: ROOT_TESHE + "/renewal/v1/renewal-report", // 保单追踪明细表导出
    RENEWAL_STATISTIC: ROOT_TESHE + "/renewal/v1/renewal-statistic", // 查询保单追踪统计数据
    RENEWAL_TRACKS: ROOT_TESHE + "/renewal/v1/renewal-tracks", // 查询保单追踪列表
    RENEWAL_TRACK: ROOT_TESHE + "/renewal/v1/renewal-track", // 查询保单追踪向信息
    PRODUCT_CONDITION: ROOT_TESHE + "/renewal/v1/product-condition", // 产品地区查询条件
    RENEWAL_CONDITIONPRO: ROOT_TESHE + '/renewal/v1/renewal-condition-year', // 获取已设置客户经理/行业
    RENEWAL_CASE_DETAILS: ROOT_CASE + '/safety/caseClaim', // 续保建议书获取案件信息
    BATCH_PERSON: ROOT_TESHE + '/renewal/v1/batchstaff/list', // 查询分支机构人员
    LS_WX_REASON: ROOT_TESHE + '/renewal/v1/lsWxReason', // 查询分支机构人员
    GET_RENEW_POLICY: ROOT_BMS + '/renew/getRenewPolicy'//已续【客户、保单号】查询接口

}

//续约跟踪
let contractService = {
    // 续约跟踪表
    RENEWAL_XYTION: ROOT_TESHE + "/renewal/v1/findContractTrackCondition",//续约统计列表查询条件
    RENEWAL_XYSTIC: ROOT_TESHE + "/renewal/v1/renewalContractStatistic", //查询合同追踪统计数据


    //续约记录表
    RENEWAL_XYDETAILS: ROOT_TESHE + "/renewal/v1/renewalContractDetails", //查询续约合同详情  GET

    RENEWAL_XYLIST: ROOT_TESHE + "/renewal/v1/renewalContractList", //查询续约明细列表     POST   

    RENEWAL_XYDOWNLOAD: ROOT_TESHE + "/renewal/v1/renewalContractList/download", //查询续约明细列表下载  POST 

    RENEWAL_XYMANGER: ROOT_TESHE + "/renewal/v1/contractRelationManager", //批量设置续约合同经理 PUT 

    RENEWAL_XYCONTRACT: ROOT_TESHE + "/renewal/v1/followUpContract", //续约情况跟进处理  PUT

    CE_RENEW_DETAIL: ROOT_BMS + '/renew/renewDetail',//续签详情【客户、保单】
}


// 增员管理
let fieldPerson = {
    FIELD_PERSONNELLIST: ROOT_TESHE + "/staff/v1/fieldPersonnelList",  //外勤人员列表  POST
    FIELD_PERSONNEL_DETAILS: ROOT_TESHE + "/staff/v1/fieldPersonnelDetails",//外勤人员详情 GET 
    FIELD_PERSONNEL_COND: ROOT_TESHE + '/staff/v1/fieldPersonnelCond',//外勤人员列表反向加载查询条件 GET 
    DEL_FIELD_PERSONNEL: ROOT_TESHE + '/staff/v1/delFieldPersonnel',//删除外勤人员  DELETE
    CREATE_FIELD_PERSONNEL: ROOT_TESHE + '/staff/v1/createFieldPersonnel',//添加外勤人员   POST
    ALTER_FIELD_PERSONNEL_STATUS: ROOT_TESHE + '/staff/v1/alterFieldPersonnelStatus',//修改外勤人员状态 00-无效 01-有效   PUT
    ALTER_FIELD_PERSONNEL: ROOT_TESHE + '/staff/v1/alterFieldPersonnel',//修改外勤人员    PUT

}
// 客户管理
let customeManagement = {
    CUSTOMER_MANAGEMENT_ENUM: POOT_RECTIFY + "/customer/management/enum",  // 枚举值返回
    CUSTOMER_MANAGEMENT_DETAILS: POOT_RECTIFY + "/customer/management/{id}", // 查询客户公司详情
    CUSTOMER_MANAGEMENT_CREATE: POOT_RECTIFY + "/customer/management/create", // create
    CUSTOMER_MANAGEMENT_DELETE: POOT_RECTIFY + "/customer/management/delete/{id}",    // 删除客户共i是
    CUSTOMER_MANAGEMENT_LIST: POOT_RECTIFY + "/customer/management/page",   // 客户公司分页
    CUSTOMER_MANAGEMENT_UPDATE: POOT_RECTIFY + "/customer/management/update", //更新客户公司
    CUSTOMER_MANAGEMENT_IMPORT: POOT_RECTIFY + "/customer/management/excel/import",
    CUSTOMER_MANAGEMENT_EXPORT: POOT_RECTIFY + "/customer/management/excel/export",

}
let customerVisit = {
    CUSTOMER_VISIT_DETAILS: POOT_RECTIFY + "/customer/visit/", // 查询详情
    CUSTOMER_VISIT_DELETE: POOT_RECTIFY + "/customer/visit/delete/{id}",    // 删除
    CUSTOMER_VISIT_ENUM: POOT_RECTIFY + "/customer/visit/enum/sequip",  // 枚举值返回
    CUSTOMER_VISIT_SAVE: POOT_RECTIFY + "/customer/visit/save", // save
    CUSTOMER_VISIT_LIST: POOT_RECTIFY + "/customer/visit/page",   // 客户公司分页
	CUSTOMER_VISIT_VISITEXPORT: POOT_RECTIFY + "/customer/visit/visitExport",   // 导出    
	CASE_LOG_INSERTLOG: POOT_RECTIFY + "/case/log/insertLog",   // 记录日志接口 
}

//后台日志管理
let logUrl = {
    GETLOGSEARCH: ROOT_CASE + '/sequipv2/logCondition',
    GETNEWLOG: ROOT_CASE + '/sequipv2/opearteLog',
}
let newsUrl = {
    //新闻模块接口
    columntype: ROOT_TESHE + '/api/news/v1/columntype', //获取栏目列表
    news_detail: ROOT_TESHE + '/api/news/v1/detail', //新闻详情
    newsManagement_list: ROOT_TESHE + '/api/news/v1/list', //新闻资讯列表接口
    NEWLISTTYPE: ROOT_TESHE + '/api/news/v1/querystatus', //栏目状态查询接口
    newinfo: ROOT_TESHE + '/api/news/v1/newinfo', //创建新闻接口
    newinfodel: ROOT_TESHE + '/api/news/v1/newinfodel', //删除新闻接口
    newtype: ROOT_TESHE + '/api/news/v1/newtype', //创建栏目创建类别
    newtypedel: ROOT_TESHE + '/api/news/v1/newtypedel', // 删除栏目接口
    upnewinfo: ROOT_TESHE + '/api/news/v1/upnewinfo', //修改新闻接口
    // 以下接口仅限内部使用
    ueditor: ROOT_TESHE + '/api/files/v1/config', //ueditor
}

// 资讯相关操作-事故案例
let accidentCases = {
    INFORMATION_DOWNLOAD_FILE: ROOT_TESHE + "/api/news/downloadfile", // 下载事故案例附件列表文件接口
    CASE_CATEGOR: ROOT_TESHE + "/api/news/_bai/v1/caseCategor", // 类别查询接口
    CASE_LIST_NEW: ROOT_TESHE + "/api/news/v1/cases", // 事故案例列表
}
 
let endorsement = {
    ENDORSEMENT_DETAIL: ROOT_POL + '/liabilitySvc/v1/queryPubEndorsementsDetail',
}
//新案件配置-相关接口
let newCaseConfiguration = {
    GET_PF_CONFIG:ROOT_CASE + '/sequipv2/caseFile/getPFConfig',//获取案件资料赔付列表
    SAVE_CONFIG:ROOT_CASE + '/sequipv2/caseFile/saveConfig', //新增、修改案件资料赔付
    GET_LX_CONFIG :ROOT_CASE + '/sequipv2/caseFile/getLxConfig',//获取资料管理列表
    SELECT_BY_EMPLOYEE_NUM:ROOT_USER + '/api/selectByEmployeeNum',//查询当前用户部门
    DELETE_CONFIG:ROOT_CASE + '/sequipv2/caseFile/deleteConfig',//删除接口
    CREATE_PRODUCT_CONFIG:ROOT_CASE + '/sequipv2/caseFile/createProductConfig',//创建/修改案件资料配置模板
    
    PRODUCT_CONSIG_PAGES:ROOT_CASE + '/sequipv2/caseFile/productConfigPages',//案件资料配置模板分页查询
    GET_TEMPLATE_DETAIL:ROOT_CASE + '/sequipv2/caseFile/getTemplateDetail',//获取案件资料模板详情
    GET_INSURANCE_COMPANY_NAME:ROOT_CASE + '/sequipv2/caseFile/getInsuranceCompanyName',//获取保司列表
    EXIST_CONSIG:ROOT_CASE + '/sequipv2/caseFile/existConfig',//新增判断当前有没有
    EXAMINE:ROOT_CASE + '/sequipv2/caseFile/examineTemplate',//审核接口
    DELETE_TEMPLATE:ROOT_CASE + '/sequipv2/caseFile/deleteTemplate',//删除案件资料模板
    GET_TEMPLATE_ITEM_LIST:ROOT_CASE + '/sequipv2/caseFile/getTemplateItemList',//获取案件资料模板配置详情
    GET_TEMPLATS_ITEM_LIST_TREE:ROOT_CASE + '/sequipv2/caseFile/getTemplateItemListTree',//获取当前树形结构回显
}

export default {
    root,
    codeimgUrl,
    ROOT_TESHE_PWEB,
    ROOT_TESHE_ENT_WEB,
    DOMAIN_NAME,
    ...loginUrl,
    ...accidentUrl,
    ...InsuranceUrl,
    ...areasUrl,
    ...elevatorUrl,
    ...productUrl,
    ...prerecordedUrl,
    ...usercenterUrl,
    ...Approval,
    ...InsurancepolicyUrl,
    ...Case,
    ...Statistics,
    ...ActionLog,
    ...resourcesUrl,
    ...Rectify,
    ...YGSearchUrl,
    ...productConfig,
    ...achievements,
    ...riderUrl,
    ...contractUrl,
    ...accidentUserURL,
    ...accidentURL,
    ...template,
    ...claim,
    ...accidentCase,
    ...CASE_V2_URL,
    ...renewalService,
    ...contractService,
    ...fieldPerson,
    ...logUrl,
    ...customeManagement,
    ...customerVisit,
    ...newsUrl,
    ...accidentCases,
    ...endorsement,
    ...newCaseConfiguration
};