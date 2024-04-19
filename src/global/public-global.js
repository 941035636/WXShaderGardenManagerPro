
/*
*敞亮定义文件
* @property { key: {string} 路由地址命名}
* @property { value	: {String} 路由名称 }
* @version 1.0.0
* @edit: quweina
*/


const COMPANY = '00' // 企业角色
const EXPERT = '01' // 专家 角色
const SAFE_WATCH = '02' // 安监局角色

const MEN = '0' // 性别男
const WOMEN = '1' // 性别女

const OFFICAL_MSG = 1 // 官方消息
const SYSTEM_MSG = 2 // 系统消息
const SERVER_MSG = 3 // 服务消息

const ACCI_SERVE_TYPE = [{ // 事故预防服务类型
		label: '安全培训（集中培训）',
		value: '1'

	},
	{
		label: '安全培训（定制培训）',
		value: '2'
	}, {
		label: '安全排查',
		value: '3'
	}
]



const ACCI_STATUS = [ // 事故预防申请状态 
	// 1 待审核 2 审核中 3 审核失败 4 审核通过 5 已完成
	{
		label: '待审核',
		value: '1'
	}, {
		label: '审核中',
		value: '2'
	},
	{
		label: '审核失败',
		value: '3'
	}, {
		label: '审核通过',
		value: 4
	}, {
		label: '已完成',
		value: '5'
	}

]

const PAY_TYPE = [
	// 支出类型  
	{
		label: '差旅费',
		value: '1'
	},

	{
		label: '交通费',
		value: '2'
	},

	{
		label: '业务招待费',
		value: '3'
	},
	{
		label: '会议费',
		value: '4'
	}, {
		label: '劳务费',
		value: '5'
	},
	{
		label: '印刷费',
		value: '6'
	},
	{
		label: '咨询费',
		value: '7'
	},

	{
		label: '其他',
		value: '8'
	}

]





export default {
	install(Vue) {
		Object.defineProperties(Vue.prototype, {
			$publicGlobal: {
				value: {
					COMPANY,
					EXPERT,
					SAFE_WATCH,
					MEN,
					WOMEN,
					OFFICAL_MSG,
					SYSTEM_MSG,
					SERVER_MSG,
					ACCI_SERVE_TYPE,
					ACCI_STATUS,
					PAY_TYPE
				}
			}
		})
	}
}
