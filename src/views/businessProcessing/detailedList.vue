<template>
	<div class="detailedList" id="detailedList">
		<div class="content1">
			<span class="item1">变更清单</span>
			<span class="item2"></span>
		</div>
		<div class="content2">
			<div class="content21">
				批单申请表:<el-button type="text" @click="clicks">&nbsp;&nbsp;{{value}}</el-button>
			</div>
			<div class="content21">
				批单影印件:<el-button type="text" @click="clickss">&nbsp;&nbsp;{{value1}}</el-button>
			</div>
			<div class="content21">
				新增人员清单
			</div>
			<el-table :data="data1" style="width:751px" highlight-current-row show-header border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column  prop="objectName" label="姓名" width="150" align="center"></el-table-column>
				<el-table-column  prop="objectId" label="证件号码" width="250" align="center"></el-table-column>
				<el-table-column  prop="post" label="人员岗位" width="150" align="center"></el-table-column>
				<el-table-column  prop="applyDate" label="提交日期" width="150" align="center"></el-table-column>
			</el-table>
			<div class="content21">
				减少人员清单
			</div>
			<el-table :data="data2" style="width:751px" highlight-current-row show-header border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column  prop="objectName" label="姓名" width="150" align="center"></el-table-column>
				<el-table-column  prop="objectId" label="证件号码" width="250" align="center"></el-table-column>
				<el-table-column  prop="post" label="人员岗位" width="150" align="center"></el-table-column>
				<el-table-column  prop="applyDate" label="提交日期" width="150" align="center"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import battenType from '../../../static/data/battenType.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
            data1:[],
			data2:[],
			value:'未上传',
			value1:'未上传',
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		this.getDetailedlist();
		this.getDet();
	},
	methods: {
		async getDet(){
			let res = await this.Elevator.getDet(this.$route.query.applyNo);
			if(res.code == '0000'){
				if(res.data.fileInfoVOS){
					if(res.data.fileInfoVOS.find(item => item.fileType == '01')){
						this.value = res.data.fileInfoVOS.find(item => item.fileType == '01').fileUrl;
					}
					if(res.data.fileInfoVOS.find(item => item.fileType == '05')){
						this.value1 = res.data.fileInfoVOS.find(item => item.fileType == '05').fileUrl;
					}
				}else{
					
				}
			}
		},
		async clicks(){
			if(this.value == '未上传'){
				this.$message({
          			message: '请先通知用户上传批单申请表',
          			type: 'warning'
        		});
			}else{
				this.href = this.$apiUrl.COM_INDENT+this.value;
				window.open(this.href,"_blank" );
			}
			
		},
		async clickss(){
			if(this.value1 == '未上传'){
				this.$message({
          			message: '请先上传批单影印件',
          			type: 'warning'
        		});
			}else{
				this.href = this.$apiUrl.COM_INDENT+this.value1;
				window.open(this.href,"_blank" );
			}
			
		},
		async getDetailedlist(){
			let res = await this.Elevator.getDetailedlist(this.$route.query.applyNo);
			if(res.code == '0000'){
				var m = 0;
				var n = 0;
				for(var i=0;i<res.list.length;i++){
					let data = {
						'objectName':'',
						'objectId':'',
						'post':'',
						'time':''
					};
					if(res.list[i].extendsList.find(item => item.fieldCode == 'S_O_100001')){
						if(res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_100001')].fieldValues == '增员'){
							this.data1.push(data);
							this.data1[m].objectName = res.list[i].objectName;
							this.data1[m].objectId = res.list[i].objectId;
							this.data1[m].applyDate = res.list[i].applyDate;
							this.data1[m].post = res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_000033')]?res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_000033')].fieldValues:'';
							m++;
						}
						if(res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_100001')].fieldValues == "减员"){
							this.data2.push(data);
							this.data2[n].objectName = res.list[i].objectName;
							this.data2[n].objectId = res.list[i].objectId;
							this.data2[n].applyDate = res.list[i].applyDate;
							this.data2[n].post = res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_000033')]?res.list[i].extendsList[res.list[i].extendsList.map(item => item.fieldCode).indexOf('S_O_000033')].fieldValues:'';
							n++;
						}
					}
				}
			}
		},
	},
}

</script>

<style lang="less">
#detailedList{
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #ffffff;
	min-height: 900px;
	.content1{
		width: 100%;
		height: 60px;
		padding-left: 20px;
		.item1{
			display: block;
			font-size: 18px;
			font-weight: 600;
			color: #101010;
		}
		.item2{
			display: block;
			width: 70px;
			height: 3px;
			background-color: #3A48E2;
		}
	}
	.content2{
		width: 90%;
		margin-left: 5%;
		.content21{
			width: 100%;
			height: 30px;
			line-height: 30px;
			color: #4E4B4B;
			font-weight: 600;
			border-bottom: 1px solid #EFF1F2;
			margin-bottom: 20px;
			margin-top: 20px;
		}
	}
}
</style>
