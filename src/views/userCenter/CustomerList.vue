<template>
	<div id="customerList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
          <span class="item3">企业名称</span>
          <el-input size="medium" placeholder="请输入企业名称" v-model.trim="data.customerName " class="item2" clearable></el-input>
				</el-col>
				<el-col :span="8">
          <span class="item3">社会信用代码</span>
          <el-input size="medium" placeholder="请输入社会信用代码" v-model.trim="data.usCreditCode " class="item2" clearable></el-input>
				</el-col>
				<el-col :span="8">
					<div>
            <span class="item3">推送时间</span>
						<el-date-picker size="medium" v-model="data.createTimeStart" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
            <span>至</span>
						<el-date-picker size="medium" v-model="data.createTimeEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="item3">投保单号</span>
          <el-input size="medium" placeholder="请输入投保单号" v-model.trim="data.applicationFormCode" class="item2" clearable></el-input>
				</el-col>
        <el-col :span="8">
          <span class="item3">合同编号</span>
          <el-input size="medium" placeholder="请输入合同编号" v-model.trim="data.contractCode" class="item2" clearable></el-input>
				</el-col>
				<el-col :span="8">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" size="medium" round class="empty-button">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
      <div class="f16">
				<span class="ml20">推送状态：</span>
				<el-button :type="item.code == productCategory1 ? 'warning' : ''" size="medium" round v-for="(item,index) in productCategory" :key="index" class="mr10 w80" @click="checkSort(item)">{{item.value}}</el-button>
			</div>
      <div class="content-table mt10">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="createTime"
            label="推送时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="applicationFormCode"
            label="投保单号">
          </el-table-column>
          <el-table-column
            label="推送信息">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.customerName}}</span>
                <span>/</span>
                <span>{{scope.row.usCreditCode}}</span>
              </div>
              <div>
                <span>客户编码：</span>
                <span>{{scope.row.customerCode}}</span>
                <span>合同编码：</span>
                <span>{{scope.row.contractCode}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="120"
            label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.state == '1'">
                <span style="color:#52C41A">成功</span>
                <span @click="seeMessage(scope.row)" class="button-style" type="text">查看报文</span>
              </div>
              <div v-if="scope.row.state == '0'">
                <span  style="color:#F5222D">失败</span>
                <el-tooltip class="item" effect="light" :content="scope.row.failReason" placement="top">
                  <i class="el-icon-question col-org"></i>
                </el-tooltip> 
              </div>
            </template>
          </el-table-column>
        </el-table>
			</div>
		</div>
    
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
    <el-dialog title="推送报文" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div class="mt10">
            <div class="yaml-editor">
                <pre>{{jsonData}}</pre>
            </div>
        </div>
    </el-dialog>
	</div>
</template>

<script>
import userService from '@/service/UserService'
export default {
	data() {
		return {
      userService: new userService(),
			proSortName:'',
      showFlag:false,
      dialogTableVisible:false,
      productCategory:[
        {
            "code":"quanBu",
            "value":"全部",
            "name":"电梯责任险",
            "index":""
        },
        {
            "code":"chengGong",
            "value":"成功",
            "index":"1"
        },
        {
            "code":"shiBai",
            "value":"失败",
            "index":"0"
        }
      ],
      data:{
        "applicationFormCode": "",  //  投保单号 
        "content": "",  // 推送入参
        "contractCode": "", // 合同编号 ,
        "contractEndDate": "", // 合同止期
        "contractStartDate": "",  // 合同起期
        "createTime": "", // 创建时间
        "createTimeEnd": "",  // 推送时间结束
        "createTimeStart": "",  // 推送时间开始
        "customerCode": "", // 客户编号
        "customerName": "", // 客户名称
        "failReason": "", // 推送失败原因
        "id": "", // 主键
        "isDeleted": "",  // 是否删除：1是 0否
        "pageNum": 1, // 
        "pageSize": 10,  // 
        "rn": 0,  // 
        "state": "",  // 推送状态：1成功 0失败 ,
        "updateTime": "", // 更新时间 ,
        "usCreditCode": "", //社会信用代码
      },
      productCategory1:'quanBu',
      total:0,
      pageNum:1,
      pagesize: 10,
			currentPage:1,
      total:0,
      tableData:[],
      jsonData:{},
		}
	},
	created(){
		this.getList()
	},
	methods: {
    // 列表查询
    async getList(){
      let data = JSON.parse(JSON.stringify(this.data))
      data.createTimeEnd = data.createTimeEnd ? data.createTimeEnd + ' 23:59:59' : ''
      data.createTimeStart = data.createTimeStart ? data.createTimeStart + ' 00:00:00' : ''
      data.pageNum = this.pageNum
      let res = await this.userService.getCustomerList(data)
      if(res.code === '0000') {
        this.tableData = res.list
        this.total = res.total
      }
    },
    //查询
    searchview() { 
			this.pageNum = 1;
			this.currentPage = 1;
			this.getList();
		},
    //清空
    empty() {
			this.data = {
        "applicationFormCode": "",  //  投保单号 
        "content": "",  // 推送入参
        "contractCode": "", // 合同编号 ,
        "contractEndDate": "", // 合同止期
        "contractStartDate": "",  // 合同起期
        "createTime": "", // 创建时间
        "createTimeEnd": "",  // 推送时间结束
        "createTimeStart": "",  // 推送时间开始
        "customerCode": "", // 客户编号
        "customerName": "", // 客户名称
        "failReason": "", // 推送失败原因
        "id": "", // 主键
        "isDeleted": "",  // 是否删除：1是 0否
        "pageNum": 1, // 
        "pageSize": 10,  // 
        "rn": 0,  // 
        "state": "",  // 推送状态：1成功 0失败 ,
        "updateTime": "", // 更新时间 ,
        "usCreditCode": "", //社会信用代码
      };
			this.productCategory1 = 'quanBu';
			this.pageNum = 1;
			this.currentPage = 1;
			this.getList();
		},
    // 切换状态查询
    checkSort(item) {
      this.productCategory1 = item.code
			this.data.state = item.index
			this.pageNum = 1;
      this.getList();
		},
    handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.getList();
		},
    seeMessage(e){
      this.dialogTableVisible = true
      let content = JSON.parse(e.content)
      this.jsonData = JSON.stringify(content,null,4) 
    },
    close() {
    },
	},
}
</script>

<style lang="less">
#customerList {
	padding-bottom: 80px;
	box-sizing: border-box;
  .elesearch{
		width: calc(100% - 40px);
		min-height: 160px;
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
        width: 100px;
				float: right;
				margin-left: 30px;
				background-color: #DCDCDC;
				color: #333333;
				font-weight: 600;
			}
		}
	}
  .content{
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
    padding-top: 20px;
		background-color: #ffffff;
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
		.el-button:hover {
			background-color: #ffe7ba;
		}
		.content-table{
			width: 100%;
			padding: 20px 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;
			.button-style{
				color: #2491fc;
				font-weight: 500;
				text-decoration: underline;
        cursor: pointer;
			}
      .col-org {
        color: #DB9728;
      }
		}
	}
  .content-total{
		// width: 85.2%;
		margin: 30px 30px 0 20px;
		bottom: 0;
		text-align: right;
	}
  .yaml-editor{
    margin-top: 10px;
    min-height: 400px;
    border: 1px solid #eaeaea;
    box-sizing: border-box;
    color: #CB6F5C;
    padding: 20px;
  }
}

</style>
