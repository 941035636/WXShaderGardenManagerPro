// import ConstructionProducts from '../../../../static/data/ConstructionProducts.json'
export default class getProductData{
	getProductData(data){
		let productDetails = {
			productCode:data.productCode,
			productName:data.productName,
			projectCode:data.projectCode,
			projectName:data.projectName,
			tableData:[],
			itemM:data.itemM,
			itemA:data.itemA,
			radioA:data.radioA,
			radioM:data.radioM,
			MR:data.MR,
			index:'1',
			productSort:data.productSort,
			ygBranchFlag:data.ygBranchFlag ? data.ygBranchFlag : false,
			productType:data.productType ? data.productType : false
		};
		// ConstructionProducts.data.forEach(item =>{
		// 	if(item.productCode == productDetails.productCode){
		// 		productDetails.index = '2'
		// 	}
		// })
		data.itemM.forEach(item1 => {
			item1.duties.forEach(item2 => {
				item2.dutyLimits.forEach(item3 => {
					item3.list.forEach(item4 => {
						let obj = {
							riskName:item1.riskName,
							riskCode:item1.riskCode,
							dutyName:item2.dutyName,
							dutyCode:item2.dutyCode,
							name:item3.name,
							code:item3.code,
							valueCode:"",
							showValue:'',
							riskFlag:item1.riskFlag2
						}
						if(item4.disabled){
							obj.valueCode = item4.valueCode;
							obj.showValue = item4.showValue;
							productDetails.tableData.push(obj)
						}
					})
				})
			});
		})
		data.itemA.forEach((item1,index) => {
			if(data.radioA[index]){
				item1.duties.forEach(item2 => {
					item2.dutyLimits.forEach(item3 => {
						item3.list.forEach(item4 => {
							let obj = {
								riskName:item1.riskName,
								riskCode:item1.riskCode,
								dutyName:item2.dutyName,
								dutyCode:item2.dutyCode,
								name:item3.name,
								code:item3.code,
								valueCode:"",
								showValue:"",
								riskFlag:item1.riskFlag2
							}
							if(item4.disabled){
								obj.valueCode = item4.valueCode;
								obj.showValue = item4.showValue;
								productDetails.tableData.push(obj)
							}
						})
					})
				});	
			}
		})
		return productDetails;
	}
}