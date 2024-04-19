<template>
	<div id="batchList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display: flex;">
            <span class="item3">操作人</span>
						<el-input placeholder="请输入操作人" v-model.trim="ruleForm.createBy" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display: flex;">
						<span class="item3">文件名称</span>
						<el-input placeholder="请输入文件名称" v-model.trim="ruleForm.fileName" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display: flex;">
						<span class="item3">状态</span>
						<el-select v-model="ruleForm.status" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in insuredCompanList" :key="item.valueField" :label="item.label" :value="item.valueField"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" style="margin-bottom: 0">
				<el-col :span="8">
					<div style="display: flex;">
						<span class="item3">模板编号</span>
						<el-input placeholder="请输入模板编号" v-model.trim="ruleForm.customCode" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="16">
					<div style="display: flex;text-align: right">
						<div class="elesearch-btn">
							<span @click="empty" class="empty">清空条件</span>
							<span @click="search" class="query-button">查询</span>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content-a">
			<div class="content-table">
				<div class="content-b">
					<el-table :data="batchList" :header-cell-style="getRowClass" border style="width: 100%">
						<el-table-column width="200px" prop="createTime" label="操作时间"></el-table-column>
						<el-table-column width="150px" prop="createTime" label="状态">
							<template slot-scope="scope">
								<span v-if="scope.row.status==0"  >{{scope.row.statusName}}<el-button   type="text" icon="el-icon-question" @click="reasonsFailure(scope.row.ext2)"></el-button></span>
								<span v-if="scope.row.status==1" style="color:#389E0D">{{scope.row.statusName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作信息">
							<template slot-scope="scope">
								<div>{{scope.row.createName}}</div>
								<div>
									<span style="color:#096DD9">{{scope.row.ext1}}</span>
									<span class="ml10" style="color:#919191">/ {{scope.row.customCode}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column width="150" prop="channelName" label="渠道"></el-table-column>
					</el-table>
				</div>
			</div>
			<BasePagenations :tolnum="total" :currentPage="ruleForm.pn" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="pageFlag" class="pr20"></BasePagenations>
		</div>
	</div>
</template>

<script>
import templateService from "@/service/template.js";
export default {
  name: "BatchList",
  data() {
    return {
      template: new templateService(),
      insuredCompanList: [{
        "label": "失败",
        "valueField": "0",
      }, {
        "label": "成功",
        "valueField": "1",
      },],
      ruleForm: {
        pn: 1,
        ps: 10,
        customCode:'',
        customName:'',
        customType:'',
				status:'',
				fileName:'',
				createBy:'',
				channelCode: "sequip", // 渠道编码
      },
      batchList: [],
      total: 0,
      pageFlag: false,
    };
  },
	created() {
		this.getData();
	},
	methods: {
    async getData() {//获取用户权限接口
      let form  = {
        pn:this.ruleForm.pn, // 页码
        ps:this.ruleForm.ps, // 大小
        orderby:this.ruleForm.orderby, // 排序字段
				desc:'', // 是否为倒序
				createBy:this.ruleForm.createBy,	// 操作人
				fileName:this.ruleForm.fileName,	// 文档名称
        customCode:this.ruleForm.customCode, // 模板编码 MB- 开头后面跟时间戳保留14位	
        channelCode:this.ruleForm.channelCode,  // 渠道编码
        status:this.ruleForm.status //    模板状态 0-启用 1-停用
      }
      let res = await this.template.logList(form); 
      if(res.data.code === '0000'){
        this.batchList = res.data.list.map(item=>{
					item.statusName = item.status === 0 ? '失败' : '成功'
					if(item.channelCode === 'sequip'){
						item.channelName = '特设渠道'
					}
          return item
				})
				this.total = res.data.total
				if (this.batchList.length > 0) {
					this.pageFlag = true;
				}
      }
		},
		search() {
			this.ruleForm.pn = 1;
			this.getData();
		},
		empty(){
			this.ruleForm = {
				pn: 1,
				ps: 10,
				cradUsr: "", // 社会信用代码
				batchType: "",// 批单类型
				branchCode: "", // 分支机构编码
				areas: [], // 地区编码,
				startDateStartTime: "", // 批单保险起期 开始时间
				startDateEndTime:'', // 批单保险起期 结束时间
				endorsementsNo:'', // 批单号
				applyNo:'', // 批单申请号
				channelCode: "sequip", // 渠道编码
			}
			this.getData();
		},
		goDetail(endorsementsNo) {// 查看详情
			let routeUrl = this.$router.resolve({
				path: "/BatchDetail",
				query: { endorsementsNo: endorsementsNo }
			});
			window.open(routeUrl.href, "_blank");
		},
		handleSizeChange(value) {
			this.ruleForm.ps = value;
			this.getData();
		},
		handleCurrentChange(value) {
			this.ruleForm.pn = value;
			this.getData();
    },
    async changeStatus(val){
      let data = {
        "channelCode": "sequip",
        "content": val.content,    // 相关配置内容
        "createBy": val.createBy,   // 创建人编码
        "customCode": val.customCode, //  模板编码 MB- 开头后面跟时间戳保留14位
        "customName": val.customName, // 模板名称 ,
        "customType": val.customType,    // : 模板类型 1-文件类型,2-代码类型 = ['1',
        "id": val.id,    // 
        "isDelete": false,  // 是否删除
        "outType": val.outType,    // 模板输出类型 ,
        "status": val.status === true?0:1,    // 模板状态 0-停用 1-启用 = ['0', '1']integerEnum:0, 1,
        "updateBy": window.sessionStorage.getItem('userCode')    //  更新人编码
      }
      let res = await this.template.templateUpdate(data)
      if(res.data.code === '0000'){
        this.$message.success('变更成功')
      } else {
      	val.status = !val.status
      }
    },
    // 删除确认提示
    tipsTemplate(id){
      this.$confirm('是否要确认删除，此模板', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTemplate(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  	async deleteTemplate(id){
      let res = await this.template.templateDelete(id)
      if(res.data.code === '0000'){
        this.$message.success('删除成功')
        this.getData()
      }
		},
		reasonsFailure(val){
			this.$message(val)
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			return rowIndex == 0 ? 'background:#f5f5f5' : '';
		},  
	}
};
</script>

<style lang="less">
#batchList {
	padding: 0px 0px 10px;
	margin: 0px 20px 0 20px;
  box-sizing: border-box;
	.elesearch{
		width: 100%;
		margin: 20px 0;
		background-color: #fff;
		padding: 20px 20px 20px;
		box-sizing: border-box;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 10%;
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
				width: 30%;
			}
		}
	}
	.elesearch-btn {
    width: 100%;
    height: 100%;
    text-align: right;
    color: #ffffff;
    .query-button {
      display: inline-block;
      width: 110px;
      height: 40px;
      background-color: #f3ac56;
      text-align: center;
      line-height: 40px;
      margin-left: 10px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      border-radius: 60px;
    }
  }

	 .empty {
	  color: #1890FF;
	  text-decoration: underline;
	  margin-right: 15px;
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

	.content-a {
		padding: 20px;
		background: #fff;
	}
	.content{
		width: 100%;
		height: 100%;
		// padding: 0 30px;
		box-sizing: border-box;
		.content-table{
			width: 100%;
			height: 100%;
			box-sizing: border-box;

			.content{
				width: 100%;
				height: 100%;
				padding:20px 20px 20px;
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
	.item4{
		display: block;
		width: 23%;
		margin-right: 10px;
	}
	.item2{
		width: 60%;
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
