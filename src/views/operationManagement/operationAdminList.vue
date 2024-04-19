<template>
    <div id="track">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<el-select v-model="value1" placeholder="请选择" class="item1" size="small" @change="emptyInput">
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="small" placeholder="请输入" v-model.trim="searchData.userName" class="item2" clearable v-if="value1 == '1'"></el-input>
						<el-input size="small" placeholder="请输入" v-model.trim="searchData.userCode" class="item2" clearable v-else></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作行为：</span>
						<el-select v-model="searchData.actionName" class="item2" filterable size="small" clearable>
							<el-option
								v-for="(item,key) in optionsAction"
								:key="key"
								:label="item.name"
								:value="item.name"
							></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作人机构：</span>
						<el-select v-model="searchData.org" class="item2" filterable size="small" clearable>
							<el-option
								v-for="(item,key) in optionsOrg"
								:key="key"
								:label="item.name"
								:value="item.code"
							></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作时间：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="searchData.operateStartDate" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
						<el-date-picker type="date" placeholder="结束日期" v-model="searchData.operateEndDate" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">数据编号：</span>
						<el-input v-model.trim="searchData.queryData" placeholder="请输入数据编号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">客户端：</span>
						<el-select v-model="searchData.platform" filterable class="item2" size="small" clearable>
							<el-option
								v-for="(item,key) in optionsPlatForm"
								:key="key"
								:label="item.name"
								:value="item.code"
							></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="search" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>
		<div class="content-table">
			<div class="content">
				<el-table :data="data1" border style="width: 100%">
					<el-table-column prop="date" label="操作时间/IP">
						<template slot-scope="scope">
							<p><span>{{scope.row.createTime}}</span></p>
							<p><span>IP：{{scope.row.ip}}</span></p>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="操作人/分支机构">
						<template slot-scope="scope">
							<p class="col-blue"><span>{{scope.row.operatorName}}</span> / <span>{{scope.row.operatorOrgName}}</span></p>
							<p><span>{{scope.row.queryData}}</span></p>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="操作行为">
						<template slot-scope="scope">
							<span>{{ scope.row.actionName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="客户端" width="140">
						<template slot-scope="scope">
							<span>{{ scope.row.platformName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="操作结果" width="100">
						<template slot-scope="scope">
							<span class="col-gre" v-if="scope.row.operateResult == 'success'">成功</span>
							<span class="col-red" v-else>失败</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="操作详情">
						<template slot-scope="scope">
							<span>{{ scope.row.remark }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"> </el-pagination>
		</div>
    </div>
</template>
<script>
import LoggerService from '@/service/LoggerService'
export default {
     data() {
        return {
			total: 0,
			pageNum: 1,
			currentPage: 1,
			pagesize: 10,
            data1: [],
			loggerService:new LoggerService(),
			value1:'1',
			optionsAction:[],
			optionsOrg:[],
			optionsPlatForm:[],
			options1:[
				{
					"value":"1",
					"label":"操作人姓名"
				},
				{
					"value":"2",
					"label":"操作人编号"
				}
			],
			searchData: {
				"operateEndDate": "",
				"operateStartDate": "",
				"operator": "",
				"org": "",
				"page": 1,
				"pageSize": 10,
				"platform": "",
				"queryData": "",
				"userName": "",
				"userCode": "",
				"channel": "",

			}
        }
	},
	created(){
		this.getSearch();
		this.getLog();
	},
	methods: {
		emptyInput() {
			this.searchData.userName = '';
			this.searchData.userCode = '';
		},
		async getSearch() {
			let {code,data} = await this.loggerService.getNewLogSearch({channel:"sequip"});
            if(code === '0000') {
				this.optionsAction = data.action;
				this.optionsOrg = data.org;
				this.optionsPlatForm = data.platForm;
            }
		},
		empty(){
			this.searchData = {
				"operateEndDate": "",
				"operateStartDate": "",
				"operator": "",
				"org": "",
				"page": 1,
				"pageSize": 10,
				"platform": "",
				"queryData": "",
				"userName": "",
				"userCode": "",
			};
			this.getLog();
		},
		handleSizeChange (pagesize) {
			this.pagesize = pagesize;
			this.getLog()
        },
        handleCurrentChange(pageNum){
            this.pageNum = pageNum;
			this.getLog()
        },
		search(){
			this.getLog();
		},
		async getLog(){
			this.searchData.page = this.pageNum;
			this.searchData.pageSize = this.pagesize
			this.searchData.channel = "sequip"
			let params = await this.loggerService.getNewLog(this.searchData);
			if(params.code == '0000') {
				console.log(params);
				this.total = params.data.total;
				this.data1 = params.data.list
			} else {
				this.total = 0;
				this.data1 = []
			}
		},
	},
}
  </script>
<style lang="less" scoped>
#track {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	background-color: #f2f1ef;
	.elesearch{
		// width: 100%;
		min-height: 180px;
		padding: 30px 20px;
		margin: 10px 20px;
		box-sizing: border-box;
		background-color: #ffffff;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 25%;
				margin-right: 10px;
				text-align: center;
			}
			.item2{
				width: 70%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 25%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 31%;
			}
		}
		.elesearch-btn{
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;
			.query-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				background-color: #f3ac56;
				text-align: center;
				line-height: 40px;
				margin-right: 40px;
				color: #ffffff;
				font-weight: 600;
				cursor: pointer;
				border-radius: 60px;
			}
			.empty-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				border: 1px solid #e9e9e9;
				text-align: center;
				line-height: 40px;
				color: #999;
				background-color: #e9e9e9;
				font-weight: 600;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 60px;
			}
		}
	}
	.content-table{
		width: 100%;
		height: 100%;
		padding:0 20px;
		box-sizing: border-box;
		.content{
			width: 100%;
			height: 100%;
			padding:0 20px 20px;
			box-sizing: border-box;
			background-color: #ffffff;
		}
	}
	.content-total{
		width: 100%;
		height: 60px;
		padding: 0 30px 20px;
		box-sizing: border-box;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
	}
}
</style>
  