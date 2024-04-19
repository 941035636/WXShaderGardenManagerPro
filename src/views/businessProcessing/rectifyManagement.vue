<template>
	<div id="PunchList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">冲正单号</span>
					<el-input placeholder="请输入保单号、批单号" v-model.trim="form.correctNo" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">冲正单类型</span>
					<el-select v-model="form.orderType" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options1" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">冲正类型</span>
					<el-select v-model="form.correctType" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options2" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">审核状态</span>
					<el-select v-model="form.approveStatus" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options3" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">冲正状态</span>
					<el-select v-model="form.correctStatus" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options4" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">提交时间</span>
					<el-date-picker v-model="form.startTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<span class="item1">至</span>
					<el-date-picker v-model="form.endTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showBranch">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">分支机构</span>
					<el-select v-model="form.branchCode" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options5" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
				</div></el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="search" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>

		<div class="content-up" v-if="datas.find(item => item.key == '10051')">
			<el-button type="primary" @click="ApplicationCorrection" round>冲正申请</el-button>
		</div>

		<div v-if="listFlag" class="no-data">
			暂无数据
		</div>

		<div class="list" v-else>
			<el-table :data="list" :header-cell-style="getRowClass" fit>
				<el-table-column label="冲正信息" show-overflow-tooltip min-width="130">
					<template slot-scope="scope">
						<p style="color:#096DD9;">{{scope.row.policyHolder}}</p>
						<p v-if="scope.row.orderType == '1'">投保单号：{{scope.row.correctApplyNo}}</p>
						<p v-if="scope.row.orderType == '2'">批单申请号：{{scope.row.correctApplyNo}}</p>
						<p>申请人：{{scope.row.createByName}}（{{scope.row.branchName}}）</p>
					</template>
				</el-table-column>
				<el-table-column show-overflow-tooltip min-width="180">
					<template slot-scope="scope">
						<p>流水号：{{scope.row.serialNo}}</p>
						<p v-if="scope.row.orderType == '1'">保单号：{{scope.row.correctNo}}</p>
						<p v-if="scope.row.orderType == '2'">批单号：{{scope.row.correctNo}}</p>
						<p>申请时间：{{scope.row.createTime}}</p>
					</template>
				</el-table-column>
				<el-table-column label="进度" show-overflow-tooltip>
					<template slot-scope="scope">
						<p style="color:#1890FF;">
							<span v-if="scope.row.approveStatus == '1'">待审核</span>
							<span v-if="scope.row.approveStatus == '3'" style="color:#FF4D4F;">退回<el-button type="text" icon="el-icon-question" @click.native="reasonsFailure(scope.row)" style="color:#FFA940;"></el-button></span>
							<span v-if="scope.row.approveStatus == '4'" style="color:#52C41A;">批准</span>
							/
							<span v-if="scope.row.correctStatus == '1'">待冲正</span>
							<span v-if="scope.row.correctStatus == '2'">冲正成功</span>
							<span v-if="scope.row.correctStatus == '3'">冲正失败<el-button type="text" icon="el-icon-question" @click.native="reasonsFailure(scope.row)" style="color:#FFA940;"></el-button></span>
						</p>
						<p v-if="scope.row.approveStatus != '1'">审核人：{{scope.row.userName}}</p>
						<p v-if="scope.row.approveStatus != '1'">{{scope.row.updateTime}}</p>
					</template>
				</el-table-column>
				<el-table-column label="冲正类型" show-overflow-tooltip> 
					<template slot-scope="scope">
						<p>
							<span v-if="scope.row.orderType == '1'" style="color:#1890FF;">保单冲正</span>
							<span v-if="scope.row.orderType == '2'" style="color:#1890FF;">批单冲正</span>
							/
							<span v-if="scope.row.correctType == '1'">一般性冲正</span>
							<span v-if="scope.row.correctType == '2'">保费冲正</span>
							<span v-if="scope.row.correctType == '3' && scope.row.orderType == '2'">批单删除</span>
							<span v-if="scope.row.correctType == '3' && scope.row.orderType == '1'">保单删除</span>
							<span v-if="scope.row.correctType == '4'">全面营销信息</span>
						</p>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleClick(scope.row,'2')" v-if="scope.row.approveStatus == '1' && datas.find(item => item.key == '10053')">审核</el-button>
						<el-button type="text" @click="examine(scope.row)" v-if="(scope.row.approveStatus == '3' || scope.row.correctStatus == '3') && datas.find(item => item.key == '10052')" >修改</el-button>
						<el-button @click="handleClick(scope.row,'1')" type="text" style="color:#666666;">查看</el-button>
					</template>
				</el-table-column>
      		</el-table>
		</div>
        <div class="content-total">
            <el-pagination v-if="!listFlag" background @current-change="handleCurrentChange" :current-page="form.pn" :page-size="form.ps" :total="tolnum"> </el-pagination>
		</div>
	</div>
</template>

