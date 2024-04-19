<template>
	<div class="policy-content mt20">
        <div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">单位名称：</span>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.companyName" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">姓名：</span>
						<el-input size="medium" v-model.trim="data.name" placeholder="请输入内容" class="item2" clearable ></el-input>
					</div>
				</el-col>
                 <el-col :span="8">
					<div>
						<span class="item3">证件号：</span>
						<el-input size="medium" v-model.trim="data.licenceNo" placeholder="请输入内容" class="item2" clearable ></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">坐落地址：</span>
						<el-cascader size="medium" filterable :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
                <el-col :span="8">
					<div>
						
					</div>
				</el-col>
				<el-col :span="8">
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
						<el-table-column label="单位名称" prop="companyName"></el-table-column>
						<el-table-column label="详细地址">
                            <template slot-scope="scope">
                                <p v-if="scope.row.provinceName">
									<span>{{scope.row.provinceName}}</span>
									<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span>
									<span v-if="scope.row.countryName">/{{scope.row.countryName}}</span>
									<span v-if="scope.row.address">{{scope.row.address}}</span>
									<span v-if="scope.row.lngAndLag" class="col-blue">（有坐标）</span>
								</p>
                            </template>
                        </el-table-column>
						<el-table-column label="姓名" min-width="50" prop="name"></el-table-column>
						<el-table-column label="证件类型">
                            <template slot-scope="scope">
                                <p>
									<span v-if="scope.row.licenceType == 1">中国居民身份证</span>
									<span v-if="scope.row.licenceType == 2">护照</span>
									<span v-if="scope.row.licenceType == 3">澳门身份证</span>
									<span v-if="scope.row.licenceType == 4">军官证</span>
								</p>
                            </template>
                        </el-table-column>
						<el-table-column label="证件号" min-width="110"  prop="licenceNo"></el-table-column>
                        <el-table-column label="岗位" align="center" min-width="50">
                            <template slot-scope="scope">
                                <p>
									<span v-if="scope.row.post">{{scope.row.post}}</span>
									<span v-else>--</span>
								</p>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="有无工伤保险">
                            <template slot-scope="scope">
							    <p v-if="scope.row.isInsured == '1'">有工伤保险</p>
							    <p v-else-if="scope.row.isInsured == '0'">无工伤保险</p>
							    <p v-else>--</p>
                            </template>
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
	name:'AccountPerson',
	props:{
        'options2':Array,
    },
	data() {
		return {
			data1:[],
			StatisticService: new StatisticService(),
			ResourcesService: new ResourcesService(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				licenceNo: '',
				name: '',
				companyName: '',
				provinceName:'',
				cityName: '',// (string, optional): 市名称 ,
				countryName: '',// (string, optional): 区/县名称 ,
            },
			regionCoding:[]
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
            this.policylistGZ()
        },
        empty() {
			this.data = {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				licenceNo: '',
				name: '',
				companyName: '',
				provinceName:'',
				cityName: '',// (string, optional): 市名称 ,
				countryName: '',// (string, optional): 区/县名称 ,
            };
			this.regionCoding = [];
			this.total = 0;
			this.data1 = [];
			this.policylistGZ()
        },
        async policylistGZ(){ // 获取投保单列表
			if(this.regionCoding.length == 1){
				this.data.provinceName = this.options2.find(i => i.value == this.regionCoding[0]) ? this.options2.find(i => i.value == this.regionCoding[0]).label : '';
				this.data.cityName = '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 2){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = proData.children.find(t => t.value == this.regionCoding[1]) ? proData.children.find(t => t.value == this.regionCoding[1]).label : '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 3){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				let cityData = proData.children.find(t => t.value == this.regionCoding[1]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = cityData ? cityData.label : '';
				this.data.countryName = cityData.children.find(t => t.value == this.regionCoding[2]) ? cityData.children.find(t => t.value == this.regionCoding[2]).label : '';
			}else{
				this.data.provinceName = '';
				this.data.cityName = '';
				this.data.countryName = '';
			};
			this.data.pageNum = this.currentPage;
			let res  = await this.StatisticService.postPERAccountList(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
        initData() {
            this.policylistGZ()
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
			this.policylistGZ();
		},
		async exportList(){ // 导出
			if(this.total <= 5000){
				let formData = JSON.parse(JSON.stringify(this.data)) 
				let href = this.$apiUrl.EXPORTPERACCOUNT +
					'?companyName=' + formData.companyName + 
					'&name=' + formData.name + 
					'&licenceNo=' + formData.licenceNo + 
					'&provinceName=' +formData.provinceName + 
					'&cityName=' +formData.cityName + 
					'&countryName=' +formData.countryName;
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出人员台账');
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
.policy-content {
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
