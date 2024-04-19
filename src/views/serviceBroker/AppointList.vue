<template>
	<div id="AppointList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">经纪人名称</span>
						<el-input size="medium" v-model.trim="ruleForm.agentName" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
        <el-col :span="8">
					<div>
						<span class="item3">产品区域：</span>
						<el-cascader
                             v-model="selectedOptions"
                             class="item2"
                             size="medium"
                             :options="areaList"
                             placeholder="请选择区域"
                             @change="changeSetData"
							:props="{ checkStrictly: true }"
                             clearable
            ></el-cascader>
					</div>
				</el-col>
			
		<el-col :span="8">
			<span class="item3">预约时间</span>
			<el-date-picker v-model="ruleForm.regStartTime" type="date" class="item5" placeholder="选择日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
			<el-date-picker v-model="ruleForm.regEndTime" type="date" class="item5" placeholder="选择时间" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
		</el-col>
	</el-row>
     <el-row type="flex" class="row-bg"> 
		<el-col :span="8"
          >
            <span class="item3">分支机构：</span>
            <el-select
              v-model="ruleForm.branchCode"
              placeholder="请选择分支机构"
              class="item2"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in branchList"
                :key="index"
                :label="item.jtBranchName"
                :value="item.jtBranchCode"
              ></el-option>
            </el-select></el-col>
		<el-col :span="8">
				<span class="item3">状态：</span>
				<el-select size="medium" v-model="ruleForm.appointmentStatus" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
		</el-col>
	 </el-row>
	<el-row>
        <el-col :span="24" style="text-align:right">
					<div>
            <el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
					</div>
				</el-col>
      </el-row>
		</div>
		<div class="content">
			<div class="tips"><span class="tips-content">预约电话和预约内容会以邮件形式发送到预约经纪人邮箱</span></div>
			<div class="content-table">
				<el-table :data="appointList" style="width: 100%;color:#000000" border :header-cell-style="getRowClass1">
					<el-table-column label="预约电话"  width="180">
						<template slot-scope="scope">
							<div style="display:flex;">
								<div class="col-black">
                                    <p>{{scope.row.appointmentPhone}}</p>
								</div>
							</div>
						</template>
					</el-table-column>

					<el-table-column label="预约内容"  width="280">
						<template slot-scope="scope">
							<el-tooltip class="tooltip" :content="scope.row.appointmentContent" placement="top">
                <p class="row-factor cursor">{{scope.row.appointmentContent}}</p>
              </el-tooltip>
						</template>
					</el-table-column>
				
					<el-table-column label="预约时间" prop="appointmentTime"></el-table-column>

					<el-table-column label="产品区域" width="170">
						<template slot-scope="scope">
							<p v-for="(item,index) in scope.row.areaName" :key="index">{{item}}</p>
						</template>
					</el-table-column>

					<el-table-column label="分支机构" width="200">
						<template slot-scope="scope">
							<span>{{scope.row.jtBranchName}}</span>
						</template>
					</el-table-column>

					<el-table-column label="预约经纪人信息" width="200">
						<template slot-scope="scope">
							<p> {{ scope.row.agentName }} <span> ( {{scope.row.agentPhone}} ) </span></p>
						</template>
					</el-table-column>

					<el-table-column label="状态(打开待处理、关闭已处理)" width="150" align="center">
						<template slot-scope="scope">
							<p>{{scope.row.statusFlag }} </p>
						</template>
					</el-table-column>


				</el-table>
				<el-pagination class="fr mt20" background @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="ruleForm.pn" :page-sizes="[10, 20, 30, 40]" :page-size="ruleForm.ps" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import videoService from '@/service/videoService';
