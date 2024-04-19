<template>
	<div class="PolicyCableway mt20">
        <div class="elesearch">
			<el-row type="flex" class="row-bg">
                 <el-col :span="8">
					<div>
						<span class="item3">企业名称：</span>
						<el-input size="medium" v-model.trim="data.companyName" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
                 <el-col :span="8">
					<div>
						<span class="item3">索道名称：</span>
						<el-input size="medium" v-model.trim="data.equipmentsName" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">设备代码：</span>
                        <el-input size="medium" v-model.trim="data.equipmentsCode" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
					</div>
				</el-col>
                <el-col :span="16">
					<div class="fr mr50">
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
            </el-row>
		</div>
        <div class="fg-line"></div>
        <div class="pd-style">
            <el-row type="flex" class="row-bg">
                <el-col :span="24">
					<div class="fr">
						<el-button type="primary" class="mb10" @click="exportList" round>导 出</el-button>
					</div>
                    <el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
						<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
						<el-table-column label="企业名称" min-width="150" prop="companyName">
                        </el-table-column>
						<el-table-column label="索道名称" align="center" min-width="60" prop="equipmentsName">
                        </el-table-column>
						<el-table-column label="设备代码" align="center" min-width="60" prop="equipmentsCode">
                        </el-table-column>
						<el-table-column label="索道类型" align="center" min-width="60" prop="equipmentsTypeName">
                        </el-table-column>
						<el-table-column label="上年度运送乘客人次(万)" align="center" min-width="100" prop="passengerLastyearName">
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime"></el-table-column>
                        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                    </el-table>
                    <div class="mt20" style="text-align: right;">
                        <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import StatisticService from '../../../service/StatisticService';
import ResourcesService from '../../../service/ResourcesService';
export default {
	name:'AccountSequip',
    props:{
        'options2':Array,
    },
	data() {
		return {
			data1:[],
			ResourcesService: new ResourcesService(),
			StatisticService:new StatisticService(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				companyName: '',
				equipmentsName: '',
				equipmentsCode:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
            },
            placeUse:[
				{
					value:'往复式',
					code:'1'
				},
				{
					value:'固定抱索器式',
					code:'2'
				},
				{
					value:'挂抱索器式',
					code:'3'
				},
				{
					value:'其他',
					code:'4'
				}
			],
            passengerLastyearList:[
				{
					value:'10万以下',
					code:'1'
				},
				{
					value:'10万（含）-50万',
					code:'2'
				},
				{
					value:'50万（含）-100万',
					code:'3'
				},
				{
					value:'100万及以上',
					code:'4'
				}
			],
			regionCoding:[],
			productList:[]
		};
	},
	computed: {
		
	},
	created() {
        
	},
	methods: {
        searchview() {
			this.data.pageNum = 1;
			this.currentPage = 1;
            this.policylistDT()
        },
        empty() {
			this.data = {
				companyName: '',
				equipmentsName: '',
				pageNum: 1,
				pageSize: 10,
				equipmentsCode:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
            };
			this.total = 0;
			this.data1 = [];
			this.regionCoding = [];
			this.policylistDT();
        },
        async policylistDT(){ // 获取投保单列表
			this.data.pageNum = this.currentPage;
			let res  = await this.StatisticService.postCableway(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list.map(i=>{
                     let {value} = this.placeUse.find(t => t.code == i.equipmentsType) || {value:''}
                    i.equipmentsTypeName =  value
                    let {value:passengerLastyearName} = this.passengerLastyearList.find(t => t.code == i.passengerLastyear) || {value:''}
					i.passengerLastyearName =  passengerLastyearName
                    return i
                });
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
        initData() {
			this.policylistDT();
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.policylistDT();
		},
        handleSelect(item) {
			console.log(item);
		},
		async exportList(){ // 导出
			if(this.total <= 5000){
				let formData = JSON.parse(JSON.stringify(this.data)) 
				let href = this.$apiUrl.CABLEWAYEXCEL +
					'?companyName=' + formData.companyName + 
					'&equipmentsName=' + formData.equipmentsName + 
					'&equipmentsCode=' +formData.equipmentsCode;
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出索道台账');
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
	}
};
</script>

<style lang="less">
.PolicyCableway {
	.el-dialog__title {
		color: #000000;
    	font-weight: bold;
		font-size: 16px;
	}
	.dialog-p {
		p {
			margin-bottom: 10px;
		}
		.font-black {
			color: #000000;
    		font-weight: bold;
		}
	}
	.choose-style {
		color: #e6a23c;
		background-color: #ffe7ba;
	}
	.btn-style {
		border-color: #ffa940;
		border-width: 1px;
		border-style: solid;
		color: #fa8c16;
	}
}
</style>
