import RidesService from '@/service/RidesService'
import CorrectionManagement from '@/service/CorrectionManagement'
import ProductService from '@/service/ProductService'
import {elevator} from '@/server/accidenServer.js';
import buttonSelection from '@/views/businessProcessing/js/buttonSelection.js';
export const GetBaseData = {
    data() {
        return {
					Elevator:new elevator(),
					ButtonSelection:new buttonSelection(),
					RidesService: new RidesService(),
					CorrectionManagement:new CorrectionManagement(),
					ProductService: new ProductService(),
        }
    },
    methods:{
			/**
			 * 获取缓存数据
			 * @param {*} flag 险种标识	
			 * @param {*} fatherComponents 调用该方法父组件的标识
			 */
        async getRides(flag,fatherComponents) {
					let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
					if(branchRid.code == '0000' && branchRid.data) {
						if(this.optionsArea) {
							this.options22 = JSON.parse(branchRid.data).options2;
							this.setArea();
						}
						this.branchList1 = JSON.parse(branchRid.data).branchList;
						this.setBranch();
						this.getDist(fatherComponents);
					} else {
						Promise.all([this.getArea(),this.loadBranch(fatherComponents)]).then((res)=> {
						// this.setRides();
						}) 
					}
				if(window.sessionStorage.getItem('branchCode') == 'JT0000' && this.options33) {
					let totalProducts = JSON.parse(window.sessionStorage.getItem('totalProducts'));
					console.log(totalProducts);
					if(totalProducts) {
							this.options33 = totalProducts
					} else {
							let provinceCode = '';
							if(sessionStorage.getItem('branchCode') == 'JT0000'){
									provinceCode = ['000000']
							}else{
									provinceCode = sessionStorage.getItem('authDataArea').split(',')
							}
							let data = {
									'areaCodeList':provinceCode,
									'channel':'sequip',
									'pn':1,
									'ps':1000,
									'upOrDown':"0"
							};
							let res = await this.ProductService.getProductListV3(data);
							if(res.code == '0000' && res.list){
									res.list.forEach(item => {
										let obj = {
												productCode: item.code,
												productName: item.name,
												productCategory1: item.attrInfoDTOList.find(i => i.attrCode == 'productSort') ? item.attrInfoDTOList.find(i => i.attrCode == 'productSort').attrDTOList[0].valueMark : ''
										}
										this.options3.push(obj);
										this.options33.push(obj);
										window.sessionStorage.setItem('totalProducts',JSON.stringify(this.options33))
									})
							}
					}
					if(flag) {
							this.options3 = this.options33.filter(item1 => item1.productCategory1 == flag) 
					} else {
							this.options3 = this.options33
					}
			} 
		},
		// 获取所有的分支机构
		async loadBranch(flag){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.branchList1 = res.list;
				this.setBranch();
				this.getDist(flag);
			}
        },
		//设置分支机构
		setBranch() {
			let branchCode = window.sessionStorage.getItem('branchCode');
			let authArr = sessionStorage.getItem('authDataInfo').split(',');
			if(branchCode == 'JT0000'){
				if(!this.branchList1.find(item => item.jtBranchCode == 'JT0000')) {
					this.branchList1.push({
						"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"
					})
				}
				this.branchList = this.branchList1;
			}else{
				authArr.forEach(authBranch => {
					if(authBranch == 'JT0144000') {
						this.branchList.push({"jtBranchCode":"JT0144001","jtBranchName":"广东分公司本部"})
					}
					this.branchList1.forEach(item =>{
						if(item.jtBranchCode == authBranch){
							this.branchList.push(item)
						}
					})
				})
			}
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.optionsArea = parmes.data;
				this.setArea();
			};
		},
		//处理地区
		setArea() {
			if(window.sessionStorage.getItem('provinceCode') == '000000') {
				this.optionsArea = this.options22;
			} else {
				this.optionsArea = this.ButtonSelection.Accessarea(this.options22, window.sessionStorage.getItem('provinceCode'));
			}
		},
    }
}