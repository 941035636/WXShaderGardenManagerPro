export default class getProductDatas{ // 整理产品数据结构
	getProductDatas(list){
		let itemM = [];
		let itemA = [];
		let MR = [];
		let data = {
			itemM:[],
			itemA:[],
			radioA:[]
		};
		list.forEach(item =>{
			if(item.riskFlag == 'M'){
				itemM.push(item)
			}else if(item.riskFlag == 'A'){
				itemA.push(item)
			}
		});
		let obj = {
			riskFlag2:"",
			riskCode:"",
			riskName:"",
			duties:[]
		}
		itemM.forEach(item =>{
			obj = {
				riskFlag2:item.riskFlag,
				riskCode:item.riskCode,
				riskName:item.riskName,
				duties:[]
			}
			item.list.forEach(item1 =>{
				let obj1 = {
					dutyCode:item1.liabilityCode,
					dutyName:item1.liabilityName,
					dutyLimits:[]
				}
				item1.list.forEach(item2 =>{
					let obj2 = {
						code: item2.limitCode,
						name: item2.limitName,
						list:[]
					}
					item2.list.forEach(item3 =>{
						let obj3 = {
							showValue:item3.showValue,
							limitValue:item3.limitValue,
							valueCode:item3.valueCode,
							unifiedCode:item3.unifiedCode
						}
						obj2.list.push(obj3)
					})
					obj1.dutyLimits.push(obj2)
					MR.push(obj2)
				})
				obj.duties.push(obj1)
			})
			data.itemM.push(obj)
		})
		itemA.forEach(item =>{
			obj = {
				riskFlag2:item.riskFlag,
				riskCode:item.riskCode,
				riskName:item.riskName,
				duties:[],
				list:[],
				radioA:[]
			}
			item.list.forEach(item1 =>{
				let obj1 = {
					dutyCode:item1.liabilityCode,
					dutyName:item1.liabilityName,
					dutyLimits:[]
				}
				item1.list.forEach(item2 =>{
					let obj2 = {
						code: item2.limitCode,
						name: item2.limitName,
						list:[]
					}
					item2.list.forEach(item3 =>{
						let obj3 = {
							showValue:item3.showValue,
							limitValue:item3.limitValue,
							valueCode:item3.valueCode,
							unifiedCode:item3.unifiedCode
						}
						obj2.list.push(obj3)
					})
					obj1.dutyLimits.push(obj2)
					obj.list.push(obj2)
				})
				obj.duties.push(obj1)
				data.radioA.push(false)
			})
			data.itemA.push(obj)
		})
		data.MR = MR;
		return data;
	}
}