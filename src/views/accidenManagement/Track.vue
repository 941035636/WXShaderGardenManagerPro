<template>
    <div id="track">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作编号：</span>
						<el-input v-model.trim="value1" placeholder="请输入" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">业务类型：</span>
						<el-select v-model="value8" clearable placeholder="请选择" size="small" class="item1">
							<el-option v-for="item in configData.opType" :key="item.value"  :label="item.label" :value="item.value" ></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作节点：</span>
						<el-select v-model="value6" clearable placeholder="请选择" size="small" class="item1">
							<el-option v-for="item in configData.opNode" :key="item.value"  :label="item.label" :value="item.value" ></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作类型：</span>
						<el-select v-model="value5" clearable placeholder="请选择" size="small" class="item1">
							<el-option v-for="item in configData.opName" :key="item.value"  :label="item.label" :value="item.value" ></el-option>
						</el-select>
					</div>
				</el-col>
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
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">所属项目：</span>
						<el-cascader v-model="value4" :options="productConfig" @change="handleChange1" placeholder="请选择" size="small" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">操作时间：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="startTime[0]" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1"> 至 </span>
						<el-date-picker type="date" placeholder="结束日期" v-model="startTime[1]" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">流水号：</span>
						<el-input v-model.trim="value7" placeholder="请输入" size="small" clearable class="item2"></el-input>
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
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作编号
							</div>
						</el-col>
						<el-col :span="6">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作信息
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								业务类型
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作节点/类型
							</div>
						</el-col>
						<el-col :span="8">
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
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.dc}}</span></p>
								<p v-if="item.dc1"><span>{{item.productName}}</span></p>
							</div>
						</el-col>
						<el-col :span="6">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.createTime}}</span><span class="ts-style" v-if="item.term == '1'">特设保</span><span class="ts-style" v-else>电梯智保</span></p>
								<p><span v-if="item.un">{{item.un}}</span><span v-if="item.uc">({{item.uc}})</span></p>
								<p><span>{{item.opIp}}</span><span>/{{item.termVer}}</span></p>
								<p v-if="item.oc">流水号：<span>{{item.oc}}</span> <span class="col-blue1 cur-op" @click="searchOc(item.oc)"> (筛选)</span></p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span>{{item.opTypeName}}</span>
								</p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									 <span>{{item.opNodeName}}</span><span> / {{item.opNameName}}</span>
								</p>
							</div>
						</el-col>
						<el-col :span="8">
							<div style="padding:15px 10px;box-sizing: border-box;" class="show-tip">
								<p :title="item.opDetail"><span>{{item.opDetail}}</span></p>
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
import {Insurance} from '../../server/accidenServer.js';
import configData from './data/track-config.json'
import productConfig from '../businessProcessing/data/productClassification.json'
export default {
     data() {
        return {
			total: 0,
			pageNum: 1,
			currentPage: 1,
			pagesize: 20,
            data1: [
				{
					dc:'',
					dc1:'',
					oc:'',
					opType:"",
					opName:"",
					opNode:"",
					opDetail:"",
					term:"",
					sysCode:"",
					os:"",
					termVer:"",
					opIp:"",
					uc:"",
					un:"",
					createTime:"",
				}
			],
			configData:configData,
			productConfig:productConfig.data2,
			value:'',
			startTime: ["",""],
			endTime: '',
			applicantClass:new Insurance(),
			datas:'',
			value1:'',
			value2:'',
			value3:'',
			value4:'',
			value5:'',
			value6:'',
			value7:'',
			value8:'',
			where:'',
        }
      },
	  created(){
		this.getInsurance();
	  },
	methods: {
		// 获取选择的产品
		handleChange1(value){ 
			
		},
		searchOc(ocNum) {
			this.pageNum = 1;
			this.value7 = ocNum;
			this.search();
		},
		empty(){
			this.value1='';
			this.value2='';
			this.value3='';
			this.value4=[];
			this.value5='';
			this.value6='';
			this.value7='';
			this.value8='';
			this.pageNum = 1;
			this.startTime = ["",""];
			this.getInsurance();
		},
		handleSizeChange: function (pagesize) {
            this.pagesize = pagesize;
        },
        handleCurrentChange: function(pageNum){
            this.pageNum = pageNum;
			if(this.value1 == "" && this.value2 == "" && this.value3 == "" && this.value4 == [] && this.value5 == "" && this.value6 == "" && this.startTime[0] == "" && this.startTime[1]){
				this.getInsurance(pageNum)
			}else{
				this.assignment()
				this.getInsurance(pageNum)
			}
        },
		dateChangebirthday1(val) {
		   this.startTime = val;
		   console.log(this.startTime);
		 },
		search(){
			this.assignment();
			this.getInsurance();
			this.where="";
		},
		assignment(){
			var list={};
			this.where="";
			if(this.value1){
				list.dc =this.value1
			}
			if(this.value4[1]){
				list.dc1=this.value4[1]
			}
			if(this.value5){
				list.opName=this.value5
			}
			if(this.value6){
				list.opNode=this.value6
			}
			if(this.value2){
				list.uc=this.value2
			}
			if(this.value3){
				list.un=this.value3
			}
			if(this.value7){
				list.oc=this.value7
			}
			if(this.value8){
				list.opType=this.value8
			}
			if(this.startTime[0]){
				list.createTime=this.startTime[0]
			}
			var arr = [];
			var arrs = [];
			for(var i in list){
				arr.push(list[i])
				arrs.push(i)
			}
			let whereStr = "";
			if(this.startTime[0] && this.startTime[1]) {
				whereStr = 'createTime'+'>'+'"'+this.startTime[0]+'"'+'and'+' '+'createTime'+'<'+'"'+this.startTime[1]+'"'
			} else {
				if(this.startTime[0]) {
					whereStr = 'createTime'+'>'+'"'+this.startTime[0]+'"'
				}
				if(this.startTime[1]) {
					whereStr = 'createTime'+'<'+'"'+this.startTime[1]+'"'
				}
			}
			if(arr.length=="1"){
				if(whereStr != ""){
					this.where += whereStr
				}else{
					this.where += arrs[0]+'='+'"'+arr[0]+'"'
				}
			}else if(arr.length == "2"){
				if(whereStr != ""){
					delete list.createTime
					var wheres = whereStr
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '
					this.where += wheres
				}else{
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'
				}
			}else if(arr.length == "3"){
				if(whereStr != ""){
					delete list.createTime
					var wheres = whereStr
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '
					this.where += wheres
				}else{
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'
				}
			}else if(arr.length == "4"){
				if(whereStr != ""){
					delete list.createTime
					var wheres = whereStr
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'+'and'+' '
					this.where += wheres
				}else{
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'+'and'+' '+arrs[3]+'='+'"'+arr[3]+'"'
				}
			}else if(arr.length == "5"){
				if(whereStr != ""){
					delete list.createTime
					var wheres = whereStr
					this.where +=  arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'+'and'+' '+arrs[3]+'='+'"'+arr[3]+'"'+'and'+' '
					this.where += wheres
				}else{
					this.where += arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'+'and'+' '+arrs[3]+'='+'"'+arr[3]+'"'+'and'+' '+arrs[4]+'='+'"'+arr[4]+'"'
				}
			}else if(arr.length == "6"){
					delete list.createTime
					var wheres = whereStr
					this.where +=arrs[0]+'='+'"'+arr[0]+'"'+'and'+' '+arrs[1]+'='+'"'+arr[1]+'"'+'and'+' '+arrs[2]+'='+'"'+arr[2]+'"'+'and'+' '+arrs[3]+'='+'"'+arr[3]+'"'+'and'+' '+arrs[4]+'='+'"'+arr[4]+'"'+'and'+' '
					this.where += wheres
			}
		},
		whereFormat(whereStr) {
			let Base64 = require('js-base64').Base64
			let code = Base64.encode(whereStr)
			// let md5Password = this.$md5(whereStr);
			let passArray = code.split('');
			for(let i = 1; i < passArray.length; i+=2) {
				let temporary = passArray[i];
				passArray[i] = passArray[i-1];
				passArray[i-1] = temporary;
			}
			let totalNumber = 0;
			let result = passArray.join('')+totalNumber;
			return result;
		},
		
		async getInsurance(){
			console.log(this.where);
			let data = {
				pn:this.pageNum,
				ps:this.pagesize,
				where:this.whereFormat(this.where),
				orderType: 'desc',
				orderField:'createTime'
			};
			let params = await this.applicantClass.getInsurance(data);
			if(params.code == '0000') {
				this.datas = params.data;
				this.total = params.total;
				this.data1 = params.list
				this.data1.map(item => {
					item.opTypeName = this.configData.opType.find(subItem => subItem.value == item.opType) ? this.configData.opType.find(subItem => subItem.value == item.opType).label : ''
					item.opNameName = this.configData.opName.find(subItem => subItem.value == item.opName) ? this.configData.opName.find(subItem => subItem.value == item.opName).label : ''
					item.opNodeName = this.configData.opNode.find(subItem => subItem.value == item.opNode) ? this.configData.opNode.find(subItem => subItem.value == item.opNode).label : ''
					let classPro = this.productConfig.find(subItem => subItem.value == item.opType);
					if(classPro) {
						item.productName = classPro.children.find(subItem => subItem.value == item.dc1) ? classPro.children.find(subItem => subItem.value == item.dc1).label : '' ;
					} else {
						item.productName = '';
					}
				})
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
		min-height: 234px;
		padding: 30px 20px;
		margin: 10px 20px;
		box-sizing: border-box;
		background-color: #ffffff;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
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
	.col-blue1 {
		color: #1890ff;
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
	.show-tip {
		// width:500px;
		overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:4;  /* 设置行数 */
		-webkit-box-orient: vertical;
		height: 130px;
		color: #fa8c16;
	}
	.ts-style {
		background-color: #b5f5ec;
		border: none;
		border-radius: 19px;
		padding: 2px 10px;
		margin-left: 10px;
	}
}
  </style>
  