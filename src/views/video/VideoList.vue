<template>
	<div id="videoList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">视频名称：</span>
						<el-input size="medium" v-model.trim="data.title" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">状态：</span>
						<el-select size="medium" v-model="data.status" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<el-button type="primary" @click="addVideo(false)" round size="medium" class="add-video mt20 mb20">添加视频</el-button>
			<div class="content-table">
				<el-table :data="videoList" style="width: 100%;color:#000000" border :header-cell-style="getRowClass1">
					<el-table-column label="视频资料"  width="660">
						<template slot-scope="scope">
							<div style="display:flex;">
								<div class="img-width">
									<img :src="scope.row.imgUrl" alt="">
								</div>
								<div class="col-black">
									<p class="title-video">{{scope.row.title}}</p>
									<p class="mt10">视频ID：{{scope.row.mediaUrl}} <span class="ml20">分类：{{scope.row.typeName}}</span> </p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="发布时间/人员">
						<template slot-scope="scope">
							<p> {{ scope.row.publishTime }}</p>
							<p> {{ scope.row.createByName }} <span> ( {{scope.row.branchName}} ) </span></p>
						</template>
					</el-table-column>
					<el-table-column label="更新时间" prop="updateTime"></el-table-column>
					<el-table-column label="状态" width="66" align="center">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.statusFlag" active-color="#5677fc" @change="changeStatus(scope.row)" inactive-color="#a7a5a6"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="166" align="center">
						<template slot-scope="scope">
							<el-button size="mini" type="text" class="col-blue" @click="shareEdit(scope.row)">分享</el-button>
							<span class="col-blue">|</span>
							<el-button size="mini" type="text" class="col-blue" @click="addVideo(scope.row)">编辑</el-button>
							<span class="col-blue">|</span>
							<el-button size="mini" type="text" class="col-blue" @click="handleDelete(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination class="fr mt20" background @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
		<VideoDialog ref="VideoDialog"></VideoDialog>
		<ShareDialog ref="ShareDialog"></ShareDialog>
	</div>
</template>

