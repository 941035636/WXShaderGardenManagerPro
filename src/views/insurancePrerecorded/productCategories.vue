<template>
	<div class="productCategories" id="productCategories">
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border size='small'>
				<el-table-column width="50" align="center" label="选择">
					<template slot-scope="scope"> 
						<div style="text-align: center; padding-left:5px">  
							<el-radio :label="scope.row" v-model="templateRadio">&nbsp;</el-radio>
						</div>
					</template>
				</el-table-column>
				<el-table-column  type="index" label="序号" width="80" align="center"></el-table-column>
				<!-- <el-table-column prop="appCode" label="行业" align="center" width="170"></el-table-column>
				<el-table-column prop="policyNo" label="险类" align="center" width="280"></el-table-column> -->
				<el-table-column prop="name" label="产品名称" align="center" width="300"></el-table-column>
				<el-table-column prop="height" label="销售地区" align="center" >
					<template slot-scope="scope">
						<span v-for="(item,key) in scope.row.areaBeanList" :key="key"><span>{{item.areaName}}</span></span>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="numbers">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<div class="content-total">
			<el-button type="primary" @click="nextbu">开始预录投保单</el-button>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
export default {
	data() {
		return {
			templateRadio:'',
			Elevator:new elevator(),
			data1:[],
			total: 0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		this.getprolist();
	},
	methods: {
		async getprolist(){
			let form = {
				'areaCodeList':[window.sessionStorage.getItem('provinceCode')],
				'classCodeList':['LB1618924476970565632'],
				'pn':this.pageNum,
				'ps':this.pagesize
			};
			let res = await this.Elevator.getprolist(form);
			if(res.code=='0000'){
				if(res.list){
					this.data1 = res.list;
					this.total = res.total;
					if(window.sessionStorage.getItem('provinceCode') == '440000'){
						for(var i=0;i<this.data1.length;i++){
							if(this.data1[i].areaBeanList[0].areaCode == '440300'){
								this.data1.splice(i,1)
							}
						}
					}
				}else{
					this.getprolists();
				}
				
			}
			
		},
		async getprolists(){
			let provinceCode = window.sessionStorage.getItem('provinceCode').slice(0,2) + '0000'
			let form = {
				'areaCodeList':[provinceCode],
				'classCodeList':['LB1618924476970565632'],
				'pn':this.pageNum,
				'ps':this.pagesize
			};
			let res = await this.Elevator.getprolist(form);
		 	let {code,list} = res.data;
			if(code=='0000'){
				this.data1 = list;
				this.total = res.data.total;
			}
			
		},
		handleSizeChange: function (pagesize) {
		    this.pagesize = pagesize;
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.getprolist();
		},
		nextbu(){
			if(!this.templateRadio){
				this.$message.error('请选择产品');
				return
			}else if(this.templateRadio.code == this.$globalProductCode.PRODUCT_CODE_NJ){
				if(this.$route.query.userType == '个人'){
					this.$message.error('个人不允许投保南京电梯责任险,请确定用户类型');
					return
				}
			}
			
			let attrInfoDTOList =this.templateRadio.attrInfoDTOList
			const productFlag = attrInfoDTOList[attrInfoDTOList.map(item=>item.attrCode).indexOf('productSort')];
			const valueMark=productFlag?productFlag.attrDTOList[0].valueMark:'';
			let name;
			if(valueMark=="dt"){
				name='addPolicy'
			}else if(valueMark=="雇主"){
				this.$message('尚未开发');							

			}else if(valueMark=="团意"){
				this.$message('尚未开发');							

			}else if(valueMark=="索道"){
				this.$message('尚未开发');							

			}else {
				this.$message('尚未开发');							
				return
			}
			window.localStorage.setItem('userCode',this.$route.query.userCode);
				this.$router.push({
					name:name,
					params:{
						productCode:this.templateRadio.code,
					}
				})
			
		},
	},
}

</script>

<style lang="less">
#productCategories {
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.content-table{
		width: 90%;
		margin-left: 5%;
		margin-top: 20px;
		.item4{
			font-size: 12px;
			text-decoration: underline;
			color: #4E80FF;
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.numbers{
		width: 95%;
		margin-top: 20px;
		margin-bottom: 20px;
		text-align: center;
	}
}
</style>
