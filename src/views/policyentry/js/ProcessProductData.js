export default class ProcessProductData{
	getProductData(data,employee){
		data.tableData.forEach(item =>{
			if(item.name == '企业累计责任限额'){
				item.showValue = item.showValue.split('-')[0] + '-' + employee.costAmount
			}
			if(item.name == '每次事故责任限额'){
				item.showValue = item.showValue.split('-')[0] + '-' + employee.costAmount
			}
		})
		data.itemM.forEach(item =>{
			item.duties.forEach(item1 =>{
				item1.dutyLimits.forEach(item2 =>{
					item2.list.forEach(item3 =>{
						if(item3.disabled){
							if(item2.name == '企业累计责任限额'){
								item2.showValue = employee.costAmount*100/100
								item3.showValue = employee.costAmount*100/100
							}
							if(item2.name == '每次事故责任限额'){
								item2.showValue = employee.costAmount*100/100
								item3.showValue = employee.costAmount*100/100
							}
						}
					})
				})
			})
		})
		return data;
	}
}