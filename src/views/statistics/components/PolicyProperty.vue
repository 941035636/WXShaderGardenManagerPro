<template>
	<div class="policy-property mt20">
        <div class="elesearch">
			<el-row type="flex" class="row-bg">
                 <el-col :span="8">
					<div>
						<span class="item3">项目名称：</span>
						<el-input size="medium" v-model.trim="data.name" placeholder="请输入项目名称" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">物业地址：</span>
						<el-cascader size="medium" filterable :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="mr50">
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
						<el-table-column label="物业项目信息" min-width="100">
                            <template slot-scope="scope">
                                <p>物业项目名称：{{scope.row.name}}</p>
                                <p>坐落地址：{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span><span v-if="scope.row.address">/{{scope.row.address}}</span><span v-if="scope.row.lngAndLag" class="col-blue">（有坐标）</span></p>
								<p v-if="scope.row.area">建筑面积：{{scope.row.area}}（平米）<span>/ 车位数：{{scope.row.carSpace}}个</span><span>/ 游泳池数：{{scope.row.swimmingPool}}个</span></p>
                            </template>
                        </el-table-column>
						<el-table-column label="项目类型" prop='style'></el-table-column>
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
import ResourcesService from '../../../service/ResourcesService';
import StatisticService from '../../../service/StatisticService';
export default {
	name:'AccountYW',
    props:{
        'options2':Array,
    },
	data() {
		return {
			data1:[],
            ResourcesService: new ResourcesService(),
			StatisticService: new StatisticService(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
                name: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
            },
            regionCoding:[],//选择的地区
			placeUse:[
				{
					value:'行政、事业单位物业',
					code:'20DT177432'
				},
				{
					value:'商业物业',
					code:'20DT805228'
				},
				{
					value:'住宅物业（除高级公寓、别墅、度假村物业）',
					code:'20DT849291'
				},
				{
					value:'住宅物业（限高级公寓、别墅、度假村物业）',
					code:'20DT289505'
				},
				{
					value:'工业物业',
					code:'20DT143795'
				},
				{
					value:'商住混合型物业',
					code:'20DT529233'
				},
				{
					value:'其他物业',
					code:'20DT150235'
				}
			],
		};
	},
	computed: {
		
	},
	created() {
        
	},
	methods: {
        searchview() {
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
			this.data.pageNum = 1;
			this.currentPage = 1;
            this.policylistWY()
        },
		handleClose() {
			this.row = {};
			this.dialogVisible1 = false;
		},
        empty() {
			this.data = {
				pageNum: 1,
				pageSize: 10,
				name: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
			};
			this.total = 0;
			this.data1 = [];
			this.regionCoding = [];
			this.policylistWY()
        },
        initData() {
            if(this.data1.length == 0) {
                this.policylistWY()
            }
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        async policylistWY(){
			this.data.pageNum = this.currentPage;
			let res  = await this.StatisticService.postWYAccountList(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				res.list.forEach(i => {
					i.styleName = this.placeUse.find(t => t.code == i.style) ? this.placeUse.find(t => t.code == i.style).value : ''
				})
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.policylistWY();
		},
        handleSelect(item) {
			console.log(item);
		},
		async exportList(){ // 导出
			if(this.total <= 5000){
				let formData = JSON.parse(JSON.stringify(this.data)) 
				let href = this.$apiUrl.EXPORTWYACCOUNT +
					'?name=' + formData.name + 
					'&provinceName=' +formData.provinceName + 
					'&cityName=' +formData.cityName + 
					'&countryName=' +formData.countryName;
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出物业台账');
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
.policy-property {
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