import policyService from "@/service/policyService.js";
import CorrectionManagement from "@/service/CorrectionManagement.js";
import BrokerServer from '@/service/brokerServer'
import { elevator } from "../../server/accidenServer.js";
export default {
	data() {
		return {
			correctionManagement: new CorrectionManagement(),
      brokerServers:new BrokerServer(),
      videoService: new videoService(),
      policyService: new policyService(),
      Elevator: new elevator(),
			ruleForm:{
				pn: 1, // 当前页 ,
				ps: 10, // 每页显示条数 ,
        		corpName:"",
        		channelCode:"sequip",
				threeInOneCode:"",
				regStartTime:"",
				regEndTime:"",
				isSuccess:"all",
        		branchCode: "",
				appointmentTime:"",
				agentName:'',
			},
			branchList: [], //分支机构
	    selectedOptions:[],
      areaList:[],
			options7:[
				{
					alue: '',
					label:'全部',
				},
				{
					value: '00',
					label:'待处理',
				},
				{
					value: '01',
					label:'已处理',
				}
				// {
				// 	value: '01',
				// 	label:'有效',
				// },
				// {
				// 	value: '00',
				// 	label:'无效',
				// }
			],
			videoList:[],
      total: 0,
      mapArea:{},
      appointList:[],
      rolShow:false,
		}
	},
	created(){
    this.getInit();
	},
	methods: {
    async getInit(){
      this.roleData();
      await this.loadBranch();
      this.getArea();
      await this.getVideoList();
    },
    roleData() {
			let branchCode = window.sessionStorage.getItem("branchCode");
			if (branchCode == "JT0000") {
				this.rolShow = true;
			}
		},
    async getArea() {
      //获取地区
      let res = await this.policyService.getAreaMap();
      if (res.code == "0000") {
		res.data["000000"] = "全国"
        this.mapArea = res.data;
      }
			if (!this.rolShow) {
				let area = window.sessionStorage.getItem("authDataArea");
				let areaArr = area.split(",");
				this.areaList = areaArr.map((item) => {
					for (const i in this.mapArea) {
						if(item == i){
							return {
								label: this.mapArea[item],
								value: item,
							};
						}
					}
				});
			} else {
				let parmes = await this.Elevator.getAreas();
				if (parmes.code == "0000") {
					this.areaList = parmes.data;
					var areaObj = {
						// children:[],
						label:"全国",
						value:'000000'
					}
					this.areaList.unshift(areaObj)
				}
			}
		},
	async loadBranch() {
      let res = await this.correctionManagement.getBranchInfo();
      if (res.code == "0000") {
        let branchCode = sessionStorage.getItem("branchCode");
        if (!this.rolShow) {
				var branchArr = []
				var authDataInfo = sessionStorage.getItem("authDataInfo").split(",")
				res.list.forEach(res => {
					for (const key in authDataInfo) {
						if (res.jtBranchCode == authDataInfo[key]) {
							branchArr.push(res)
						}
					}
				})
				console.log("helloworld");
			    // this.branchList = res.list.filter(item=>item.jtBranchCode == branchCode);
				this.branchList = branchArr
        }else{
				this.branchList = res.list;
		}
      }
    },
		searchview() {
			this.ruleForm.pn = 1;
			this.getVideoList();
		},
		empty() {
			this.selectedOptions=[],
			this.ruleForm={
				"pn": 1, // 当前页 ,
				"ps": 10, // 每页显示条数 ,
				"corpName":"",
				"threeInOneCode":"",
				"regStartTime":"",
				"regEndTime":"",
        "isSuccess":"all",
        "channelCode":"sequip",
        "branchCode": "",
				"appointmentTime":"",
				"agentName":'',
			},
			this.searchview();
		},
		async getVideoList() { 
			let res = await this.brokerServers.appointList(this.ruleForm);
      console.log(this.branchList,"1111")
			if(res.data.code == '0000') {
				res.data.list.forEach(async item => {
					item['areaName'] = [];
					item.statusFlag = item.appointmentStatus == '00' ?  '待处理' : '已处理';
					item['jtBranchName']= this.branchList.find(it=> it.jtBranchCode == item.branchCode).jtBranchName
					if(item.productArea !='000000'){
						let areaList =  item.productArea.split(',')
						areaList.forEach(it =>{  // 省市区编码转中文
						let areaObj = this.getAllAreaObj(it)
						let areaName1 = ""
						if(areaObj.area){
							areaName1 = `${this.mapArea[areaObj.area2]},${this.mapArea[areaObj.area1]},${this.mapArea[areaObj.area]}`
						}else if(areaObj.area1){
							areaName1 = `${this.mapArea[areaObj.area2]},${this.mapArea[areaObj.area1]}`
						}else{
							areaName1 = this.mapArea[areaObj.area2]
						}
						item.areaName.push(areaName1)
						})
					}else{
						item.areaName.push('全国')
					}
        })
        this.appointList = res.data.list;
			}
			this.total = res.data.total;
		},
		getAllAreaObj(code){
			let obj = {};
			//area 区编码
			//area1 市编码
			//area2 省编码
			if(code.substring(4, 6) != "00"){ // 判断区编码
			obj.area2 = code.substring(0, 2) + '0000'
			obj.area1 = code.substring(0, 4) + "00";
			obj.area = code; 
			}else if(code.substring(2, 4) != "00"){ // 判断市编码
			obj.area2 = code.substring(0, 2) + '0000'
			obj.area1 = code.substring(0, 4) + "00";
			}else{  // 省编码
			obj.area2 = code;
			}
			return obj;
		},
		changeSetData(e){ // 省市区选中获取最后一级
      this.ruleForm.productArea = e[e.length-1]
    },
		handleSizeChange(val) {
			this.ruleForm.ps = val;
			this.searchview();
		},
		handleCurrentChange(val) {
			this.ruleForm.pn = val;
			this.searchview();
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
      if (rowIndex == 0) {
          return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;';
      } else {
          return 'background: #fff';
      }
		},
	},
}
</script>

