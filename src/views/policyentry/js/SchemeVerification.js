export default class SchemeVerification{ // 产品选择校验
	getSchemeVerification(data){
		let xeArr = ['23XE235993', '23XE271390', '23XE761231'];
		let prodCodeFlag = data.productCode == '23PR797905' ? true : false;
		let item = {
			rules:true,
			name:''
		}
		let arrM = [];
		let arrA = [];
		for(var i=0;i<data.MR.length;i++){ // 主险校验
			let item1 = data.MR[i];
			arrM.push(false);
			for(var j=0;j<item1.list.length;j++){
				let item2 = item1.list[j]
				if(item2.disabled){
					arrM[i] = true
				}
			}
			if(prodCodeFlag) {
				if(!arrM[i] && xeArr.find(t => t == item1.code)){
					item = {
						rules:false,
						name:"基本险" + item1.name
					}
					return item;
				}
			} else {
				if(!arrM[i]){
					item = {
						rules:false,
						name:"基本险" + item1.name
					}
					return item;
				}
			}
		}
		for(var l=0;l<data.itemA.length;l++){ // 附加险校验
			let item1 = data.itemA[l];
			arrA.push(false);
			if(data.radioA[l]){
				for(var k=0;k<item1.list.length;k++){
					let item2 = item1.list[k]
					if(item2.disabled){
						arrA[l] = true
					}else{
						arrA[l] = false
					}
					if(!arrA[l]){
						item = {
							rules:false,
							name:item1.riskName + "限额"
						}
						return item;
					}
				}
			}
		}
		return item;
	}
}