<script>
import CorrectionManagement from '../../service/CorrectionManagement.js';
import moment from 'moment';
export default {
	name:'PunchList',
	computed:{
		// BasePagenations
	},
	data() {
		return {
			datas:[],
			showBranch:true,
			CorrectionManagement:new CorrectionManagement(),
			form:{
				correctNo:'', // 冲正单号
				orderType:'', // 1保单，2批单
				correctType:'', // 冲正类型
				approveStatus:'', // 审核状态
				correctStatus:'', // 冲正状态
				startTime:'', // 提交开始时间
				endTime:'', // 提交结束时间
				branchCode:'', // 分支机构编码
				pn:1,
				ps:10
			},
			options1:[
				{
					label:'保单冲正',
					value:'1'
				},
				{
					label:'批单冲正',
					value:'2'
				}
			],
			options2:[
				{
					label:'一般性冲正',
					value:'1'
				},
				{
					label:'保费冲正',
					value:'2'
				},
				{
					label:'批单/保单删除',
					value:'3'
				},
				{
					label:'全面营销信息',
					value:'4'
				}
			],
			options3:[
				{
					label:'待审核',
					value:'1'
				},
				{
					label:'审核通过',
					value:'4'
				},
				{
					label:'审核拒绝',
					value:'3'
				}
			],
			options4:[
				{
					label:'待冲正',
					value:'1'
				},
				{
					label:'冲正成功',
					value:'2'
				},
				{
					label:'冲正失败',
					value:'3'
				}
			],
			options5:[],
			tolnum: 0,
			listFlag:false,
			list:[]
		};
	},
	computed: {
		
	},
	created() {
        this.policyStatu();
        this.loadBranch();
        // this.getOptions();
	},
	methods: {
        policyStatu(){ //根据权限获取配置文件
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		},
        // async getOptions() {
        //     let res = await this.CorrectionManagement.getSelectData();
        //     if(res.code == '0000') {

        //     }
        // },
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.options5 = [];
				let branchCode = window.sessionStorage.getItem('branchCode');
					if(branchCode == 'JT0000'){
						this.showBranch = true
					}else{
						this.showBranch = false
					}
					this.options5 = res.list;
				}
            this.getPunchList();
        },
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#333333;"
			}
		},	
		search() {// 点击查询
			this.form.pn = 1;
			this.getPunchList();
		},
		empty(){
			this.form = {
				correctNo:'', // 冲正单号
				orderType:'', // 1保单，2批单
				correctType:'', // 冲正类型
				approveStatus:'', // 审核状态
				correctStatus:'', // 冲正状态
				startTime:'', // 提交开始时间
				endTime:'', // 提交结束时间
				branchCode:'', // 分支机构编码
				pn:1,
				ps:10
			}
			this.area = [];
			this.getPunchList();
		},
		handleClick(row,index){
            this.$router.push({
              path: "/rectifyResult",
              query:{
                  flag:index,
                  id:row.id
              }
			});
		},
		handleSizeChange(val) {// 修改条数
			this.form.ps = val;
			this.getPunchList();
		},
		handleCurrentChange(value) {// 修改页数
			this.form.pn = value;
			this.getPunchList();
		},
		ApplicationCorrection(){ // 冲正申请
			this.$router.push({
			  path: "/rectifyApplication"
			});
        },
		async getPunchList(){
			const res = await this.CorrectionManagement.getPunchList(this.form);
			if(res.code == '0000'){
				this.list = [];
				res.list.forEach(item =>{
					this.options5.forEach(item1 =>{
						if(item1.jtBranchCode == item.branchCode){
							item.branchName = item1.jtBranchName
						}
                    })
                    if(item.branchCode == 'JT0000'){
                        item.branchName = '江泰保险经纪股份有限公司本部'
					}
					item.userName = item.history?item.history.userName:''
                    item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                    item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
					this.list.push(item)
                })
                this.tolnum = res.total
			}
        },
        reasonsFailure(row){
			this.$message({
				dangerouslyUseHTMLString: true,
				message: row.history.approveContent
			});
		},
        examine(row) {
            this.$router.push({
              path: "/rectifyApplication",
              query:{
                  id:row.id
              }
			});
        }
	}
};
</script>

<style lang="less" scoped>
#PunchList{
	padding-bottom: 20px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 10%;
				text-align: center;
			}
			.item2{
				width: 65%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 30%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 27%;
			}
		}
		.elesearch-btn{
			width: 100%;
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
		padding: 0 30px;
		box-sizing: border-box;
		margin-top: 20px;
	}
	.no-data{
		width: 100%;
		line-height: 300px;
		font-size: 20px;
		color: #999;
		font-weight: 600;
		text-align: center;
	}
	.list{
		width: calc(100% - 40px);
		margin: 20px 20px 0;
		background-color: #ffffff;
		overflow: visible;
		.list-item{
			width: 100%;
			min-height: 243px;
			border: 1px solid #e9e9ea;
			margin-bottom: 25px;
			box-sizing: border-box;
			.item-title{
				width: 100%;
				height: 41px;
				line-height: 40px;
				background-color: #f7f8fa;
				padding: 0 20px;
				box-sizing: border-box;
				font-size: 14px;
				color: #000000;
				border-bottom: 1px solid #e9e9ea;
				box-sizing: border-box;
			}
			.item-content{
				width: 100%;
				min-height: 200px;
				padding: 30px;
				box-sizing: border-box;
				display: flex;
				.item-content1{
					width: 64%;
					height: 100%;
					color: #84878c;
					padding-right: 30px;
					box-sizing: border-box;
					.item-holderName{
						color:#469ffc;
						margin-bottom: 30px;
					}
					span{
						color: #000000;
					}
					.row-bg{
						margin-bottom: 18px;
					}
				}
				.item-content2{
					width: 18%;
					min-height: 140px;
					border-left: 1px solid #e9e9ea;
					padding: 20px 0;
					box-sizing: border-box;
					p{
						text-align: center;
						line-height: 30px;
					}
				}
				.item-content3{
					width: 18%;
					min-height: 140px;
					border-left: 1px solid #e9e9ea;
					padding: 20px 0;
					box-sizing: border-box;
					color: #fa7b27;
					position: relative;
					.centered-block{
						width: calc(100% - 10px);
						position:absolute;
						top:50%;
						transform:translate(0,-50%);
						p{
							text-align: center;
							line-height: 30px;
							span{
								cursor: pointer;
							}
						}
					}
				}
			}
		}
    }
    .content-total{
		width: calc(100% - 50px);
		margin: 30px 30px 30px 20px;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
}
</style>
