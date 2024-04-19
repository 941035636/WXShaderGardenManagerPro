<template>
	<div id="columlist">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">项目名称</span>
						<el-input v-model.trim="form.name" class="item2" clearable placeholder="模糊查询"></el-input>
					</div>
				</el-col>
				<!-- <el-col :span="8">
					<div style="display:flex;">
						<span class="item3">创建时间</span>
						<el-date-picker v-model="form.createStartTime" type="date" class="item5" placeholder="开始日期"
							value-format="yyyy-MM-dd"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker v-model="form.createEndTime" type="date" class="item5" placeholder="结束日期"
							value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</el-col> -->
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">状态</span>
						<el-select v-model="form.status" placeholder="全部" class="item2" clearable>
							<el-option v-for="item in typeList" :key="item.code" :label="item.msg"
								:value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="getColumnList" class="query-button">查询</span>
			</div>
		</div>

		<div class="content-up">
			<el-button type="primary" @click="goAddColumn(-1)" round>添加新的栏目</el-button>
		</div>

		<div class="content">
			<el-table :data="tableData" style="width: 100%;" :header-cell-style="getRowClass">
				<el-table-column type="index" label="序号" align="center"></el-table-column>
				<el-table-column label="名称" show-overflow-tooltip width="800">
					<template slot-scope="scope">
						<div class="tbJump">
							<div>
								<input class="inlineinput" type="text" v-model="scope.row.sort" @blur="change(scope.row)"
									oninput="value=value.replace(/[^0-9且或()]/g, '')" />
								<span>{{ scope.row.name }}</span>
								<span>-</span>
								<span>{{ scope.row.typeCode || "" }}</span>
							</div>
							<router-link
							style="display: flex;justify-content: center;align-items: center;"
								:to="{ path: '/classification', query: { columnInfo: scope.row.id, firstName: scope.row.name} }">查看分类列表</router-link>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="180" align="center">
					<template slot-scope="scope">
						<div :style="{
							color: scope.row.status == '关闭' ? '#b3b3b3' : '#1dd867'
						}">
							{{ scope.row.status }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column fixed="right" label="操作" width="200" align="center">
					<template slot-scope="scope">
						<el-button type="text"
							@click="goIcation(scope.row.id, scope.row.parentId, scope.row.sort, scope.row.typeCode, scope.row.name, scope.row.status)">修改</el-button>
						<el-button type="text" @click="delOne(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"></BasePagenations>
		</div>
		<addColum ref="addColum" @upData="upData"></addColum>
	</div>
</template>

<script>
import addColum from './components/addColum.vue'
import newsService from "../../service/newsService.js";

export default {
	data() {
		return {
			newsService: new newsService(),
			tableData: [], //栏目列表
			tolnum: 0, //页码
			form: {
				pn: 1,
				ps: 10,
				// orderby: "weight",
				// desc: true,
				status: '',
				name: '',
				// createStartTime: "",
				// createEndTime: "",
			},
			typeList: [],
			data: {
				id: 0,
				isDelete: false,
				name: "",
				parentId: "",
				status: 1,
				type: 1,
				sort: 0
			}
		};
	},
	components: {
		addColum
	},
	mounted() {
		this.getColumnList();
	},
	created() {
		this.getList();
	},
	methods: {
		async getList() {
			let res = await this.newsService.getTypeList();
			this.typeList = res.data.data;
		},
		async getColumnList() {
			let param = {
				pn: this.form.pn,
				ps: this.form.ps,
				name: this.form.name,
				status: this.form.status,
				// createStartTime: this.form.createStartTime ? this.form.createStartTime : '',
				// createEndTime: this.form.createEndTime ? this.form.createEndTime : '',
			}
			let columnList = await this.newsService.getColumnList(param);
			if (columnList.data.code == "0000") {
				this.tolnum = columnList.data.total;
				this.tableData = columnList.data.list;
			} else {
				this.$confirm("初始化页面失败", "提示", {
					confirmButtonText: "确定"
				});
			}
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "background:#f5f5f5";
			} else {
				return "";
			}
		},
		change(row) {
			this.data.name = row.name;
			this.data.parentId = row.parentId;
			if (row.status === "显示" || row.status === "正常") {
				this.data.status = 1;
			} else if (row.status === "关闭") {
				this.data.status = 2;
			}
			this.data.sort = row.sort;
			this.data.id = row.id;
			this.data.typeCode = row.typeCode;
		},
		async getColumntype() {
			let columnList = await this.newsService.getColumnList(this.form);
			if (columnList.data.code == "0000") {
				this.tolnum = columnList.data.total;
				this.tableData = columnList.data.list;
			} else {
				this.$confirm("查询失败", "提示", {
					confirmButtonText: "确定"
				});
			}
		},

		//分页方法
		handleSizeChange(val) {
			this.form.ps = val;
			this.getColumntype();
		},
		handleCurrentChange(val) {

			this.form.pn = val;
			this.getColumntype();
		}, //分页方法

		onSubmit() {
		},
		// 新增栏目
		goAddColumn(parentId) {
			this.$refs.addColum.centerDialogVisible = true
			this.$refs.addColum.title = "添加栏目"
			this.$refs.addColum.form = {
				isDelete: false,
				typeCode: "",
				name: "",
				parentId: -1,
				status: 1,
				type: 1,
				sort: 0,
			}
		},
		//修改栏目信息
		goIcation(id, pid, sort, typeCode, name, status) {
			this.$refs.addColum.centerDialogVisible = true
			this.$refs.addColum.title = "修改栏目"
			this.$refs.addColum.form = {
				id: id,
				isDelete: false,
				typeCode: typeCode,
				name: name,
				parentId: pid,
				status: status === "显示" ? 1 : status === "正常" ? 1 : status === "关闭" ? 2 : 1, //
				type: pid == -1 ? 1 : 2,
				sort: sort || 0,
			}
		},

		//  修改或者创建成功以后，重新调用列表
		upData(val) {
			this.getColumntype();
		},

		//删除单个栏目
		delOne(id) {
			// alert(id);
			this.$confirm("删除本栏目, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "error"
			})
				.then(() => {
					this.newsService.delColumn(id).then(res => {
						if (res.data.code == "0000") {
							this.$message({
								type: "success",
								message: "删除成功"
							});
							this.getColumntype();
						}
					});
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
		},

		//修改权重
		async reserve() {
			let createColumn = await this.newsService.createColumn(this.data);
			if (createColumn.data.code == "0000") {
				this.getColumnList();
			}
		},

	},
	watch: {
		"data.sort": {
			handler() {
				this.reserve();
			}
		}
	}
};
</script>

<style lang="less">
#columlist {
	padding-bottom: 30px;
	box-sizing: border-box;
	background-color: #ffffff;

	.elesearch {
		width: 100%;
		margin: 20px 0;
		background-color: #fff;
		padding: 20px 30px;
		box-sizing: border-box;

		.row-bg {
			margin-bottom: 20px;
			line-height: 40px;

			.item1 {
				display: block;
				width: 10%;
				text-align: center;
			}

			.item2 {
				width: 70%;
			}

			.item3 {
				font-size: 14px;
				color: #666666;
				display: block;
				width: 25%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.item5 {
				width: 30%;
			}
		}

		.elesearch-btn {
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;

			.query-button {
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
		}
	}

	.content-up {
		width: 100%;
		height: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}

	.content {
		width: 100%;
		height: 100%;
		padding: 0 30px;
		box-sizing: border-box;

		.inlineinput {
			width: 32px;
			height: 35px;
			border: 1px solid #f2f2f2;
			line-height: 35px;
			text-align: center;
			color: #6683d5;
		}


		.tbJump {
			display: flex;
			justify-content: space-between;

			//input type = number 时 去除加减按钮
			input::-webkit-outer-spin-button,
			input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				appearance: none;
				margin: 0;
			}

			/* 火狐 */
			input {
				-moz-appearance: textfield;
			}
		}
	}
	.wrapper-content{
		border: none;
	}
	.el-input--prefix .el-input__inner {
		padding: 0 15px !important;
	}

	.el-input__prefix {
		display: none;
	}
}
</style>
