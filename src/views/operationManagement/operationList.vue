<template>
    <div id="track">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">数据编号：</span>
						<el-input v-model.trim="value1" placeholder="请输入数据编号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作类型：</span>
						<el-select v-model="value4" class="item2" size="small">
							<el-option
								v-for="(item,key) in options"
								:key="key"
								:label="item.lable"
								:value="item.value"
							></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作时间：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="startTime[0]" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker type="date" placeholder="结束日期" v-model="startTime[1]" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作人编号：</span>
						<el-input v-model.trim="value2" placeholder="请输入操作人编号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作人姓名：</span>
						<el-input v-model.trim="value3" placeholder="请输入操作人姓名" size="small" clearable class="item2"></el-input>
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
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="5">
							<div style="padding-left:10px;box-sizing: border-box;">
								时间
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作人 / 数据编号
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作类型
							</div>
						</el-col>
						<el-col :span="9">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作详情
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="data1.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="5">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.opTime}}</span></p>
								<p><span>IP：{{item.userIp}}</span></p>
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span class="col-blue">{{item.opUser}}</span>
									<span>({{item.userCode}})</span>
								</p>
								<p>
									<span>数据编码：</span>
									<span>{{item.btypeCode}}</span>
								</p>
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p class="col-blue">
									<span>{{item.btype}}</span>
									<span>/</span>
									<span>{{item.opType}}</span>
								</p>
								<p>
									<span>{{item.client}}</span> <span>({{item.clientCode}})</span>
								</p>
							</div>
						</el-col>
						<el-col :span="9">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.opContent}}</span></p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
    </div>
</template>
<script>
import {Operation} from '../../server/accidenServer.js';
import logInfoNew from '../../../static/data/log-info-new.json';
export default {
     data() {
        return {
			total: 0,
			pageNum: 1,
			currentPage: 1,
			pagesize: 20,
            data1: [],
			startTime: ["",""],
			Operation:new Operation(),
			value1:'',
			value2:'',
			value3:'',
			value4:'',
			where:'',
			options:[]
        }
	},
	created(){
		// this.getInsurance();
		this.options = logInfoNew.data.map((item)=>{
			let obj = {
				value:item.operationTypeCode,
				lable:item.actionType,
			}
			return obj
		}) 
	},
	methods: {
		empty(){
			this.value1='';
			this.value2='';
			this.value3='';
			this.value4='';
			this.startTime = ["",""];
			this.pageNum = 1;
			this.currentPage = 1;
			this.getInsurance();
		},
		handleSizeChange (pagesize) {
			this.pagesize = pagesize;
			this.getInsurance()
        },
        handleCurrentChange(pageNum){
            this.pageNum = pageNum;
			this.getInsurance()
        },
		dateChangebirthday1(val) {
			this.startTime = val;
		},
		search(){
			this.getInsurance();
		},
		async getInsurance(){
			let data = {
				pn:this.pageNum,
				ps:this.pagesize,
				userCode:this.value2,	// 操作用户编码
				userName:this.value3,	// 操作用户名称
				channelCodes:"sequip",	// 渠道编码
				opsTime:this.startTime[0]?this.startTime[0]:'',	// 操作时间起期
				opeTime:this.startTime[1]?this.startTime[1]:'',	// 操作时间止期
				opTypeCode:this.value4,	// 操作类型编码
				bTypeCode:this.value1,	// 业务类型编码/数据编码
				sort:'1',	// 操作时间排序(0-正序 1-倒序)
			};
			let params = await this.Operation.getRecord(data);
			if(params.code == '0000') {
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
				width: 8%;
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
	.content-up{
		width: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 16px;
		color: #999;
		font-weight: 500;
		text-align: center;
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
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
				p{
					line-height: 30px;
				}
			}
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
  