<script>
import ResourcesService from '../../service/ResourcesService';
import UserService from '../../service/UserService';
import $apiUrl from '../../api/apiUrl'
import VideoDialog from './components/videoDialog.vue'
import ShareDialog from './components/shareDialog.vue'
export default {
	components:{
		VideoDialog,ShareDialog
	},
	data() {
		return {
			data: {
				title:'',
				status:'',
				ps:10,
				pn:1
			},
			showFlag:false,
			options7:[
				{
					value: 1,
					label:'有效',
				},
				{
					value: 2,
					label:'无效',
				}
			],
			options6:[
				{
					value:'1',
					label:'安全课堂',
				},
				{
					value:'2',
					label:'安全宣传视频',
				}
			],
			videoList:[],
			currentPage: 1,
			pagesize: 10,
			total: 10,
			ResourcesService: new ResourcesService(),
			UserService: new UserService()
		}
	},
	created(){
		this.getVideoList();
	},
	methods: {
		searchview() {
			if(this.data.title == '%') {
				this.$message.warning('不允许输入%查询，请重新输入。')
				return;
			} else {
				this.data.ps = this.pagesize;
				this.data.pn = this.currentPage;
				this.getVideoList()
			}
		},
		empty() {
			this.pagesize = 10;
			this.currentPage = 1;
			this.data = {
				title:'',
				status:'',
				ps:10,
				pn:1
			};
			this.searchview();
		},
		async changeStatus(row) {
			let obj = row;
			row.status == 1 ? obj.status = 2 : row.status == 2 ? obj.status = 1 : '';
			let res = await this.UserService.putEditVideo(obj.id,obj);
			if(res.code == '0000') {
				this.$message.success('更新成功!');
                this.searchview();
			} else {
				this.$message.error(res.msg);
			}
		},
		async getVideoList() { 
			let res = await this.UserService.getVideoList(this.data);
			if(res.code == '0000') {
				res.list.forEach(async item => {
					item.typeName = this.options6.find(i => i.value == item.type).label;
					item.imgUrl = `${$apiUrl.DOWNLOAD_FILE}?fileId=${item.coverPicture}&free=1`
					item.mediaUrl1 =  window.location.hostname + '/' + $apiUrl.SHOW_VIDEO + item.mediaUrl;
					item.statusFlag = item.status == 1 ? true : false;
				})
				this.videoList = res.list;
			}
			this.total = res.total;
		},
		handleSizeChange(val) {
			this.pagesize = val;
			this.searchview();
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.searchview();
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		addVideo(row) {
			this.$refs.VideoDialog.initData(row);
		},
		handleDelete(row) {
			this.$confirm('是否删除视频？', '确认信息', {
				distinguishCancelAndClose: true,
				confirmButtonText: '删除',
				cancelButtonText: '取消'
				})
				.then(() => {
					this.deleteVideo(row)
				})
				.catch(() => {
					this.$message.info('已取消删除！')
			});
		},
		async deleteVideo(row) {
			let res = await this.UserService.deleteVideo(row.id);
			if(res.code == '0000') {
				this.$message.success('删除成功！')
				this.searchview();
			} else {
				this.$message.error(res.msg)
			}
		},
		shareEdit(row) {
			this.$refs.ShareDialog.initData(row);
		}
	},
}
</script>

<style lang="less">
#videoList {
	padding-bottom: 80px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
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
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 30%;
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
	.content{
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
		background-color: #ffffff;
		.add-video {
			float: right;
			margin-right: 20px;
		}
		.mt40 {
			margin-top: 40px;
		}
		.w80 {
			width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
		.el-button--warning {
			background-color: #ffe7ba;
		}
		.is-round {
			padding: 8px 22px;
		}
		// .el-button:hover {
		// 	background-color: #ffe7ba;
		// }
		.state-style {
			background-color: #ffffff;
			font-size: 16px;
			.is-active {
				background: #E6A23C;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #E6A23C;
				border-left-color: #E6A23C;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #ffa940;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 35px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
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
				.title1{
					width: 30%;
				}
				.title2{
					width: 20%;
				}
				.title3{
					width: 12%;
				}
				.title4{
					width: 13%;
				}
				.title5{
					width: 15%;
				}
				.title6{
					width: 10%;
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
					.new-insurance{
						display: inline-block;
						box-sizing: border-box;
						color: #f5222d;
						text-align: center;
						line-height: 24px;
					}
				}
				.table-data{
					width: 100%;
					min-height: 180px;
					display: flex;
					.title1{
						width: 50%;
						min-height: 100%;
						position: relative;
					}
					.title2{
						width: 20%;
						min-height: 100%;
						position: relative;
					}
					.title3{
						width: 12%;
						min-height: 100%;
						position: relative;
					}
					.title4{
						width: 13%;
						min-height: 100%;
						position: relative;
					}
					.title5{
						width: 15%;
						min-height: 100%;
						position: relative;
					}
					.title6{
						width: 10%;
						min-height: 100%;
						position: relative;
					}
					.data-item{
						padding: 16px 20px;
						box-sizing: border-box;
						border-right: 1px solid #F1EEE9;
						box-sizing: border-box;
						.font-colo{
							color: #1E90FF;
							text-decoration: underline;
							cursor: pointer;
						}
						.font-colo1{
							color: #1E90FF;
						}
						.centered-block{
							width: calc(100% - 40px);
							position:absolute;
							top:50%;
							transform:translate(0,-50%);
						}
						.centered-block1{
							width: calc(100% - 40px);
							position:absolute;
							top:50%;
							transform:translate(0,-50%);
						}
					}
					.data-item:last-child{
						border-right: 0;
					}
				}
			}
		}
	}
	.content-total{
		width: calc(100% - 284px);
		// width: 85.2%;
		margin: 30px 30px 0 20px;
		height: 60px;
		line-height: 60px;
		position: fixed;
		bottom: 0;
		background-color: #f6f7fc;
		z-index: 1000;
		.el-pagination {
    		margin-top: 15px;
			float: right;
		}
		.content1-exports{
			margin-left: 5px;
			font-size: 14px;
			cursor: pointer;
			color: #1E90FF;
		}
		.content1-num {
			font-size: 14px;
			margin-left: 5px;
			margin-right: 5px;
		}
		.col-blue {
			color: #1E90FF;
		}
		.col-red {
			color: #f5222d;
		}
		.col-org {
			color: #DB9728;
		}
	}
	.item11{
		display: flex;
		height: 40px;
		line-height: 40px;
		margin-bottom: 20px;
		.item12{
			width: 25%;
			text-align: right;
			padding-right: 15px;
			box-sizing: border-box;
		}
		.item13{
			width: 65%;
		}
	}
	.mr60 {
		margin-right: 60px;
	}
}
</style>
