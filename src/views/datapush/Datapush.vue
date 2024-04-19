<template>
	<div class="data-push" id="dataPush">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="12"><div>
					<span class="item1">保单号/批单号</span>
					<el-input placeholder="请输入保单号/批单号" v-model.trim="policyNo" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="12"><div>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content-table" v-if="data.length">
			<el-table :data="data" style="width:70%;" highlight-current-row show-header fit>
				<el-table-column prop="productName" label="产品名称" align="center" width="170"></el-table-column>
				<el-table-column prop="applicationFormCode" label="投保单号/批单申请号" align="center" min-width="210"></el-table-column>
				<el-table-column prop="policyNo" label="保单号/批单号" align="center" min-width="210"></el-table-column>
				<el-table-column prop="status" label="推送状态" align="center" width="135">
					<template slot-scope="scope">
						<div v-if="scope.row.productCode == '19PR502997' || scope.row.productCode == '19PR232767' || scope.row.productCode == '20PR431440'">
							<span v-if="scope.row.status == '1' || scope.row.batchStatus == '1'">推送成功</span>
							<span v-else-if="scope.row.status == '0' && scope.row.batchStatus == '0'">未推送</span>
							<span class="item3" v-else-if="scope.row.status == '2' && scope.row.batchStatus == '2'">推送失败</span>
							<span class="item3" v-else-if="scope.row.status == '0' && scope.row.batchStatus == '2'">推送失败</span>
							<span class="item3" v-else-if="scope.row.status == '2' && scope.row.batchStatus == '0'">推送失败</span>
						</div>
						<div v-else>
							<span v-if="scope.row.batchStatus == '0'">未推送</span>
							<span v-if="scope.row.batchStatus == '1'">推送成功</span>
							<span class="item3" v-if="scope.row.batchStatus == '2'">推送失败</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="pushTime" label="推送时间" align="center" width="160">
					<template slot-scope="scope">
						<div v-if="scope.row.productCode == '19PR502997' || scope.row.productCode == '19PR232767' || scope.row.productCode == '20PR431440'">
							<span v-if="scope.row.status == '1'">{{scope.row.pushTime}}</span>
							<span v-else-if="scope.row.batchStatus == '1'">{{scope.row.batchPushTime}}</span>
						</div>
						<div v-else>
							<span>{{scope.row.batchPushTime}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="120">
					<template slot-scope="scope" type="flex">
						<span v-if="scope.row.status != '1' && scope.row.batchStatus != '1'" class="item4" @click="manualpush(scope.row)">手动推送</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
			 </el-table>
		</div>
	</div>
</template>

<script>
import UserService from '../../service/UserService'
import product from '../businessProcessing/data/dtProductList.json'
export default {
	data() {
		return {
			UserService:new UserService(),
			policyNo:'',
			data:[],
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	methods: {
		async searchview(){ // 查询
			if(this.policyNo){
				const res = await this.UserService.getDataPushList(this.policyNo);
				if(res.code == '0000'){
					if(res.list.length){
						product.data.find(item =>{
							if(item.productCode == res.list[0].productCode){
								res.list[0].productName = item.productName
							}
						})
						this.data = res.list;
					}else{
						this.$message({
							message: '请检查输入的保单号是否需要推送',
							type: 'warning'
						});
					}
				}
			}else{
				this.$message({
					message: '请输入要查询的保单号',
					type: 'warning'
				});
			}
		},
		async manualpush(row){ // 手动推送
			const res = await this.UserService.dataPushList(row.applicationFormCode,row.productCode);
			if(res.code == '0000'){
				this.$message({
					message: '推送成功',
					type: 'successs'
				});
				this.searchview()
			}
		},
	},
}
</script>

<style lang="less">
#dataPush{
	padding-bottom: 80px;
	box-sizing: border-box;
	.elesearch{
		width: 100%;
		padding: 31px 37px 20px 21px;
		box-sizing: border-box;
		.row-bg{
			.item1{
				display: inline-block;
				width: 30%;
				text-align: center;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				vertical-align: middle;
			}
			.item2{
				width: 40%;
			}
			.query-button{
				width: 100px;
				height: 40px;
				font-weight: 600;
			}
		}
	}
	.content-table{
		width: 100%;
		padding: 0 37px 0 21px;
		box-sizing: border-box;
		.item3{
			color: #FD0000;
		}
		.item4{
			color: #4478FC;
			cursor: pointer;
		}
	}
}
</style>
