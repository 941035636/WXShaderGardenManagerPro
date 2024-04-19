<template>
	<div id="ProductInfos">
		<Title :titles="title"></Title>
		<div class="content-tabel mt20">
			<el-table :data="productInfo.tableData" :span-method="objectSpanMethod" border style="width: 100%;" fit :header-cell-style="getRowClass" class="mb20">
				<el-table-column prop="riskName" label="险种"></el-table-column>
				<el-table-column prop="dutyName" label="责任"></el-table-column>
				<el-table-column prop="name" label="限额"></el-table-column>
				<el-table-column prop="showValue" label="限额值">
					<template slot-scope="scope">
						<span v-if="scope.row.showValue / 10000 >= 1">{{scope.row.showValue/10000}}万元</span>
						<span v-else>{{scope.row.showValue}}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-form :model="productInfo" class="demo-ruleForm num-style" label-position="right" label-width="130px" v-if="productInfo.productSort != 'jc'">
				<span class="num-bd">标的数量</span>
				<el-form-item label="从业人员数：" v-if="productInfo.employees">
					<span>{{productInfo.employees}}</span>
				</el-form-item>
				<el-form-item label="设备数量：" v-if="productInfo.sequipmentNum">
					<span>{{productInfo.sequipmentNum}}</span>
				</el-form-item>
				<el-form-item label="物业项目数量："  v-if="productInfo.propertyNum">
					<span>{{productInfo.propertyNum}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'ProductInfos',
	props:{
		'productInfo':Object
	},
	components:{
		Title
	},
	data() {
		return {
			title:'产品信息'
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background-color: #EFF1F6;color:#6683D5;font-weight: 600;height:40px;';
            } else {
                return 'background: #fff';
            }
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			var beginIndex;
			var endIndex;
			for(var i=0;i<this.productInfo.tableData.length;i++){
				var item = this.productInfo.tableData[i];
				if(columnIndex == 0) {
					if(row.riskCode == item.riskCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
				if(columnIndex == 1) {
					if(row.riskCode == item.riskCode && row.dutyCode == item.dutyCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
			}
			if((beginIndex || beginIndex == 0) && (endIndex || endIndex == 0) &&  beginIndex == rowIndex) {
				var row = endIndex - beginIndex + 1;
				return { rowspan: row, colspan: 1 };
			}else if(!endIndex) {
				return { rowspan: 1, colspan: 1 };
			}else{
				return { rowspan: 0, colspan: 0 };
			}
		},
	}
};
</script>

<style lang="less">
#ProductInfos{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content-tabel{
		margin: 20px;
		width: calc(100% - 40px);
		height: 100%;
		.num-bd {
			font-size: 18px;
			color: #000;
			font-weight: bold;
		}
	}
}
</style>
