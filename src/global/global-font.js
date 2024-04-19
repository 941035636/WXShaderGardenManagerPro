
/*
*路由地址配置文件
* @property { key: {string} 路由地址命名}
* @property { value	: {String} 路由名称 }
* @version 1.0.0
* @edit: quweina
*/

const CONFIG = {
    'login':'/login',
	//事故预防
	'accidentList': '/accidentList',//预防列表页
    'applicantList': '/applicantList',//预防申请及修改页
    "directorApproval":'/directorApproval',//事故预防审核详情及操作页
    "simpleReport":'/simpleReport',//简单报告
    'expensesUpload':'/expensesUpload',//附件上传
    'invoiceUpload':'/invoiceUpload',//发票上传
    'ExpertEdit':'/ExpertEdit',//隐患编辑
    'cancleApply':'/cancleApply',//取消申请
    'simpleReport':'/simpleReport',//查看报告
    'addSafe':'/addSafe',//发布活动
    'budgetList':'/budgetList',//收支台账
    'ExpertBasicEdit':'/ExpertBasicEdit'//隐患基础信息编辑
}
export default { ...CONFIG
}
