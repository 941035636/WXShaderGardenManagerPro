<template>
	<div class="InspectionReport">
		<div class="report-data">
      <h2 class="report-title">{{groupData.title}}</h2>
			<div class="report-item1">
				<el-row>
					<el-col :span="4">
						<div class="item1" style="font-weight: bold;">检查时间</div>
					</el-col>
					<el-col :span="8">
						<div class="item1">{{groupData.createTime}}</div>
					</el-col>
					<el-col :span="4">
						<div class="item1" style="font-weight: bold;">检查人员</div>
					</el-col>
					<el-col :span="8">
						<div class="item2">{{groupData.createByName}}</div>
					</el-col>
				</el-row>
			</div>
			<div class="report-item1">
				<el-row>
					<el-col :span="4">
						<div class="item1" style="font-weight: bold;">企业名称</div>
					</el-col>
					<el-col :span="20">
						<div class="item2">{{groupData.corpName}}</div>
					</el-col>
				</el-row>
			</div>
			<div class="report-item2">
				安全检查表内容
			</div>
			<div class="report-item3">
				<div class="item5" style="font-weight: bold;">
					检查项目
				</div>
				<div class="item6">
					<div class="item61" style="font-weight: bold;">
						检查内容
					</div>
					<div class="item61" style="font-weight: bold;">
						检查结果
					</div>
					<div class="item61" style="font-weight: bold;">
						现场照片
					</div>
					<div class="item61" style="font-weight: bold;">
						整改意见
					</div>
					<div class="item62" style="font-weight: bold;">
						依据
					</div>
				</div>
			</div>
			<div class="report-item3" v-for="(item,index) in groupData.groupResps" :key="index">
				<div class="item7" v-if="item.answerResps!=null">
					<span>{{item.name}}</span>
				</div>
				<div class="items">
					<div v-for="(item1,index1) in item.answerResps" :key="index1" class="item8">
						<div class="item81">
							{{item1.index}}.{{item1.title}}
						</div>
						<div class="item81">
							{{item1.result.option}}
						</div>
						<div class="item81">
							<img :src="fileid" alt="" v-for="(fileid,index2) in item1.imgUrl" :key="index2">
						</div>
						<div class="item81">
							{{item1.result.idea}}
						</div>
						<div class="item81">
							{{item1.result.basis}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name:'InspectionReport',
  props:{
    groupData:{}
  },
	data() {
		return {
			data:{},
			title:'',
		}
	},
	created(){
	},
	methods: {
	}
}
</script>

<style lang="less">
.InspectionReport{
	width: 100%;
	.report-data{
		width: 80%;
		height: 100%;
		padding: 0 5px;
		box-sizing: border-box;
    font-size: 20px;
    .report-title{
      text-align: center;
      margin:20px 0;
      color:#060606;
    }
		.report-item1{
			width: 100%;
			height: 70px;
			border: 1px solid #060606;
			box-sizing: border-box;
			border-bottom: 0;
			line-height: 68px;
			.item1{
				width: 100%;
				height: 100%;
				padding-left: 15px;
				border-right: 1px solid #060606;
				box-sizing: border-box;
			}
			.item2{
				width: 100%;
				height: 100%;
				padding-left: 15px;
				box-sizing: border-box;
			}
		}
		.report-item2{
			width: 100%;
			height: 80px;
			border: 1px solid #060606;
			box-sizing: border-box;
			border-bottom: 0;
			line-height: 78px;
			text-align: center;
			font-weight: bold;
		}
		.report-item3{
			width: 100%;
			border: 1px solid #060606;
			box-sizing: border-box;
			border-bottom: 0;
			display: flex;
			.item5{
				width: 15%;
				line-height: 70px;
				border-right: 1px solid #060606;
				text-align: center;
			}
			.item6{
				width: 85%;
				line-height: 70px;
				border-bottom: 1px solid #060606;
				box-sizing: border-box;
				display: flex;
				.item61{
					width: 100%;
					text-align: center;
					border-right: 1px solid #060606;
					box-sizing: border-box;
				}
				.item62{
					width: 100%;
					text-align: center;
				}
				// .item61:last-child{
				// 	border-right: 0;
				// }
			}
			.item6:last-child{
				border-bottom: 0;
			}
			.item7{
				width: 15%;
				border-right: 1px solid #060606;
				text-align: center;
				position: relative;
				span{
					display: block;
					position: absolute;
					top:50%;
					transform:translate(0,-50%);
				}
			}
			.items{
				width: 85%;
				.item8{
					width: 100%;
					border-bottom: 1px solid #060606;
					box-sizing: border-box;
					display: flex;
					.item81{
						width: 100%;
            text-align: left;
            padding-left:20px;
						border-right: 1px solid #060606;
						box-sizing: border-box;
						img{
							display: block;
							width: 100%;
							height: auto;
						}
					}
					.item81:last-child{
						border-right: 0;
					}
				}
				.item8:last-child{
					border-bottom: 0;
				}
			}
		}
		.report-item3:last-child{
			border-bottom: 1px solid #060606;
		}
	}
}
</style>
