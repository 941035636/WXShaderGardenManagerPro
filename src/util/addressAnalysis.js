
export class address {
	constructor(addressList=[]){
		this.addressList = addressList
	}
	/**
	 * 解析邮编
	 * @param event识别的地址
	 * @returns <obj>
	 */
	smart(event) {
		let _this = this
		event = _this.stripscript(event); //过滤特殊字符
		let obj = {};
		let copyaddress = JSON.parse(JSON.stringify(event));
		copyaddress = copyaddress.split(' ');
		
		copyaddress.forEach((res, index) => {
			if (res) {
				if (res.length == 1) {
					res += 'XX'; // 过滤掉一位的名字或者地址
				}
				let addressObj = _this.smatrAddress(res);
				obj = Object.assign(obj, addressObj);
				if (JSON.stringify(addressObj) === '{}') {
					obj.name = res.replace('XX', '');
				}
			}
		});
		return obj;
	}
	////过滤特殊字符
	stripscript(s) {
		s = s.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');
		s = s.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
		var pattern = new RegExp(
		"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？-]"
		);
		var rs = '';
		for (var i = 0; i < s.length; i++) {
		rs = rs + s.substr(i, 1).replace(pattern, ' ');
		}
		rs = rs.replace(/[\r\n]/g, '');
		return rs;
	}
	smatrAddress(event) {
		let _this = this;
		var smartObj = {};
		let address = event;
		//address=  event.replace(/\s/g, ''); //去除空格
		address = _this.stripscript(address); //过滤特殊字符
		
		let matchAddress = '';
		//省匹配 比如输入北京市朝阳区，会用北  北京  北京市 北京市朝 以此类推在addressList里的province中做匹配，会得到北京市  河北省 天津市等等；
		let matchProvince = []; //粗略匹配上的省份
		// for (let begIndex = 0; begIndex < address.length; begIndex++) {
		matchAddress = '';
		for (let endIndex = 0; endIndex < address.length; endIndex++) {
		  //  if (endIndex > begIndex) {
		  matchAddress = address.slice(0, endIndex + 2);
		  this.addressList.forEach(res => {
			if (res['label'].indexOf(matchAddress) != -1) {
			  matchProvince.push({
				province: res.label,
				provinceCode: res.value,
				matchValue: matchAddress
			  });
			}
		  });
		}
		//统计筛选初略统计出的省份
		matchProvince.forEach(res => {
		  res.index = 0;
		  matchProvince.forEach(el => {
			if (res.province == el.province) {
			  el.index++;
			  if (res.matchValue.length > el.matchValue.length) {
				el.matchValue = res.matchValue;
			  }
			}
		  });
		});
		if (matchProvince.length != 0) {
		  let province = matchProvince.reduce((p, v) => (p.index < v.index ? v : p));
		  smartObj.province = province.province;
		  smartObj.provinceCode = province.provinceCode;
		  address = address.replace(province.matchValue, '');
		}
		//市查找
		let matchCity = []; //粗略匹配上的市
		matchAddress = '';
		for (let endIndex = 0; endIndex < address.length; endIndex++) {
		  matchAddress = address.slice(0, endIndex + 2);
		  this.addressList.forEach(el => {
			//  if (el.name == smartObj.province) {
			if (el.value == smartObj.provinceCode || !smartObj.provinceCode ) {
			  if (
				smartObj.province == '北京市' ||
				smartObj.province == '天津市' ||
				smartObj.province == '上海市' ||
				smartObj.province == '重庆市'
			  ) {
				el.children.forEach(item => {
				  item.children.forEach(res => {
					if (res['label'].indexOf(matchAddress) != -1) {
					  matchCity.push({
						county: res.label,
						countyCode: res.value,
						city: item.label,
						cityCode: item.value,
						matchValue: matchAddress,
						province: el.label,
						provinceCode: el.value
					  });
					}
				  });
				});
			  } else {
				el.children.forEach(res => {
				  if (res['label'].indexOf(matchAddress) != -1) {
					matchCity.push({
					  city: res.label,
					  cityCode: res.value,
					  matchValue: matchAddress,
					  province: el.label,
					  provinceCode: el.value
					});
				  }
				});
			  }
			}
			// }
		  });
		}
	  
		//统计筛选初略统计出的市
		matchCity.forEach(res => {
		  res.index = 0;
		  matchCity.forEach(el => {
			if (res.city == el.city) {
			  el.index++;
			  if (res.matchValue.length > el.matchValue.length) {
				el.matchValue = res.matchValue;
			  }
			}
		  });
		});
		if (matchCity.length != 0) {
		  let city = matchCity.reduce((p, v) => (p.index < v.index ? v : p));
		  smartObj.city = city.city;
		  smartObj.cityCode = city.cityCode;
		  smartObj.county = city.county;
		  smartObj.countyCode = city.countyCode;
		  if (!smartObj.province) {
			smartObj.province = city.province;
			smartObj.provinceCode = city.provinceCode;
		  }
		  address = address.replace(city.matchValue, '');
		}
	  
		//区县查找
		let matchCounty = []; //粗略匹配上的区县
		matchAddress = '';
		for (let endIndex = 0; endIndex < address.length; endIndex++) {
		  matchAddress = address.slice(0, endIndex + 2);
		  this.addressList.forEach(el => {
			//  if (el.name == smartObj.province) {
			if (
			  smartObj.province == '北京市' ||
			  smartObj.province == '天津市' ||
			  smartObj.province == '上海市' ||
			  smartObj.province == '重庆市'
			) {
			  //nothing
			} else {
			  el.children.forEach(item => {
				item.children = item.children?item.children:[]
				//  if (item.name == smartObj.city) {
				item.children.forEach(res => {
				  if (res['label'].indexOf(matchAddress) != -1) {

					//省/市  || 省 
					if (smartObj.province) {
						if (!smartObj.city) {
							//alert(res.code.slice(0, 4) +'|'+ JSON.stringify(smartObj));
							 if (res.label == matchAddress || res.label.replace(/(区|市|县)$/g,"")==matchAddress) {
								
							  matchCounty.push({
								county: res.label,
								countyCode: res.value,
								city: item.label,
								cityCode: item.value,
								matchValue: matchAddress,
								province: el.label,
								provinceCode: el.value
							  });
							}
		
						}else if (res.value.slice(0, 4) == smartObj.cityCode.slice(0, 4)) {
						matchCounty.push({
						  county: res.label,
						  countyCode: res.value,
						  city: item.label,
						  cityCode: item.value,
						  matchValue: matchAddress,
						  province: el.label,
						  provinceCode: el.value
						});
					  }
					} else if(!smartObj.province && !smartObj.city){
					  matchCounty.push({
						county: res.label,
						countyCode: res.value,
						city: item.label,
						cityCode: item.value,
						matchValue: matchAddress,
						province: el.label,
						provinceCode: el.value
					  });
					}
				  }
				});
				//  }
			  });
			}
			//  }
		  });
		}
		//统计筛选初略统计出的区县
		matchCounty.forEach(res => {
		  res.index = 0;
		  matchCounty.forEach(el => {
			if (res.city == el.city) {
			  el.index++;
			  if (res.matchValue.length > el.matchValue.length) {
				el.matchValue = res.matchValue;
			  }
			}
		  });
		});
		if (matchCounty.length != 0) {
		  let city = matchCounty.reduce((p, v) => (p.index < v.index ? v : p));
		  smartObj.county = city.county;
		  smartObj.countyCode = city.countyCode;
		  if (!smartObj.province) {
			smartObj.province = city.province;
			smartObj.provinceCode = city.provinceCode;
		  }
		  if (!smartObj.city) {
			smartObj.city = city.city;
			smartObj.cityCode = city.cityCode;
		  }
		  address = address.replace(city.matchValue, '');
		}
		
		//街道查找
		// let matchStreet = []; //粗略匹配上的街道查
		// matchAddress = '';
		// for (let endIndex = 0; endIndex < address.length; endIndex++) {
		//   matchAddress = address.slice(0, endIndex + 3);
		//   this.addressList.forEach(el => {
		// 	if (el.name == smartObj.province) {
		// 	  if (
		// 		smartObj.province == '北京市' ||
		// 		smartObj.province == '天津市' ||
		// 		smartObj.province == '上海市' ||
		// 		smartObj.province == '重庆市'
		// 	  ) {
		// 		//nothing
		// 	  } else {
		// 		el.children.forEach(element => {
		// 		  if (element.name == smartObj.city) {
		// 			element.children.forEach(item => {
		// 			  if (item.name == smartObj.county) {
		// 				item.children.forEach(res => {
		// 				  if (res['street'].indexOf(matchAddress) != -1) {
		// 					matchStreet.push({
		// 					  street: res.street,
		// 					  streetCode: res.code,
		// 					  matchValue: matchAddress
		// 					});
		// 				  }
		// 				});
		// 			  }
		// 			});
		// 		  }
		// 		});
		// 	  }
		// 	}
		//   });
		// }
		// //统计筛选初略统计出的区县
		// matchStreet.forEach(res => {
		//   res.index = 0;
		//   matchStreet.forEach(el => {
		// 	if (res.city == el.city) {
		// 	  el.index++;
		// 	  if (res.matchValue.length > el.matchValue.length) {
		// 		el.matchValue = res.matchValue;
		// 	  }
		// 	}
		//   });
		// });
	  
		// if (matchStreet.length != 0) {
		//   let city = matchStreet.reduce((p, v) => (p.index < v.index ? v : p));
		//   smartObj.street = city.street;
		//   smartObj.streetCode = city.streetCode;
		//   address = address.replace(city.matchValue, '');
		// }
		smartObj.location = address
		return smartObj;
	}
}