<style lang="less">
#AppointList {
	padding-bottom: 80px;
  box-sizing: border-box;
  margin:0 20px;
	.elesearch{
		width: 100%;
    min-height: 100px;
    margin: 20px 0;
    background-color: #fff;
    padding: 20px 30px;
    box-sizing: border-box;
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 25%;
				margin-right: 10px;
				margin-left: 0%;
				input {
					border: none;
					font-size: 16px;
					min-width:110px;
				}
				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}
			.item2{
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 25%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				vertical-align: text-bottom;
			}
			.item5{
				width:30%
			}
			.query-button{
				float: right;
				font-weight: 600;
				width: 100px;
				margin-left: 20px;
			}
			.empty-button{
				float: right;
				margin-left: 30px;
				color: #2491fc;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}
	.tips{
		padding: 30px 25px ;
		.tips-content{
			color:#f5222d;
			
		}
	}
	.content{
		width: 100%;
    margin: 20px 0;
    background-color: #fff;
    box-sizing: border-box;
		.add-video {
			float: right;
      margin:20px;
		}
		.el-button--warning {
			background-color: #ffe7ba;
		}
		.is-round {
			padding: 8px 22px;
		}
		.content-table{
			width: 100%;
			padding: 0 20px 76px;
			margin-bottom: 40px;
			box-sizing: border-box;
			.img-width {
				width: 200px;
				height: 112px;
				margin-right: 20px;
				img {
					width: 200px;
					height: 112px;
				}
			}
			.title-video {
				color: #000000;
				font-size: 16px;
				font-weight: bold;
			}
			.col-black {
				color: #101010;
			}
			.col-blue {
				color: #096dd9;
			}
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				border: 1px solid #F1EEE9;
				box-sizing: border-box;
				color: #666666;
				font-size: 16px;
				font-weight: 600;
				display: flex;
				span{
					display: block;
					text-align: center;
				}
			}
			.table{
				width: 100%;
				border: 1px solid #f5f5f5;
				box-sizing: border-box;
				.table-title{
					width: 100%;
					height: 44px;
					line-height: 44px;
					background-color: #f5f5f5;
					padding-left: 20px;
					box-sizing: border-box;
				}
				.table-data{
					width: 100%;
					min-height: 180px;
					display: flex;
					.data-item{
						padding: 16px 20px;
						box-sizing: border-box;
						border-right: 1px solid #F1EEE9;
						box-sizing: border-box;
					}
					.data-item:last-child{
						border-right: 0;
					}
				}
			}
		}
  }
  .row-factor {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
